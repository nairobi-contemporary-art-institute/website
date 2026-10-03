#!/usr/bin/env node
/**
 * Create event documents in Sanity from events.json.
 * - Uploads each event image to Sanity CDN (reuses uploaded_assets.json cache)
 * - Publishes directly with stable _id "event-<slug>" (past events)
 * - Skips events without a startDate (schema requires it)
 * Requires SANITY_API_TOKEN.
 */
const fs = require('fs')
const path = require('path')
const https = require('https')
const { client } = require('./sanity-client')

const EVENTS_FILE = path.join(__dirname, 'events.json')
const ASSETS_FILE = path.join(__dirname, 'uploaded_assets.json')

let cache = fs.existsSync(ASSETS_FILE) ? JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8')) : {}
const saveCache = () => fs.writeFileSync(ASSETS_FILE, JSON.stringify(cache, null, 2))

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.ncai254.com/' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function uploadImage(url) {
  if (!url) return null
  if (cache[url]) return cache[url]
  try {
    const buf = await fetchBuffer(url)
    const asset = await client.assets.upload('image', buf, { filename: url.split('/').pop() })
    cache[url] = asset._id
    saveCache()
    return asset._id
  } catch (e) {
    console.error(`    ✗ image ${url.slice(-30)}: ${e.message}`)
    return null
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function buildDoc(ev, imageRef) {
  const doc = {
    _type: 'event',
    _id: `event-${ev.slug}`,
    title: [{ _key: 'en', _type: 'internationalizedArrayStringValue', value: ev.title }],
    slug: { _type: 'slug', current: ev.slug },
    eventType: ev.eventType,
    startDate: ev.startDate,
  }
  if (ev.endDate) doc.endDate = ev.endDate
  if (ev.location) doc.location = ev.location
  if (imageRef) {
    doc.mainImage = {
      _type: 'image',
      asset: { _type: 'reference', _ref: imageRef },
      alt: ev.title, // schema requires alt when image present
    }
  }
  if (ev.description?.length) {
    doc.description = [{ _key: 'en', _type: 'internationalizedArrayBlockContentValue', value: ev.description }]
  }
  return doc
}

async function main() {
  const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'))
  const importable = events.filter(e => e.startDate)
  const skipped = events.filter(e => !e.startDate)

  console.log(`Importing ${importable.length} events (skipping ${skipped.length} without date)...\n`)
  skipped.forEach(e => console.log(`  SKIP (no date): ${e.slug}`))
  console.log()

  let ok = 0, fail = 0
  for (const ev of importable) {
    const imageRef = await uploadImage(ev.imageUrl)
    const doc = buildDoc(ev, imageRef)
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ ${ev.slug} [${ev.eventType}] ${imageRef ? '📷' : '  '}`)
      ok++
    } catch (e) {
      console.error(`  ✗ ${ev.slug}: ${e.message}`)
      fail++
    }
    await sleep(150)
  }

  console.log(`\nDone. ${ok} created, ${fail} failed, ${skipped.length} skipped.`)
  console.log(`Assets cached: ${Object.keys(cache).length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
