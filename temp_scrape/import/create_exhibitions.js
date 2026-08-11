#!/usr/bin/env node
/**
 * Create exhibition documents in Sanity from parsed + uploaded data.
 * Creates as DRAFTS (prefixed with "drafts.") for review before publishing.
 */
const fs = require('fs')
const path = require('path')
const { client } = require('./sanity-client')

const EXHIBITIONS_FILE = path.join(__dirname, 'exhibitions.json')
const ASSETS_FILE = path.join(__dirname, 'uploaded_assets.json')

const exhibitions = JSON.parse(fs.readFileSync(EXHIBITIONS_FILE, 'utf8'))
const assets = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'))

// Readable title overrides for slugs where parser missed the title
const TITLE_OVERRIDES = {
  '60years-ncaicollection': '60 Years: NCAI Collection',
  'exhibitionbreakingbread': 'Notes on Friendship: Breaking Bread',
  'exhibitioncanongriffinrumanzi': 'Canon Griffin Rumanzi: Looking into the Mad Eye of History Without Blinking',
  'exhibitionchelengevanrampelberg': 'Chelenge Van Rampelberg',
  'exhibitionpetersonkamwathi': 'Peterson Kamwathi',
  'ncaiinvenice': 'NCAI in Venice',
  'pathsofdesire': 'Paths of Desire',
  'walkingonadream': 'Walking on a Dream',
  'wayfinder': 'Wayfinder',
  'xensonoliddemupipa': 'Xenson: Olidde Mupipa',
  'exhibition-michael-maria-c': 'Michael + Maria C.',
  'exhbition-eltayeb-dawelbait-immy-mali': 'Eltayeb Dawelbait & Immy Mali',
}

function imageRef(url, alt, key) {
  const ref = assets[url]
  if (!ref) return null
  return {
    _type: 'image',
    _key: key,
    asset: { _type: 'reference', _ref: ref },
    alt: alt || '',
  }
}

function buildDocument(exh) {
  const slug = exh.slug
  const title = TITLE_OVERRIDES[slug] || exh.title
  const imgs = exh.imageUrls || []

  // First image → mainImage
  // Next up to 5 → installationViews
  // Rest → gallery
  const mainImg = imgs[0] ? imageRef(imgs[0].url, imgs[0].alt, 'main') : null
  const installationViews = imgs.slice(1, 6)
    .map((img, i) => imageRef(img.url, img.alt, `install${i}`))
    .filter(Boolean)
  const gallery = imgs.slice(6)
    .map((img, i) => imageRef(img.url, img.alt, `gallery${i}`))
    .filter(Boolean)

  const doc = {
    _type: 'exhibition',
    _id: `drafts.imported-${slug}`,
    title: [{ _key: 'en', _type: 'internationalizedArrayStringValue', value: title }],
    slug: { _type: 'slug', current: slug },
    heroLayout: 'standard',
    galleryLayout: 'cinema',
    showInternalNavigation: true,
  }

  if (exh.startDate) doc.startDate = exh.startDate
  if (exh.endDate) doc.endDate = exh.endDate
  if (mainImg) doc.mainImage = mainImg
  if (installationViews.length) doc.installationViews = installationViews
  if (gallery.length) doc.gallery = gallery

  if (exh.description?.length) {
    doc.description = [{
      _key: 'en',
      _type: 'internationalizedArrayBlockContentValue',
      value: exh.description,
    }]
  }

  // Curator as a written piece in extraSections if present
  if (exh.curator) {
    doc.extraSections = [{
      _type: 'editorialBlock',
      _key: 'curators',
      title: [{ _key: 'en', _type: 'internationalizedArrayStringValue', value: 'Curatorial Note' }],
      content: [{
        _key: 'en',
        _type: 'internationalizedArrayBlockContentValue',
        value: [{
          _type: 'block',
          _key: 'curatorBlock',
          style: 'normal',
          children: [{ _type: 'span', _key: 'curatorSpan', text: `Curated by ${exh.curator}`, marks: [] }],
          markDefs: [],
        }],
      }],
    }]
  }

  return doc
}

async function main() {
  console.log(`Creating ${exhibitions.length} exhibition drafts in Sanity...`)

  for (const exh of exhibitions) {
    const doc = buildDocument(exh)
    try {
      const result = await client.createOrReplace(doc)
      console.log(`  ✓ ${doc.slug.current} → ${result._id}`)
    } catch (e) {
      console.error(`  ✗ ${exh.slug}: ${e.message}`)
    }
  }

  console.log('\nDone. Open Sanity Studio → Exhibitions to review and publish drafts.')
  console.log('Studio URL: http://localhost:3000/studio')
}

main().catch(e => { console.error(e); process.exit(1) })
