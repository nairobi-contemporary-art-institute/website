#!/usr/bin/env node
/**
 * Parse exhibition markdown files → exhibitions.json
 * Each file is one exhibition from ncai254.com
 */
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '../firecrawl/pages')
const OUT_FILE = path.join(__dirname, 'exhibitions.json')

const EXHIBITION_FILES = [
  '60years-ncaicollection.md',
  'between-signals.md',
  'commonground.md',
  'exhbition-eltayeb-dawelbait-immy-mali.md',
  'exhibition-i-hope-so-sane-wadu.md',
  'exhibition-kaspale-syowia-kyambi.md',
  'exhibition-michael-maria-c.md',
  'exhibition-mwili-akili-na-roho.md',
  'exhibitionbreakingbread.md',
  'exhibitioncanongriffinrumanzi.md',
  'exhibitionchelengevanrampelberg.md',
  'exhibitionpetersonkamwathi.md',
  'ncaiinvenice.md',
  'pathsofdesire.md',
  'walkingonadream.md',
  'wayfinder.md',
  'xensonoliddemupipa.md',
]

// Wix nav noise to strip
const NOISE = [
  /^top of page$/i, /^skip to main content$/i, /^previous exhibition$/i,
  /^next exhibition/i, /^\[next exhibition\]/i, /^\[previous exhibition\]/i,
  /^\\$/i, /^​+$/, // zero-width chars
]

function isNoise(line) {
  return NOISE.some(r => r.test(line.trim()))
}

/**
 * Parse "14th January 2022 - 6th August 2022" or "14 Jan 2022 – 6 Aug 2022"
 * Returns { startDate, endDate } as ISO strings or null
 */
function parseDateRange(line) {
  const months = {
    january: '01', february: '02', march: '03', april: '04',
    may: '05', june: '06', july: '07', august: '08',
    september: '09', october: '10', november: '11', december: '12',
    jan: '01', feb: '02', mar: '03', apr: '04',
    jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  }
  const datePattern = /(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)\s+(\d{4})/g
  const matches = [...line.matchAll(datePattern)]
  if (matches.length < 1) return null

  const toIso = (m) => {
    const d = m[1].padStart(2, '0')
    const mon = months[m[2].toLowerCase()]
    const y = m[3]
    return mon ? `${y}-${mon}-${d}` : null
  }

  return {
    startDate: toIso(matches[0]),
    endDate: matches[1] ? toIso(matches[1]) : null,
  }
}

/**
 * Convert paragraphs to minimal Portable Text blocks (English only)
 */
function toPortableText(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `block${i}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `span${i}`, text, marks: [] }],
    markDefs: [],
  }))
}

function parseExhibition(filename) {
  const content = fs.readFileSync(path.join(PAGES_DIR, filename), 'utf8')
  const lines = content.split('\n')

  // Slug from URL line
  const urlLine = lines.find(l => l.startsWith('**URL:**'))
  const urlMatch = urlLine?.match(/ncai254\.com\/(.+)$/)
  const slug = urlMatch ? urlMatch[1].trim() : filename.replace('.md', '')

  // Title: first # heading that's not the page title (which includes "| NCAI254")
  let title = ''
  let dateRange = null
  let curator = ''
  const imageUrls = []
  const descParagraphs = []

  let inContent = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    // Skip noise
    if (!line || isNoise(line)) continue
    if (line.startsWith('**URL:**')) { inContent = true; continue }
    if (!inContent) continue

    // Images
    const imgMatch = line.match(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/)
    if (imgMatch) {
      imageUrls.push({ alt: imgMatch[1], url: imgMatch[2] })
      continue
    }

    // Date range line (contains month names and year)
    if (!dateRange && /\d{4}/.test(line) && /january|february|march|april|may|june|july|august|september|october|november|december/i.test(line)) {
      dateRange = parseDateRange(line)
      continue
    }

    // Title: first # heading in content
    if (line.startsWith('# ') && !title) {
      title = line.replace(/^#+\s*/, '')
      continue
    }

    // Curator line
    if (/^curated by/i.test(line)) {
      curator = line.replace(/^curated by\s*/i, '').trim()
      continue
    }

    // Skip markdown links that are just nav
    if (/^\[.*\]\(https?:\/\/.*\)$/.test(line)) continue

    // Skip headings after first (section labels)
    if (line.startsWith('#')) continue

    // Accumulate description paragraphs (min 40 chars = real content)
    if (line.length >= 40 && !line.startsWith('![')) {
      // Strip footnote-style references like "1\." at start
      const cleaned = line.replace(/^\d+\\?\.\s+/, '').trim()
      if (cleaned.length >= 40) descParagraphs.push(cleaned)
    }
  }

  // Deduplicate image URLs (Wix serves same image at different sizes)
  const seenImgBase = new Set()
  const uniqueImages = imageUrls.filter(img => {
    // Extract Wix media hash for dedup
    const hashMatch = img.url.match(/\/media\/([^~]+)/)
    const key = hashMatch ? hashMatch[1] : img.url
    if (seenImgBase.has(key)) return false
    seenImgBase.add(key)
    return true
  })

  return {
    slug,
    title: title || slug,
    startDate: dateRange?.startDate || null,
    endDate: dateRange?.endDate || null,
    curator,
    description: toPortableText(descParagraphs),
    imageUrls: uniqueImages,
    sourceFile: filename,
  }
}

const exhibitions = []
for (const file of EXHIBITION_FILES) {
  const fullPath = path.join(PAGES_DIR, file)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  SKIP (not found): ${file}`)
    continue
  }
  try {
    const exh = parseExhibition(file)
    exhibitions.push(exh)
    console.log(`  ✓ ${exh.slug} | "${exh.title}" | ${exh.startDate || '?'} | imgs:${exh.imageUrls.length} | paras:${exh.description.length}`)
  } catch (e) {
    console.error(`  ✗ ${file}: ${e.message}`)
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(exhibitions, null, 2))
console.log(`\nWrote ${exhibitions.length} exhibitions → ${OUT_FILE}`)
