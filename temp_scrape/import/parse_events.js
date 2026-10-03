#!/usr/bin/env node
/**
 * Parse scraped event pages → events.json
 * Source: temp_scrape/firecrawl/pages/event-details-registration_*.md
 * Output: temp_scrape/import/events.json
 */
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '..', 'firecrawl', 'pages')
const OUT_FILE = path.join(__dirname, 'events.json')

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6,
  aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
}

// EAT = UTC+3 → build ISO with +03:00 offset
function toISO(day, monStr, year, hh, mm) {
  const mon = MONTHS[monStr.toLowerCase().slice(0, 4)] ?? MONTHS[monStr.toLowerCase().slice(0, 3)]
  if (mon == null) return null
  const p = (n) => String(n).padStart(2, '0')
  return `${year}-${p(mon + 1)}-${p(day)}T${p(hh)}:${p(mm)}:00+03:00`
}

// Parse "23 Aug 2024, 10:00 – 24 Aug 2024, 17:00" and variants
function parseDateRange(line) {
  if (!line) return { startDate: null, endDate: null }
  const clean = line.replace(/EAT/g, '').trim()
  const parts = clean.split(/[–-]/).map(s => s.trim()).filter(Boolean)
  const full = /^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4}),\s*(\d{1,2}):(\d{2})/
  const timeOnly = /^(\d{1,2}):(\d{2})/

  const startM = parts[0]?.match(full)
  if (!startM) return { startDate: null, endDate: null }
  const [, sd, smo, sy, sh, sm] = startM
  const startDate = toISO(sd, smo, sy, sh, sm)

  let endDate = null
  if (parts[1]) {
    const eFull = parts[1].match(full)
    if (eFull) {
      const [, ed, emo, ey, eh, em] = eFull
      endDate = toISO(ed, emo, ey, eh, em)
    } else {
      const eTime = parts[1].match(timeOnly)
      if (eTime) endDate = toISO(sd, smo, sy, eTime[1], eTime[2]) // same day
    }
  }
  return { startDate, endDate }
}

// Infer required eventType from title/slug keywords → matches schema enum
function inferType(t) {
  const s = t.toLowerCase()
  if (/walkabout/.test(s)) return 'Exhibition Walkabout'
  if (/opening/.test(s)) return 'Exhibition Opening'
  if (/book club/.test(s)) return 'Book Club'
  if (/reading group/.test(s)) return 'Reading Group'
  if (/book launch/.test(s)) return 'Book Launch'
  if (/zine/.test(s)) return 'Zine-Making Workshop'
  if (/writing workshop|creative writing/.test(s)) return 'Writing Workshop'
  if (/sound|sonic|vinyl/.test(s)) return 'Sound Workshop'
  if (/accessib/.test(s)) return 'Accessibility Workshop'
  if (/screening|film|directed by|drive my car|negro/.test(s)) return 'Film Screening'
  if (/performance|playground|poetry meets/.test(s)) return 'Performance'
  if (/virtual|instagram live|on speculation/.test(s)) return 'Virtual Talk'
  if (/artist talk|artist-talk/.test(s)) return 'Artist Talk'
  if (/curat/.test(s)) return 'Curator Talk'
  if (/lecture/.test(s)) return 'Lecture Series'
  if (/workshop|playshop|ceramics|sculpting|dyeing|dye with|modelling|phoshoza/.test(s)) return 'Artist-Led Workshop'
  if (/conversation|in conversation|panel|talk|being a host/.test(s)) return 'Public Talk'
  return 'Public Talk' // safe default
}

function toBlocks(paras) {
  return paras.map((t, i) => ({
    _type: 'block', _key: 'b' + i, style: 'normal', markDefs: [],
    children: [{ _type: 'span', _key: 's' + i, text: t, marks: [] }],
  }))
}

// Pick the high-res image (largest w_ variant, skip blur placeholders w_49)
function pickImage(md) {
  const re = /!\[[^\]]*\]\((https:\/\/static\.wixstatic\.com\/media\/[^)]+)\)/g
  let best = null, bestW = 0, m
  while ((m = re.exec(md))) {
    const url = m[1]
    const w = parseInt((url.match(/w_(\d+)/) || [])[1] || '0', 10)
    if (w > bestW) { bestW = w; best = url }
  }
  if (!best) return null
  // strip transform → original full-res
  const idm = best.match(/(7b6770_[a-f0-9]+~mv2\.(?:png|jpe?g|webp))/i)
  return idm ? `https://static.wixstatic.com/media/${idm[1]}` : best
}

function parseFile(file) {
  const md = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8')
  const slug = file.replace(/^event-details-registration_/, '').replace(/\.md$/, '')

  // title = first H1, strip "| NCAI254"
  const titleM = md.match(/^#\s+(.+?)(?:\s*\|\s*NCAI254)?\s*$/m)
  const title = titleM ? titleM[1].trim() : slug

  // datetime line: 2nd line after "## Time & Location"
  const tl = md.match(/## Time & Location\s*\n\s*\n?(.+)/)
  const dtLine = tl ? tl[1].trim() : null
  const { startDate, endDate } = parseDateRange(dtLine)

  // location: line after datetime line
  let location = null
  if (dtLine) {
    const after = md.split(dtLine)[1] || ''
    const locM = after.match(/\n\s*\n(.+?)\n/)
    if (locM) location = locM[1].trim()
  }

  // description: under "## About the event" until Show More / ## Share
  let paras = []
  const ab = md.match(/## About the event\s*\n([\s\S]*?)(?:\nShow More|\n## Share|\nbottom of page)/)
  if (ab) {
    paras = ab[1].split(/\n\s*\n/).map(s => s.trim())
      .filter(s => s && !/^!\[/.test(s) && !/^\[/.test(s))
  }

  const image = pickImage(md.split('## Time & Location')[0] || md)

  return {
    slug, title,
    eventType: inferType(title + ' ' + slug),
    startDate, endDate, location,
    description: paras.length ? toBlocks(paras) : null,
    imageUrl: image,
    sourceFile: file,
  }
}

function main() {
  const files = fs.readdirSync(PAGES_DIR)
    .filter(f => f.startsWith('event-details-registration_') && f.endsWith('.md') && !f.includes('_form'))
  const events = files.map(parseFile)

  const noDate = events.filter(e => !e.startDate)
  fs.writeFileSync(OUT_FILE, JSON.stringify(events, null, 2))
  console.log(`Parsed ${events.length} events → events.json`)
  console.log(`  with startDate: ${events.length - noDate.length}`)
  console.log(`  MISSING startDate: ${noDate.length}`)
  noDate.forEach(e => console.log(`    ! ${e.slug}`))
  const types = {}
  events.forEach(e => { types[e.eventType] = (types[e.eventType] || 0) + 1 })
  console.log('  types:', JSON.stringify(types))
}

main()
