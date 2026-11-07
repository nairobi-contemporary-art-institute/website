#!/usr/bin/env node
/**
 * One-off: fold two Wix-import duplicate exhibitions into the originals, then remove them.
 *
 * Why: temp_scrape/import/merge_exhibitions.js only patched slugs listed in SLUG_MAP; these
 * two Wix pages (different titles) were published as new documents instead.
 *
 *   exhibition-michael-maria-c        → 4e76056f-… (armitage-lassnig-rampelberg)
 *   exhibitionpetersonkamwathi        → 64dab0f6-… (tabula-rasa)
 *
 * Armitage / Lassnig / Van Rampelberg (source: https://www.ncai254.com/exhibition-michael-maria-c)
 *   - dates: Wix and the original's own image filename say 19 February – 5 April 2026; the
 *     original had endDate 5 May (typo) and the duplicate had startDate = the end date.
 *   - gallery captions were unfilled template text ("**[Artist Name]**, *[Title]*, ...") and
 *     render literally; replace with the credits from Wix, blank where Wix gives none.
 *   - add the two Lassnig works from Wix (the gallery had none), from the full-size originals.
 *   - drop the caption-only listImage and the placeholder mainImage caption.
 * Tabula Rasa: the original is already the fuller record (hi-res works, intro, installation
 *   views with alt text); nothing to copy except the press kit / guide PDFs (not done here).
 *
 * Usage:
 *   node scripts/merge-duplicate-exhibitions.mjs                     # dry run
 *   node scripts/merge-duplicate-exhibitions.mjs --apply             # patch the originals
 *   node scripts/merge-duplicate-exhibitions.mjs --delete-duplicates # (with --apply) delete the two duplicates
 * Pre-merge backup of all four docs: backups/exhibitions-pre-merge-2026-11-07.json
 */
import { createReadStream } from 'node:fs'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const DELETE = process.argv.includes('--delete-duplicates')
const token = process.env.SANITY_API_TOKEN
if (!token) throw new Error('SANITY_API_TOKEN env var required (see .env.local)')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token,
})

const ARMITAGE = '4e76056f-abdc-4f49-82f9-c1605ad15c65'
const DUPLICATES = ['exhibition-michael-maria-c', 'exhibitionpetersonkamwathi']
const caption = (value) => [{ _key: 'en', _type: 'internationalizedArrayStringValue', value }]
const ref = (id) => ({ _type: 'reference', _ref: id })
const PLACEHOLDER = /\[(Artist Name|Title|Year)\]/

async function upload(path) {
    if (!APPLY) return { _id: `(would upload ${path})` }
    return client.assets.upload('image', createReadStream(path), { filename: path.split('/').pop() })
}

async function run() {
    const doc = await client.getDocument(ARMITAGE)
    if (!doc) throw new Error(`${ARMITAGE} not found`)
    const [sculpture, lithograph, drawing] = doc.gallery
    if (doc.gallery.length !== 3) {
        console.log(`Original already merged (${doc.gallery.length} gallery images); skipping patch.`)
        return removeDuplicates()
    }

    const antlitz = await upload('scripts/data/exhibition-merge/lassnig-antlitz-des-gebirges-1993.jpg')
    const lassnig2 = await upload('scripts/data/exhibition-merge/lassnig-drawing-wix-4727.jpg')

    // Order: one work per artist first (Armitage, Lassnig, Van Rampelberg), then the rest.
    const gallery = [
        { ...drawing, caption: caption('© Michael Armitage, Untitled (Studies), 2012-2025.') },
        { _key: 'lassnig-antlitz', _type: 'image', asset: ref(antlitz._id), caption: caption('© Maria Lassnig, Antlitz des Gebirges (Visage of the Mountain), 1993') },
        { ...sculpture, caption: caption('© Chelenge Van Rampelberg, Mama Kali, 1995') },
        { ...lithograph, caption: [] },
        { _key: 'lassnig-drawing', _type: 'image', asset: ref(lassnig2._id), caption: [] },
    ].map((g) => (g.caption.length ? g : (({ caption: _c, ...rest }) => rest)(g)))

    const unset = ['listImage']
    const mainCaption = JSON.stringify(doc.mainImage?.caption || '')
    if (PLACEHOLDER.test(mainCaption)) unset.push('mainImage.caption')

    console.log('Armitage/Lassnig/Van Rampelberg:')
    console.log(`  startDate ${doc.startDate} → 2026-02-19`)
    console.log(`  endDate   ${doc.endDate} → 2026-04-05`)
    console.log(`  gallery   ${doc.gallery.length} → ${gallery.length} images, captions replaced (placeholders removed)`)
    console.log(`  unset     ${unset.join(', ')}`)

    await checkDuplicates()

    if (!APPLY) return console.log('\nDry run only. Re-run with --apply to write.')

    await client
        .patch(ARMITAGE)
        .set({ startDate: '2026-02-19', endDate: '2026-04-05', gallery })
        .unset(unset)
        .commit()
    console.log('  ✓ original patched')

    if (DELETE) await removeDuplicates()
    else console.log('  (duplicates left in place; re-run with --apply --delete-duplicates after checking the page)')
}

async function checkDuplicates() {
    const dupes = await client.fetch(`*[_id in $ids]{_id, "refs": count(*[references(^._id)])}`, { ids: DUPLICATES })
    dupes.forEach((d) => console.log(`  duplicate ${d._id}: ${d.refs} inbound references`))
    if (dupes.some((d) => d.refs > 0)) throw new Error('a duplicate is referenced; re-point references before deleting')
    return dupes
}

async function removeDuplicates() {
    const dupes = await checkDuplicates()
    if (!APPLY || !DELETE) return console.log('  (pass --apply --delete-duplicates to delete)')
    for (const { _id } of dupes) {
        await client.delete(_id)
        console.log(`  ✓ deleted ${_id}`)
    }
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
