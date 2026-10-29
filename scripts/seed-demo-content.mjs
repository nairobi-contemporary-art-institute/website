#!/usr/bin/env node
/**
 * Seed researched content (artist bios, texts, exhibition links, timeline, programmes)
 * from JSON files in scripts/data/demo-content/ into Sanity.
 *
 * Inputs (all optional; each step skips if its file is missing):
 *   bios-batch-*.json   [{_id, bioShort, bioLong[], confidence, ...}]
 *   texts-batch-*.json  [{slug, title, textType, standfirst, bodyMarkdown, sources[], ...}]
 *   structure.json      {exhibitionArtists[], exhibitionFixes[], timeline[], programs[]}
 *   merges.json         [{keep, drop}] duplicate artists to merge
 *
 * Rules: artist bios and images are only set where missing (setIfMissing); texts,
 * timeline entries and programmes use deterministic ids so re-runs replace them.
 * Every write is logged to scripts/data/demo-seed-manifest.json.
 *
 * Usage:
 *   node scripts/seed-demo-content.mjs                         # dry run, all steps
 *   node scripts/seed-demo-content.mjs --only=bios,texts       # dry run, some steps
 *   node scripts/seed-demo-content.mjs --apply [--only=...]    # write (needs SANITY_API_TOKEN)
 * Steps: merges, bios, exhibitions, texts, timeline, programs
 */
import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
const DIR = 'scripts/data/demo-content'
const MANIFEST = 'scripts/data/demo-seed-manifest.json'

const token = process.env.SANITY_API_TOKEN
if (!token) throw new Error('SANITY_API_TOKEN env var required (see .env.local)')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token,
})

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : []
const log = (action, id, type, note = '') => {
    console.log(`${APPLY ? '' : '[dry] '}${action.padEnd(8)} ${type.padEnd(14)} ${id} ${note}`)
    if (APPLY) manifest.push({ at: new Date().toISOString(), action, id, type, note })
}

const key = () => randomBytes(6).toString('hex')
const intl = (type, value) => [{ _key: 'en', _type: `internationalizedArray${type}Value`, value }]
const ref = (id) => ({ _key: key(), _type: 'reference', _ref: id })
const slugify = (s) =>
    s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90)

const readJson = (name) => (existsSync(join(DIR, name)) ? JSON.parse(readFileSync(join(DIR, name), 'utf8')) : null)
const readBatches = (prefix) =>
    existsSync(DIR)
        ? readdirSync(DIR)
              .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
              .sort()
              .flatMap((f) => readJson(f) || [])
        : []

// ── Markdown → Portable Text ────────────────────────────────────────────────
function inline(text) {
    const markDefs = []
    const children = []
    const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\))/g
    let last = 0
    let m
    const push = (t, marks = []) => t && children.push({ _key: key(), _type: 'span', text: t, marks })
    while ((m = re.exec(text))) {
        push(text.slice(last, m.index))
        if (m[2]) push(m[2], ['strong'])
        else if (m[3] || m[4]) push(m[3] || m[4], ['em'])
        else if (m[5]) {
            const k = key()
            markDefs.push({ _key: k, _type: 'link', href: m[6], blank: /^https?:/.test(m[6]) })
            push(m[5], [k])
        }
        last = re.lastIndex
    }
    push(text.slice(last))
    if (!children.length) push(' ')
    return { children, markDefs }
}

function markdownToBlocks(md, { allowH3 = true } = {}) {
    const blocks = []
    const paras = String(md || '').replace(/\r/g, '').split(/\n{2,}/)
    for (const raw of paras) {
        const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
        if (!lines.length) continue
        if (lines.every((l) => /^[-*] /.test(l)) || lines.every((l) => /^\d+\. /.test(l))) {
            const numbered = /^\d+\. /.test(lines[0])
            for (const l of lines) {
                blocks.push({
                    _key: key(), _type: 'block', style: 'normal', listItem: numbered ? 'number' : 'bullet', level: 1,
                    ...inline(l.replace(/^([-*]|\d+\.) /, '')),
                })
            }
            continue
        }
        const text = lines.join(' ')
        let style = 'normal'
        let body = text
        if (/^### /.test(text)) [style, body] = [allowH3 ? 'h3' : 'h2', text.slice(4)]
        else if (/^##? /.test(text)) [style, body] = ['h2', text.replace(/^##? /, '')]
        else if (/^> /.test(text)) [style, body] = ['blockquote', text.replace(/^> ?/, '').replace(/ > /g, ' ')]
        blocks.push({ _key: key(), _type: 'block', style, ...inline(body) })
    }
    return blocks
}

const paragraphsToBlocks = (paras) => markdownToBlocks((Array.isArray(paras) ? paras : [paras]).join('\n\n'))

// ── helpers ─────────────────────────────────────────────────────────────────
async function commit(tx, label) {
    if (!APPLY) return
    await tx.commit({ visibility: 'async' })
    console.log(`  ✓ committed ${label}`)
}

async function uploadImageFromUrl(url, filename) {
    if (!APPLY) return 'image-DRY-RUN'
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buf, { filename })
    return asset._id
}

function deepReplaceRef(node, from, to) {
    if (Array.isArray(node)) return node.map((n) => deepReplaceRef(n, from, to))
    if (node && typeof node === 'object') {
        const out = {}
        for (const [k, v] of Object.entries(node)) out[k] = k === '_ref' && v === from ? to : deepReplaceRef(v, from, to)
        return out
    }
    return node
}

// ── steps ───────────────────────────────────────────────────────────────────
async function stepMerges() {
    const merges = readJson('merges.json') || []
    for (const { keep, drop, name } of merges) {
        const docs = await client.fetch('*[references($id)]', { id: drop })
        const tx = client.transaction()
        for (const doc of docs) {
            const { _rev, _updatedAt, _createdAt, ...rest } = doc
            tx.createOrReplace(deepReplaceRef(rest, drop, keep))
            log('repoint', doc._id, doc._type, `${drop} → ${keep}`)
        }
        if (name) {
            tx.patch(keep, (p) => p.set({ name: intl('String', name) }))
            log('rename', keep, 'artist', name)
        }
        await commit(tx, `repoint ${docs.length} docs to ${keep}`)
        if (APPLY) await client.delete(drop)
        log('delete', drop, 'artist', `merged into ${keep}`)
    }
}

async function stepBios() {
    const bios = readBatches('bios-batch-')
    const artists = await client.fetch(
        `*[_type=="artist" && _id in $ids]{_id, "hasBio": defined(bio), "hasLong": defined(longBio), "hasImage": defined(image),
          "work": *[_type=="work" && references(^._id) && defined(image.asset)] | order(year desc)[0]{"title": title[0].value, year, "ref": image.asset._ref}}`,
        { ids: bios.map((b) => b._id) },
    )
    const byId = Object.fromEntries(artists.map((a) => [a._id, a]))
    let tx = client.transaction()
    let n = 0
    for (const b of bios) {
        const a = byId[b._id]
        if (!a) { console.log(`  skip ${b._id} (not found / merged)`); continue }
        const set = {}
        if (!a.hasBio && b.bioShort) set.bio = intl('BlockContent', paragraphsToBlocks(b.bioShort))
        if (!a.hasLong && b.bioLong?.length) set.longBio = intl('BlockContent', paragraphsToBlocks(b.bioLong))
        if (!a.hasImage && a.work?.ref) {
            const label = [a.work.title, a.work.year].filter(Boolean).join(', ')
            set.image = {
                _type: 'image',
                asset: { _type: 'reference', _ref: a.work.ref },
                alt: `${b.canonicalName || b.name}, ${label}`,
                caption: intl('String', label),
            }
        }
        if (!Object.keys(set).length) continue
        tx.patch(b._id, (p) => p.setIfMissing(set))
        log('patch', b._id, 'artist', `${Object.keys(set).join('+')} (${b.confidence})`)
        if (++n % 25 === 0) { await commit(tx, `${n} artists`); tx = client.transaction() }
    }
    await commit(tx, `${n} artists`)
}

async function stepExhibitions() {
    const s = readJson('structure.json')
    if (!s) return
    const existing = await client.fetch('*[_type=="exhibition"]{_id, "artists": artists[]._ref, "hasImage": defined(mainImage), "hasDesc": defined(description)}')
    const byId = Object.fromEntries(existing.map((e) => [e._id, e]))
    const valid = new Set(await client.fetch('*[_type=="artist"]._id'))
    const tx = client.transaction()
    for (const e of s.exhibitionArtists || []) {
        const cur = byId[e.exhibitionId]
        if (!cur) continue
        const have = new Set(cur.artists || [])
        const add = (e.artistIds || []).filter((id) => valid.has(id) && !have.has(id))
        if (!add.length) continue
        tx.patch(e.exhibitionId, (p) => p.setIfMissing({ artists: [] }).append('artists', add.map(ref)))
        log('patch', e.exhibitionId, 'exhibition', `+${add.length} artists`)
    }
    for (const f of s.exhibitionFixes || []) {
        const cur = byId[f.exhibitionId]
        if (!cur) continue
        if (f.field === 'description' && !cur.hasDesc) {
            tx.patch(f.exhibitionId, (p) => p.set({ description: intl('BlockContent', markdownToBlocks(f.value)) }))
            log('patch', f.exhibitionId, 'exhibition', 'description')
        } else if (f.field === 'mainImage' && !cur.hasImage) {
            const assetId = await uploadImageFromUrl(f.value, `${f.exhibitionId}.jpg`)
            tx.patch(f.exhibitionId, (p) =>
                p.set({ mainImage: { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt: f.alt || 'Exhibition view' } }),
            )
            log('patch', f.exhibitionId, 'exhibition', 'mainImage')
        }
    }
    await commit(tx, 'exhibitions')
}

async function stepTexts() {
    const texts = readBatches('texts-batch-')
    if (!texts.length) return
    const [artists, exhibitions, samples] = await Promise.all([
        client.fetch('*[_type=="artist"]{_id, "slug": slug.current}'),
        client.fetch('*[_type=="exhibition"]{_id, "slug": slug.current}'),
        client.fetch('*[_type=="textPiece" && (_id match "sample-*" || title[0].value match "[Sample]*")]._id'),
    ])
    const artistBySlug = Object.fromEntries(artists.map((a) => [a.slug, a._id]))
    const exBySlug = Object.fromEntries(exhibitions.map((e) => [e.slug, e._id]))
    const tx = client.transaction()
    for (const id of samples) {
        tx.delete(id)
        log('delete', id, 'textPiece', 'placeholder sample')
    }
    for (const t of texts) {
        const id = `textPiece-${slugify(t.slug || t.title)}`
        const sources = (t.sources || []).map((s) => `- [${s.title || s.url}](${s.url})`).join('\n')
        const doc = {
            _id: id,
            _type: 'textPiece',
            title: intl('String', t.title),
            slug: { _type: 'slug', current: slugify(t.slug || t.title) },
            textType: t.textType || 'essay',
            publishedAt: new Date(t.publishedAt || Date.now()).toISOString(),
            byline: intl('String', t.byline || 'NCAI Editorial'),
            standfirst: intl('Text', (t.standfirst || '').slice(0, 280)),
            body: intl('TextBody', markdownToBlocks(t.bodyMarkdown)),
            ...(sources && { notes: intl('BlockContent', markdownToBlocks(`## Sources\n\n${sources}`)) }),
            ...(t.participants?.length && {
                participants: t.participants.map((p) => ({
                    _key: key(), _type: 'participant', name: p.name, role: p.role,
                    initials: p.name.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 6),
                    ...(artistBySlug[slugify(p.name)] && { person: { _type: 'reference', _ref: artistBySlug[slugify(p.name)] } }),
                })),
            }),
            ...(t.leadImageRef && {
                leadImage: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: t.leadImageRef },
                    alt: t.leadImageAlt || t.title,
                    ...(t.leadImageCaption && { caption: intl('String', t.leadImageCaption) }),
                    credit: 'Courtesy Nairobi Contemporary Art Institute',
                },
                leadLayout: 'wide',
            }),
            relatedArtists: (t.relatedArtistSlugs || []).map((s) => artistBySlug[s]).filter(Boolean).map(ref),
            relatedExhibitions: (t.relatedExhibitionSlugs || []).map((s) => exBySlug[s]).filter(Boolean).map(ref),
        }
        tx.createOrReplace(doc)
        log('upsert', id, 'textPiece', `${doc.textType} · ${doc.relatedArtists.length}a/${doc.relatedExhibitions.length}x`)
    }
    await commit(tx, `${texts.length} texts`)
}

async function stepTimeline() {
    const s = readJson('structure.json')
    if (!s?.timeline?.length) return
    const old = await client.fetch('*[_type=="timelineEvent" && !(_id match "timelineEvent-*")]._id')
    const tx = client.transaction()
    for (const t of s.timeline) {
        const id = `timelineEvent-${t.year}-${slugify(t.title).slice(0, 40)}`
        const sources = (t.sources || []).map((u) => `[Source](${u})`).join(' · ')
        tx.createOrReplace({
            _id: id,
            _type: 'timelineEvent',
            year: Number(t.year),
            title: intl('String', t.title),
            description: intl('BlockContent', markdownToBlocks(t.descriptionMarkdown)),
            variant: t.variant || 'standard',
        })
        log('upsert', id, 'timelineEvent', sources ? `${t.sources.length} sources` : '')
    }
    for (const id of old) {
        tx.delete(id)
        log('delete', id, 'timelineEvent', 'generic placeholder')
    }
    await commit(tx, 'timeline')
}

async function stepPrograms() {
    const s = readJson('structure.json')
    if (!s?.programs?.length) return
    const tx = client.transaction()
    const created = []
    for (const p of s.programs) {
        const id = `program-${slugify(p.slug || p.title)}`
        let image
        if (p.imageUrl) {
            try {
                image = { _type: 'image', asset: { _type: 'reference', _ref: await uploadImageFromUrl(p.imageUrl, `${id}.jpg`) } }
            } catch (err) {
                console.log(`  image failed for ${id}: ${err.message}`)
            }
        }
        tx.createOrReplace({
            _id: id,
            _type: 'program',
            title: intl('String', p.title),
            slug: { _type: 'slug', current: slugify(p.slug || p.title) },
            programType: p.programType || 'Other',
            audience: p.audience || 'all',
            description: intl('BlockContent', markdownToBlocks(p.descriptionMarkdown)),
            ...(p.excerpt && { excerpt: intl('BlockContent', markdownToBlocks(p.excerpt)) }),
            ...(image && { mainImage: image }),
        })
        created.push(id)
        log('upsert', id, 'program', p.sourceUrl || '')
    }
    // Mock programmes go once nothing references them (education page features the real ones).
    const mocks = s.mockPrograms || []
    if (mocks.length) {
        tx.patch('educationPage', (p) => p.set({ featuredPrograms: created.slice(0, 3).map(ref) }))
        log('patch', 'educationPage', 'educationPage', 'featuredPrograms → real programmes')
    }
    await commit(tx, 'programs')
    for (const id of mocks) {
        const refs = await client.fetch('count(*[references($id)])', { id })
        if (refs && APPLY) { console.log(`  keep ${id}: still referenced`); continue }
        if (APPLY) await client.delete(id)
        log('delete', id, 'program', 'mock/test data')
    }
}

const STEPS = { merges: stepMerges, bios: stepBios, exhibitions: stepExhibitions, texts: stepTexts, timeline: stepTimeline, programs: stepPrograms }
for (const [name, fn] of Object.entries(STEPS)) {
    if (ONLY.length && !ONLY.includes(name)) continue
    console.log(`\n── ${name}`)
    await fn()
}
if (APPLY) writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
console.log(APPLY ? `\nDone. Manifest: ${MANIFEST}` : '\nDry run only. Re-run with --apply to write.')
