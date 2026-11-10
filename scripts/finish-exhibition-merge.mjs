#!/usr/bin/env node
/**
 * Follow-up to merge-duplicate-exhibitions.mjs: details from the NCAI press kits and the
 * Tabula Rasa exhibition guide (PDFs linked from the old Wix pages).
 *
 * Armitage / Lassnig / Van Rampelberg
 *   - upload the press kit PDF; admission "Admission Free" and location "Main Gallery" (as Tabula Rasa)
 *   - captions for the two uncredited works get explicit "to be confirmed" placeholders
 *   - "Thomas D. Trummer" → "KUB Director Thomas D. Trummer" (press kit wording)
 * Tabula Rasa
 *   - upload press kit + exhibition guide; curator Don Handa (new person, no profile page)
 *   - real captions for the two works the guide lets us identify with certainty
 *     (Uneasy Lies the Head, Consta(Nations)); the template-title ("Title 2") hero caption
 *     becomes a "to be confirmed" placeholder. NCAI fills the rest in Studio.
 * Michael Armitage (artist): lives and works between London, Indonesia and Nairobi (confirmed by NCAI).
 *
 * Usage:
 *   node scripts/finish-exhibition-merge.mjs           # dry run
 *   node scripts/finish-exhibition-merge.mjs --apply   # write to Sanity (needs SANITY_API_TOKEN)
 */
import { createReadStream } from 'node:fs'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const token = process.env.SANITY_API_TOKEN
if (!token) throw new Error('SANITY_API_TOKEN env var required (see .env.local)')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token,
})

const ARMITAGE_SHOW = '4e76056f-abdc-4f49-82f9-c1605ad15c65'
const TABULA = '64dab0f6-90d8-4c5d-b6fe-be021de99409'
const ARMITAGE_ARTIST = 'mg2pWkoVlcJRqpFC3I1r0h'
const DATA = 'scripts/data/exhibition-merge'

const intl = (value) => [{ _key: 'en', _type: 'internationalizedArrayStringValue', value }]
const ref = (id) => ({ _type: 'reference', _ref: id })
const log = (...a) => console.log(...a)

async function uploadPdf(file) {
    if (!APPLY) return { _id: `(would upload ${file})` }
    return client.assets.upload('file', createReadStream(`${DATA}/${file}`), { filename: file, contentType: 'application/pdf' })
}
const fileField = (asset) => ({ _type: 'file', asset: ref(asset._id) })

// Replace text inside every span of a block-content value; returns [newValue, changeCount].
function replaceInBlocks(blocks, from, to) {
    let n = 0
    const next = blocks.map((b) =>
        b._type !== 'block' ? b : { ...b, children: b.children.map((c) => {
            if (!c.text?.includes(from)) return c
            n += 1
            return { ...c, text: c.text.replace(from, to) }
        }) }
    )
    return [next, n]
}
function patchIntlBlocks(array, from, to) {
    let total = 0
    const next = (array || []).map((entry) => {
        if (!Array.isArray(entry.value)) return entry
        const [value, n] = replaceInBlocks(entry.value, from, to)
        total += n
        return { ...entry, value }
    })
    return [next, total]
}

async function run() {
    const [armitage, tabula, artist] = await Promise.all([
        client.getDocument(ARMITAGE_SHOW),
        client.getDocument(TABULA),
        client.getDocument(ARMITAGE_ARTIST),
    ])

    // ── Armitage / Lassnig / Van Rampelberg ─────────────────────────────────
    const pressKitA = await uploadPdf('armitage-lassnig-rampelberg-press-kit.pdf')
    const gallery = armitage.gallery.map((g) => {
        if (g._key === 'lassnig-drawing') return { ...g, caption: intl('Maria Lassnig, [title and year to be confirmed]') }
        if (g._key === armitage.gallery[3]?._key) return { ...g, caption: intl('Michael Armitage, [title and year to be confirmed]') }
        return g
    })
    const [description, descChanges] = patchIntlBlocks(armitage.description, 'and Thomas D. Trummer', 'and KUB Director Thomas D. Trummer')
    log('Armitage show: press kit, admission, location,', gallery.filter((g) => g.caption?.[0]?.value?.includes('to be confirmed')).length, 'placeholder captions,', `${descChanges} description edit(s)`)

    // ── Tabula Rasa ─────────────────────────────────────────────────────────
    const pressKitT = await uploadPdf('tabula-rasa-press-kit.pdf')
    const guideT = await uploadPdf('tabula-rasa-exhibition-guide.pdf')

    let curatorId = (await client.fetch(`*[_type == "person" && slug.current == "don-handa"][0]._id`)) || 'person-don-handa'
    const curatorExists = !!(await client.getDocument(curatorId))
    if (!curatorExists) log(`Tabula Rasa: create person ${curatorId} (Don Handa, staff, no profile page)`)

    const tabulaGallery = tabula.gallery.map((g, i) => {
        if (i === 0) return { ...g, caption: intl('Peterson Kamwathi, Uneasy Lies the Head, 2023–24. Graphite, colour pencil, soft pastel, spray paint, silkscreen on 300gsm Canson watercolour paper.') }
        if (i === 4) return { ...g, caption: intl('Peterson Kamwathi, Consta(Nations), 2023–25. Charcoal, graphite pencil, colour pencil, soft pastel, silkscreen, woodcut, spray paint on 300gsm Arches aquarelle paper.') }
        return g
    })
    log('Tabula Rasa: press kit, guide, curator Don Handa, 2 work captions, hero caption → placeholder')

    // ── Michael Armitage (artist) ───────────────────────────────────────────
    const LIVES_FROM = 'He lives and works in Indonesia and Nairobi.'
    const LIVES_TO = 'He lives and works between London, Indonesia and Nairobi.'
    const [bio, bioN] = patchIntlBlocks(artist.bio, LIVES_FROM, LIVES_TO)
    const [longBio, longN] = patchIntlBlocks(artist.longBio, LIVES_FROM, LIVES_TO)
    log(`Michael Armitage artist: residence sentence updated in bio (${bioN}) and longBio (${longN})`)
    if (!bioN || !longN) throw new Error('residence sentence not found in artist bio/longBio; aborting')

    if (!APPLY) return log('\nDry run only. Re-run with --apply to write.')

    if (!curatorExists) {
        await client.create({
            _id: curatorId,
            _type: 'person',
            name: intl('Don Handa'),
            slug: { _type: 'slug', current: 'don-handa' },
            category: 'staff',
            hasProfile: false,
        })
    }
    const tx = client.transaction()
    tx.patch(ARMITAGE_SHOW, (p) =>
        p.set({ pressKit: fileField(pressKitA), admission: intl('Admission Free'), location: intl('Main Gallery'), gallery, description })
    )
    tx.patch(TABULA, (p) =>
        p.set({
            pressKit: fileField(pressKitT),
            exhibitionGuide: fileField(guideT),
            curators: [{ _key: 'don-handa', ...ref(curatorId) }],
            gallery: tabulaGallery,
            'mainImage.caption': intl('Peterson Kamwathi, [title to be confirmed], 2023–24'),
        })
    )
    tx.patch(ARMITAGE_ARTIST, (p) => p.set({ bio, longBio }))
    await tx.commit()
    log('\n✓ written')
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
