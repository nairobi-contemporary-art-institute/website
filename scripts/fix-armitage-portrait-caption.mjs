#!/usr/bin/env node
/**
 * Armitage artist portrait caption read "(Untitled Studies 2012 - 2025), Undated" - a date
 * range followed by "Undated". Make it consistent with the gallery alt text.
 *
 * Usage:
 *   node scripts/fix-armitage-portrait-caption.mjs           # dry run
 *   node scripts/fix-armitage-portrait-caption.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', quiet: true })

const APPLY = process.argv.includes('--apply')
const ID = 'mg2pWkoVlcJRqpFC3I1r0h'
const OLD = '(Untitled Studies 2012 - 2025), Undated'
const NEW = 'Untitled (Studies), 2012–2025'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

const doc = await client.fetch('*[_id==$id][0]{image{caption}}', { id: ID })
const en = doc?.image?.caption?.find((c) => c._key === 'en')
console.log(`current: ${JSON.stringify(en?.value)}`)
if (en?.value !== OLD) {
    console.log('caption is not the expected text; nothing to do')
    process.exit(0)
}
console.log(`${APPLY ? '' : '[dry] '}→ ${JSON.stringify(NEW)}`)
if (APPLY) {
    await client.patch(ID).set({ 'image.caption[_key=="en"].value': NEW }).commit()
    console.log('applied')
}
