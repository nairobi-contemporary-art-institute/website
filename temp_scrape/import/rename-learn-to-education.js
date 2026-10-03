#!/usr/bin/env node
/**
 * One-off: rename the CMS nav label "Learn" -> "Education" in siteSettings.
 * Walks headerMenu + footerCategories (and their nested columns/links titles/labels)
 * and replaces any internationalizedArray value whose text is exactly "Learn".
 *
 * Usage:
 *   SANITY_API_TOKEN=xxx node temp_scrape/import/rename-learn-to-education.js         # dry run
 *   SANITY_API_TOKEN=xxx node temp_scrape/import/rename-learn-to-education.js --apply
 */
const { client } = require('./sanity-client')

const APPLY = process.argv.includes('--apply')
const FROM = 'Learn'
const TO = 'Education'
let changes = 0

// Recursively replace intl-array values equal to FROM inside any object/array.
function walk(node) {
  if (Array.isArray(node)) return node.map(walk)
  if (node && typeof node === 'object') {
    // internationalizedArrayStringValue entries: { _key, _type, value }
    if (typeof node.value === 'string' && node.value.trim() === FROM) {
      changes++
      console.log(`  [${node._key || '?'}] "${node.value}" -> "${TO}"`)
      return { ...node, value: TO }
    }
    const out = {}
    for (const k of Object.keys(node)) out[k] = walk(node[k])
    return out
  }
  return node
}

async function run() {
  const s = await client.fetch(
    `*[_type=="siteSettings"][0]{ _id, headerMenu, footerCategories }`
  )
  if (!s?._id) throw new Error('siteSettings not found')

  console.log('headerMenu:')
  const headerMenu = walk(s.headerMenu)
  console.log('footerCategories:')
  const footerCategories = walk(s.footerCategories)

  if (changes === 0) {
    console.log('\nNo "Learn" labels found. Nothing to do.')
    return
  }

  if (!APPLY) {
    console.log(`\nDry run: ${changes} label(s) would change. Re-run with --apply.`)
    return
  }

  await client.patch(s._id).set({ headerMenu, footerCategories }).commit()
  console.log(`\nUpdated siteSettings: ${changes} label(s) renamed to "${TO}".`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
