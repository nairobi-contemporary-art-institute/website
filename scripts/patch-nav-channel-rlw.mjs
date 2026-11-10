#!/usr/bin/env node
/**
 * One-off: put Texts into the Channel mega menu as Read / Listen / Watch.
 *
 * - Header: Channel gets a "Read" column (one link per text type, → /texts?type=…)
 *   ordered Read / Listen / Watch.
 * - Header: the top-level Texts item is removed (Texts keeps its own /texts page and is
 *   reached from the Channel menu; the footer link is left alone).
 *
 * Idempotent; patches the published doc and the draft if one exists.
 *
 * Usage:
 *   node scripts/patch-nav-channel-rlw.mjs           # dry run
 *   node scripts/patch-nav-channel-rlw.mjs --apply   # write to Sanity (needs SANITY_API_TOKEN)
 */
import { randomBytes } from 'node:crypto'
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

const key = () => randomBytes(6).toString('hex')
const intl = (values) =>
    Object.entries(values).map(([lang, value]) => ({ _key: lang, _type: 'internationalizedArrayStringValue', value }))
const en = (array) => (Array.isArray(array) ? array.find((v) => v._key === 'en')?.value : undefined)

const TYPES = [
    ['essay', { en: 'Essays', sw: 'Insha', ar: 'مقالات' }],
    ['interview', { en: 'Interviews', sw: 'Mahojiano', ar: 'مقابلات' }],
    ['conversation', { en: 'Conversations', sw: 'Mazungumzo', ar: 'حوارات' }],
    ['artistWriting', { en: "Artists' Writings", sw: 'Maandishi ya wasanii', ar: 'كتابات الفنانين' }],
]

const ORDER = ['Read', 'Listen', 'Watch']

const readColumn = () => ({
    _key: key(),
    _type: 'column',
    title: intl({ en: 'Read', sw: 'Soma', ar: 'اقرأ' }),
    links: TYPES.map(([type, labels]) => ({
        _key: key(),
        _type: 'link',
        label: intl(labels),
        url: `/texts?type=${type}`,
    })),
})

function patchHeader(headerMenu = [], log) {
    const withoutTexts = headerMenu.filter((item) => {
        if (item.url !== '/texts') return true
        log('header: remove top-level "Texts" item')
        return false
    })
    return withoutTexts.map((item) => {
        if (item.url !== '/channel') return item
        const columns = item.columns || []
        if (columns.some((col) => (col.links || []).some((l) => /^\/texts\b/.test(l.url || '')))) {
            log('header: Channel already has a Read column, not adding')
            return item
        }
        const rank = (col) => ORDER.indexOf(en(col.title))
        const sorted = [readColumn(), ...columns].sort((a, b) => (rank(a) === -1 ? 99 : rank(a)) - (rank(b) === -1 ? 99 : rank(b)))
        log(`header: Channel → add "Read" column (${TYPES.length} text-type links); order now ${sorted.map((c) => en(c.title)).join(' / ')}`)
        return { ...item, columns: sorted }
    })
}

async function run() {
    const docs = await client.fetch(`*[_id in ["siteSettings", "drafts.siteSettings"]]{ _id, headerMenu }`)
    if (!docs.length) throw new Error('siteSettings not found')

    for (const doc of docs) {
        const changes = []
        const headerMenu = patchHeader(doc.headerMenu, (line) => changes.push(line))

        console.log(`\n${doc._id}:`)
        changes.forEach((line) => console.log(`  ${line}`))

        if (JSON.stringify(headerMenu) === JSON.stringify(doc.headerMenu)) continue
        if (!APPLY) continue

        await client.patch(doc._id).set({ headerMenu }).commit()
        console.log('  ✓ written')
    }

    if (!APPLY) console.log('\nDry run only. Re-run with --apply to write.')
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
