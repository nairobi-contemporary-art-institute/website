#!/usr/bin/env node
/**
 * Upload exhibition images to Sanity CDN.
 * Reads exhibitions.json, uploads images, writes uploaded_assets.json.
 * Skips images already in cache.
 */
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { client } = require('./sanity-client')

const EXHIBITIONS_FILE = path.join(__dirname, 'exhibitions.json')
const ASSETS_FILE = path.join(__dirname, 'uploaded_assets.json')

// Load cache
let cache = {}
if (fs.existsSync(ASSETS_FILE)) {
  cache = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'))
}

function saveCache() {
  fs.writeFileSync(ASSETS_FILE, JSON.stringify(cache, null, 2))
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.ncai254.com/' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function slugFilename(url, alt) {
  // Try to get original filename from Wix URL path
  const parts = url.split('/')
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(parts[i])) return decodeURIComponent(parts[i])
  }
  // Fallback: use alt text or hash
  const name = (alt || 'image').replace(/[^\w\-]/g, '_').slice(0, 40)
  return `${name}.jpg`
}

async function uploadImage(url, alt) {
  if (cache[url]) return cache[url]

  const filename = slugFilename(url, alt)
  try {
    const buf = await fetchBuffer(url)
    const asset = await client.assets.upload('image', buf, {
      filename,
      contentType: 'image/jpeg',
    })
    const ref = asset._id
    cache[url] = ref
    saveCache()
    return ref
  } catch (e) {
    console.error(`    ✗ ${filename}: ${e.message}`)
    return null
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  const exhibitions = JSON.parse(fs.readFileSync(EXHIBITIONS_FILE, 'utf8'))
  console.log(`Uploading images for ${exhibitions.length} exhibitions...`)

  for (const exh of exhibitions) {
    const imgs = exh.imageUrls || []
    if (!imgs.length) { console.log(`  ${exh.slug}: no images`); continue }

    console.log(`\n  ${exh.slug} (${imgs.length} images)`)
    for (let i = 0; i < imgs.length; i++) {
      const { url, alt } = imgs[i]
      if (cache[url]) { process.stdout.write('.'); continue }
      process.stdout.write(`\n    [${i + 1}/${imgs.length}] `)
      const ref = await uploadImage(url, alt)
      if (ref) process.stdout.write(`→ ${ref.slice(0, 30)}...`)
      await sleep(200)
    }
    console.log()
  }

  console.log(`\nDone. ${Object.keys(cache).length} assets cached in uploaded_assets.json`)
}

main().catch(e => { console.error(e); process.exit(1) })
