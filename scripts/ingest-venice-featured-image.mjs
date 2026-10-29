#!/usr/bin/env node
/**
 * One-off: replace the NCAI in Venice featured image (exhibition mainImage/homepageImage and
 * its homepage hero slide) with SEO metadata. Source is re-encoded first (cwebp q88, ~140 KB).
 *
 * Usage:
 *   node scripts/ingest-venice-featured-image.mjs <optimised.webp>           # dry run
 *   node scripts/ingest-venice-featured-image.mjs <optimised.webp> --apply   # write (needs SANITY_API_TOKEN)
 */
import { readFile } from 'node:fs/promises'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', quiet: true })

const APPLY = process.argv.includes('--apply')
const SOURCE = process.argv.slice(2).find((a) => !a.startsWith('--'))
if (!SOURCE) throw new Error('Pass the optimised .webp path')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

const VENICE_ID = 'ncaiinvenice'
const PANEL_HEX = '#ce1937'
const FILENAME = 'ncai-in-venice-biennale-arte-2026-featured.webp'
const ALT =
    'Gallery view of NCAI in Venice at the 61st Venice Biennale: a video monitor showing a hand drawing along a ruler beside a large, richly coloured figurative painting, with a navy cardboard bench in the foreground'
const META = {
    title: 'NCAI in Venice — featured image',
    altText: ALT,
    description:
        'Installation view of NCAI in Venice, the Nairobi Contemporary Art Institute’s presentation at the 61st International Art Exhibition, La Biennale di Venezia (Biennale Arte 2026, In Minor Keys), 9 May – 22 November 2026.',
    creditLine: 'Nairobi Contemporary Art Institute',
}
const HOTSPOT = { _type: 'sanity.imageHotspot', x: 0.5, y: 0.45, width: 1, height: 1 }

const buf = await readFile(SOURCE)
console.log(`source  ${SOURCE} (${(buf.length / 1024).toFixed(0)} KB)`)

let assetId = 'image-DRY-RUN'
if (APPLY) {
    const asset = await client.assets.upload('image', buf, { filename: FILENAME, ...META })
    assetId = asset._id
    await client.patch(assetId).set(META).commit()
}
console.log(`asset   ${assetId} → ${FILENAME}`)

const imageField = () => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, hotspot: HOTSPOT, alt: ALT })

const tx = client.transaction()
for (const id of [VENICE_ID, `drafts.${VENICE_ID}`]) {
    if (!(await client.fetch('defined(*[_id==$id][0]._id)', { id }))) continue
    tx.patch(id, (p) => p.set({ mainImage: imageField(), homepageImage: imageField() }))
    console.log(`${APPLY ? '' : '[dry] '}patch   ${id}: mainImage, homepageImage`)
}

for (const id of ['homePage', 'drafts.homePage']) {
    const slides = await client.fetch('*[_id==$id][0].hero.slides', { id })
    const i = slides?.findIndex((s) => s.link?.reference?._ref === VENICE_ID)
    if (i == null || i < 0) continue
    const { caption } = slides[i].image || {}
    const at = `hero.slides[_key=="${slides[i]._key}"]`
    tx.patch(id, (p) => p.set({
        [`${at}.image`]: { ...imageField(), ...(caption && { caption }) },
        [`${at}.gradientColor`]: { _type: 'color', hex: PANEL_HEX, alpha: 1 },
        [`${at}.gradientOpacity`]: 100,
        [`${at}.forceBlackText`]: false,
        [`${at}.intelligentContrast`]: false,
    }))
    console.log(`${APPLY ? '' : '[dry] '}patch   ${id}: hero slide ${i + 1}`)
}

if (APPLY) {
    await tx.commit()
    console.log('Committed.')
} else console.log('Dry run. Re-run with --apply to write.')
