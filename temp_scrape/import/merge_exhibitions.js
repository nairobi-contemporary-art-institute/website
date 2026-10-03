#!/usr/bin/env node
/**
 * Merge imported exhibition drafts into existing published Sanity documents.
 * - Patches published docs with images from imports (never overwrites artists/description)
 * - Publishes new exhibitions that have no counterpart
 * - Deletes imported drafts after merge
 */
const { client } = require('./sanity-client')

// Slug mapping: published slug → imported draft slug
const SLUG_MAP = {
  'i-hope-so-sane-wadu':                      'exhibition-i-hope-so-sane-wadu',
  '60-years-the-ncai-collection':              '60years-ncaicollection',
  'common-ground':                             'commonground',
  'olidde-mupipa-xenson':                      'xensonoliddemupipa',
  'the-long-way-home-chelenge-van-rampelberg': 'exhibitionchelengevanrampelberg',
  'mwili-akili-na-roho':                       'exhibition-mwili-akili-na-roho',
  'kaspale-syowia-kyambi':                     'exhibition-kaspale-syowia-kyambi',
  'eltayeb-dawelbait-and-immy-mali':           'exhbition-eltayeb-dawelbait-immy-mali',
}

// New exhibitions to publish directly (no existing published counterpart)
const NEW_SLUGS = [
  'between-signals',
  'exhibitionbreakingbread',
  'exhibitioncanongriffinrumanzi',
  'exhibitionpetersonkamwathi',
  'ncaiinvenice',
  'pathsofdesire',
  'walkingonadream',
  'wayfinder',
  'exhibition-michael-maria-c',
]

async function fetchPublished(slug) {
  return client.fetch(
    `*[_type == "exhibition" && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
    { slug }
  )
}

async function fetchImportedDraft(importedSlug) {
  return client.fetch(
    `*[_id == $id][0]`,
    { id: `drafts.imported-${importedSlug}` }
  )
}

async function main() {
  const deletedIds = []

  // ── Step 1: Patch existing published docs ──────────────────────────────────
  console.log('Step 1: Patching existing published exhibitions with image data...\n')

  for (const [publishedSlug, importedSlug] of Object.entries(SLUG_MAP)) {
    const published = await fetchPublished(publishedSlug)
    const imported = await fetchImportedDraft(importedSlug)

    if (!published) {
      console.warn(`  SKIP: no published doc for slug "${publishedSlug}"`)
      continue
    }
    if (!imported) {
      console.warn(`  SKIP: no imported draft for "${importedSlug}"`)
      continue
    }

    const patch = {}

    // Only set mainImage if published doesn't have one
    if (!published.mainImage && imported.mainImage) {
      patch.mainImage = imported.mainImage
    }

    // Only set installationViews if published doesn't have any
    if ((!published.installationViews || published.installationViews.length === 0) && imported.installationViews?.length) {
      patch.installationViews = imported.installationViews
    }

    // Only set gallery if published doesn't have any
    if ((!published.gallery || published.gallery.length === 0) && imported.gallery?.length) {
      patch.gallery = imported.gallery
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  ${publishedSlug}: already has all image fields — skipping patch`)
    } else {
      await client.patch(published._id).set(patch).commit()
      const fields = Object.keys(patch).join(', ')
      console.log(`  ✓ ${publishedSlug}: patched [${fields}]`)
    }

    deletedIds.push(`drafts.imported-${importedSlug}`)
  }

  // ── Step 2: Publish new exhibitions ────────────────────────────────────────
  console.log('\nStep 2: Publishing new exhibitions...\n')

  for (const importedSlug of NEW_SLUGS) {
    const imported = await fetchImportedDraft(importedSlug)
    if (!imported) {
      console.warn(`  SKIP: no imported draft for "${importedSlug}"`)
      continue
    }

    // Strip drafts. prefix → published document
    const { _id, _rev, ...docFields } = imported
    const newId = importedSlug  // use slug as stable ID

    await client.createOrReplace({ ...docFields, _id: newId })
    console.log(`  ✓ Published: ${newId} (${imported.slug?.current || importedSlug})`)
    deletedIds.push(`drafts.imported-${importedSlug}`)
  }

  // ── Step 3: Delete imported drafts ─────────────────────────────────────────
  console.log('\nStep 3: Cleaning up imported drafts...\n')

  for (const id of deletedIds) {
    try {
      await client.delete(id)
      console.log(`  ✓ Deleted ${id}`)
    } catch (e) {
      console.warn(`  SKIP: ${id} — ${e.message}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('Merge complete.')
  console.log('Open http://localhost:3000/studio to review exhibitions.')
}

main().catch(e => { console.error(e); process.exit(1) })
