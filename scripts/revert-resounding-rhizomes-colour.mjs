#!/usr/bin/env node
/**
 * Put the "Resounding Rhizomes" homepage hero slide back to its original colour,
 * #838c83 (the average colour of its image, black text), undoing the Sea Pink
 * from patch-hero-venice-palette.mjs. Only this slide is touched.
 *
 * Usage:
 *   node scripts/revert-resounding-rhizomes-colour.mjs           # dry run
 *   node scripts/revert-resounding-rhizomes-colour.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', quiet: true })

const APPLY = process.argv.includes('--apply')
const TITLE = 'Resounding Rhizomes'
const HEX = '#838c83'
const FORCE_BLACK_TEXT = true

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

for (const id of ['homePage', 'drafts.homePage']) {
    const doc = await client.fetch('*[_id==$id][0]{hero}', { id })
    const slide = doc?.hero?.slides?.find((s) => s.title?.[0]?.value === TITLE)
    if (!slide) continue
    console.log(`${APPLY ? '' : '[dry] '}${id} "${TITLE}": ${slide.gradientColor?.hex} → ${HEX}, forceBlackText ${slide.forceBlackText} → ${FORCE_BLACK_TEXT}`)
    if (APPLY) {
        const key = `hero.slides[_key=="${slide._key}"]`
        await client
            .patch(id)
            .set({
                [`${key}.gradientColor`]: { _type: 'color', hex: HEX, alpha: 1 },
                [`${key}.forceBlackText`]: FORCE_BLACK_TEXT,
            })
            .commit()
    }
}
console.log(APPLY ? 'applied' : 'dry run only; pass --apply to write')
