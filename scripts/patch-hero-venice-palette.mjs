#!/usr/bin/env node
/**
 * Placeholder hero palette from La Biennale di Venezia brand colours:
 *   Monza #CB0520, Sea Pink #E98E96, Yukon Gold #7E6B05.
 * Sets gradientColor (+ text colour switch) per homepage hero slide, by title.
 * Previous values are printed so the patch can be reversed.
 *
 * Usage:
 *   node scripts/patch-hero-venice-palette.mjs           # dry run
 *   node scripts/patch-hero-venice-palette.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', quiet: true })

const APPLY = process.argv.includes('--apply')
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

// slide title (first language value) -> palette entry
const PALETTE = {
    'NCAI in Venice': { hex: '#CB0520', forceBlackText: false }, // Monza, white text
    'Resounding Rhizomes': { hex: '#E98E96', forceBlackText: true }, // Sea Pink, black text
    // Yukon Gold #7E6B05 (white text) is free for a third slide
}

const toColor = (hex) => ({
    _type: 'color',
    hex,
    alpha: 1,
    hsl: undefined,
    hsv: undefined,
    rgb: undefined,
})

for (const id of ['homePage', 'drafts.homePage']) {
    const doc = await client.fetch('*[_id==$id][0]{hero}', { id })
    if (!doc?.hero?.slides) continue
    const tx = client.patch(id)
    const sets = {}
    doc.hero.slides.forEach((slide) => {
        const title = slide.title?.[0]?.value
        const next = PALETTE[title]
        if (!next) return
        const key = `hero.slides[_key=="${slide._key}"]`
        console.log(
            `${APPLY ? '' : '[dry] '}${id} "${title}": ${slide.gradientColor?.hex} → ${next.hex}, forceBlackText ${slide.forceBlackText} → ${next.forceBlackText}`
        )
        sets[`${key}.gradientColor`] = toColor(next.hex)
        sets[`${key}.forceBlackText`] = next.forceBlackText
    })
    if (APPLY && Object.keys(sets).length) await tx.set(sets).commit()
}
console.log(APPLY ? 'applied' : 'dry run only; pass --apply to write')
