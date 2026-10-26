#!/usr/bin/env node
/**
 * One-off: add the Texts section to the CMS-driven header and footer nav.
 *
 * - Header: inserts a "Texts" item (→ /texts) after Channel, with one column
 *   linking to each text type.
 * - Header: Channel drops its "Read" column (written pieces moved to Texts)
 *   and its Watch link moves from the retired ?type=video to ?type=film.
 * - Footer: adds "Texts" after "The Channel".
 *
 * Idempotent; patches the published doc and the draft if one exists.
 *
 * Usage:
 *   node scripts/patch-nav-texts.mjs           # dry run
 *   node scripts/patch-nav-texts.mjs --apply   # write to Sanity (needs SANITY_API_TOKEN)
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
const TEXTS_LABEL = { en: 'Texts', sw: 'Maandishi', ar: 'نصوص' }

function textsNavItem() {
    return {
        _key: key(),
        _type: 'navItem',
        label: intl(TEXTS_LABEL),
        url: '/texts',
        columns: [
            {
                _key: key(),
                _type: 'column',
                title: intl({ en: 'Read', sw: 'Soma', ar: 'اقرأ' }),
                links: TYPES.map(([type, labels]) => ({
                    _key: key(),
                    _type: 'link',
                    label: intl(labels),
                    url: `/texts?type=${type}`,
                })),
            },
        ],
    }
}

function patchHeader(headerMenu = [], log) {
    let menu = headerMenu.map((item) => {
        if (item.url !== '/channel') return item
        const columns = (item.columns || [])
            .filter((col) => {
                const isRead = (col.links || []).some((l) => /type=(article|text)\b/.test(l.url || ''))
                if (isRead) log(`header: Channel → remove "${en(col.title)}" column`)
                return !isRead
            })
            .map((col) => ({
                ...col,
                links: (col.links || []).map((l) => {
                    if (!/type=video\b/.test(l.url || '')) return l
                    log(`header: Channel → "${en(l.label)}" ${l.url} → /channel?type=film`)
                    return { ...l, url: '/channel?type=film' }
                }),
            }))
        return { ...item, columns }
    })

    if (menu.some((item) => item.url === '/texts')) {
        log('header: Texts item already present, not adding')
        return menu
    }
    const channelIndex = menu.findIndex((item) => item.url === '/channel')
    const at = channelIndex === -1 ? menu.length : channelIndex + 1
    log(`header: insert "Texts" at position ${at + 1} (with ${TYPES.length} type links)`)
    menu = [...menu.slice(0, at), textsNavItem(), ...menu.slice(at)]
    return menu
}

function patchFooter(footerCategories = [], log) {
    if (footerCategories.some((cat) => (cat.links || []).some((l) => l.url === '/texts'))) {
        log('footer: Texts link already present, not adding')
        return footerCategories
    }
    let done = false
    const out = footerCategories.map((cat) => {
        const i = (cat.links || []).findIndex((l) => l.url === '/channel')
        if (done || i === -1) return cat
        done = true
        log(`footer: "${en(cat.title)}" → insert "Texts" after "${en(cat.links[i].label)}"`)
        const link = { _key: key(), _type: 'footerLink', label: intl(TEXTS_LABEL), url: '/texts' }
        return { ...cat, links: [...cat.links.slice(0, i + 1), link, ...cat.links.slice(i + 1)] }
    })
    if (!done) log('footer: no Channel link found, footer unchanged')
    return out
}

async function run() {
    const docs = await client.fetch(
        `*[_id in ["siteSettings", "drafts.siteSettings"]]{ _id, headerMenu, footerCategories }`
    )
    if (!docs.length) throw new Error('siteSettings not found')

    for (const doc of docs) {
        const changes = []
        const log = (line) => changes.push(line)
        const headerMenu = patchHeader(doc.headerMenu, log)
        const footerCategories = patchFooter(doc.footerCategories, log)

        console.log(`\n${doc._id}:`)
        changes.forEach((line) => console.log(`  ${line}`))

        const changed =
            JSON.stringify(headerMenu) !== JSON.stringify(doc.headerMenu) ||
            JSON.stringify(footerCategories) !== JSON.stringify(doc.footerCategories)
        if (!changed) continue
        if (!APPLY) continue

        await client.patch(doc._id).set({ headerMenu, footerCategories }).commit()
        console.log('  ✓ written')
    }

    if (!APPLY) console.log('\nDry run only. Re-run with --apply to write.')
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
