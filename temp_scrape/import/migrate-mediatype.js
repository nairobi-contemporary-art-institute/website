#!/usr/bin/env node
/**
 * One-off migration: rename post.mediaType values to the new Channel categories.
 *   video   -> film
 *   article -> text
 *   audio   -> audio (unchanged)
 * Posts with no mediaType are left untouched (app treats missing as 'text').
 *
 * Usage:
 *   SANITY_API_TOKEN=xxx node temp_scrape/import/migrate-mediatype.js         # dry run (report only)
 *   SANITY_API_TOKEN=xxx node temp_scrape/import/migrate-mediatype.js --apply # perform the patch
 */
const { client } = require('./sanity-client')

const MAP = { video: 'film', article: 'text' }
const APPLY = process.argv.includes('--apply')

async function run() {
  const posts = await client.fetch(
    `*[_type == "post" && mediaType in ["video", "article"]]{ _id, mediaType }`
  )

  if (posts.length === 0) {
    console.log('No posts with legacy mediaType (video/article) found. Nothing to migrate.')
    return
  }

  console.log(`Found ${posts.length} post(s) to migrate:`)
  posts.forEach((p) => console.log(`  ${p._id}: ${p.mediaType} -> ${MAP[p.mediaType]}`))

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to write these changes.')
    return
  }

  let tx = client.transaction()
  posts.forEach((p) => {
    tx = tx.patch(p._id, { set: { mediaType: MAP[p.mediaType] } })
  })
  await tx.commit()
  console.log(`\nMigrated ${posts.length} post(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
