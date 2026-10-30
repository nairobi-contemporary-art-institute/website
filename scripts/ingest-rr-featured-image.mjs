#!/usr/bin/env node
/**
 * One-off: ingest the Resounding Rhizomes featured image into Sanity with SEO metadata,
 * use it as the exhibition's main/homepage image, and restyle hero slide 1 as a split
 * layout (image left, #838c83 panel with text right).
 *
 * Idempotent: Sanity dedupes identical uploads; patches use set().
 *
 * Usage:
 *   node scripts/ingest-rr-featured-image.mjs [path/to/image.webp]           # dry run
 *   node scripts/ingest-rr-featured-image.mjs [path/to/image.webp] --apply   # write (needs SANITY_API_TOKEN)
 */
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const SOURCE =
    process.argv.slice(2).find((a) => !a.startsWith('--')) ||
    path.join(homedir(), 'Downloads', 'Resounding-Rhizomes-Featured-Image.webp')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

const EXHIBITION_ID = 'exhibition-resounding-rhizomes'
const FILENAME = 'resounding-rhizomes-ncai-nairobi-2026-featured.webp'
const PANEL_HEX = '#838c83'

const ALT =
    'Close-up of a textured painting in white and jade green impasto with fragments of gold leaf — Resounding Rhizomes, Nairobi Contemporary Art Institute, 2026'
const META = {
    title: 'Resounding Rhizomes — featured image',
    altText: ALT,
    description:
        'Detail of a work in Resounding Rhizomes, an exhibition curated by Aude Christel Mgba at the Nairobi Contemporary Art Institute (NCAI), Rosslyn Riviera Mall, 24 September 2026 – 10 January 2027.',
    creditLine: 'Nairobi Contemporary Art Institute',
}

const buf = await readFile(SOURCE)
console.log(`source  ${SOURCE} (${(buf.length / 1024).toFixed(0)} KB)`)

let assetId = 'image-DRY-RUN'
if (APPLY) {
    const asset = await client.assets.upload('image', buf, { filename: FILENAME, ...META })
    assetId = asset._id
    // upload() options set title/description/creditLine but not altText on older API versions.
    await client.patch(assetId).set(META).commit()
}
console.log(`asset   ${assetId} → ${FILENAME}`)

const imageField = () => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt: ALT })

const tx = client.transaction()
for (const id of [EXHIBITION_ID, `drafts.${EXHIBITION_ID}`]) {
    if (!(await client.fetch('defined(*[_id==$id][0]._id)', { id }))) continue
    tx.patch(id, (p) => p.set({ mainImage: imageField(), homepageImage: imageField() }))
    console.log(`${APPLY ? '' : '[dry] '}patch   ${id}: mainImage, homepageImage`)
}

for (const id of ['homePage', 'drafts.homePage']) {
    const slides = await client.fetch('*[_id==$id][0].hero.slides', { id })
    if (!slides?.length) continue
    const [first, ...rest] = slides
    const slide = {
        ...first,
        image: imageField(),
        layout: 'split-right',
        contentPosition: 'right',
        contentWidth: 50,
        imageSize: { widthPercent: 50 },
        gradientColor: { _type: 'color', hex: PANEL_HEX, alpha: 1 },
        gradientOpacity: 100,
        forceBlackText: true, // white on #838c83 is ~3.4:1, below WCAG AA for small text
        intelligentContrast: false,
    }
    tx.patch(id, (p) => p.set({ 'hero.slides': [slide, ...rest] }))
    console.log(`${APPLY ? '' : '[dry] '}patch   ${id}: hero.slides[0] → split-right, ${PANEL_HEX}`)
}

if (APPLY) {
    await tx.commit()
    console.log('Committed.')
} else console.log('Dry run. Re-run with --apply to write.')
