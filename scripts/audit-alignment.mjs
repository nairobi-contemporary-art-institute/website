#!/usr/bin/env node
/**
 * Alignment audit: where does content start, per page family, width and locale?
 *
 * Target (docs/DESIGN_PRINCIPLES.md, issue #17): header logo, first content block and
 * footer all start 48px from the reading-start edge at 1440px+ and 24px on phones
 * (mirrored in RTL), inside a container no wider than 1440px.
 *
 *   node scripts/audit-alignment.mjs                    # report + exit 1 on any failure
 *   node scripts/audit-alignment.mjs --baseline         # report only, always exit 0
 *   node scripts/audit-alignment.mjs --max-legacy 40    # fail if legacy uses exceed 40
 *   node scripts/audit-alignment.mjs --families home,shell --locales en,ar
 *   node scripts/audit-alignment.mjs --base http://localhost:3000
 *
 * Needs the app running (npm run dev) and Google Chrome installed. Pages are pinned in
 * PAGES below; the Sanity CDN lags about 60s, so re-run if content was just edited.
 */
import { chromium } from 'playwright-core'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const opt = (n, d) => {
    const i = args.indexOf(`--${n}`)
    return i >= 0 && args[i + 1] ? args[i + 1] : d
}

const BASE = opt('base', 'http://localhost:3000')
const LOCALES = opt('locales', 'en,ar,am').split(',')
const WIDTHS = opt('widths', '1440,768,390').split(',').map(Number)
const ONLY = opt('families', '') ? opt('families', '').split(',') : null
const MAX_LEGACY = opt('max-legacy', '') === '' ? null : Number(opt('max-legacy', ''))
const BASELINE = flag('baseline')

const MAX_WIDTH = 1440
const RTL = new Set(['ar'])
const TOLERANCE = 1 // px

// Page family -> paths (no locale prefix). Details are pinned slugs.
const PAGES = {
    home: ['/'],
    shell: ['/contact'],
    programme: ['/education', '/education/curator-masterclass', '/events', '/channel', '/channel/artist-portrait-elimo-njau', '/whats-on'],
    editorial: ['/texts', '/texts/sample-artist-writing', '/exhibitions', '/history', '/artists', '/artists/adamu', '/collection'],
    information: ['/visit', '/contact', '/accessibility'],
    about: ['/about', '/get-involved'],
}

/** Expected start-edge offset for a viewport width. */
const expectedEdge = (w) => (w >= 768 ? 48 : 24)

// --- Static source scan: legacy `container` uses (progress meter) ---
function scanLegacy() {
    const uses = []
    const walk = (dir) => {
        for (const f of readdirSync(dir)) {
            const p = join(dir, f)
            if (statSync(p).isDirectory()) walk(p)
            else if (p.endsWith('.tsx')) {
                readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
                    // `container` as a CSS class token inside a string literal (not comments,
                    // containerRef, page-container, max-w-container, etc.)
                    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '')
                    if (/["'`][^"'`]*(?<![-\w])container(?![-\w])[^"'`]*["'`]/.test(code)) uses.push({ kind: 'class', at: `${p}:${i + 1}` })
                    // GridSystem pulls in the legacy class via this prop
                    // (skip the component that defines the prop: its own `"container"` string is counted above)
                    if (!p.endsWith('Grid/Grid.tsx') && /unstable_useContainer(?!=\{false\})(\s|>|=\{true\})/.test(line)) uses.push({ kind: 'grid-prop', at: `${p}:${i + 1}` })
                })
            }
        }
    }
    walk('src')
    return uses
}

// --- Browser measurements ---
function measure([isRtl, vw]) {
    const edge = (el) => {
        if (!el) return null
        const r = el.getBoundingClientRect()
        if (!r.width && !r.height) return null
        return Math.round(isRtl ? vw - r.right : r.left)
    }
    const visible = (el) => {
        const r = el.getBoundingClientRect()
        const s = getComputedStyle(el)
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
    }
    const first = (sel) => [...document.querySelectorAll(sel)].find(visible) || null

    const logo = first('header a img, header a svg, header a')
    const content = first('main h1') || first('main h2') || first('main p')
    const footer = first('footer a, footer h2, footer h3, footer p')
    const pc = [...document.querySelectorAll('.page-container')]
    const both = [...document.querySelectorAll('.container.page-container')].length

    return {
        header: edge(logo),
        content: edge(content),
        footer: edge(footer),
        maxPageContainer: pc.length ? Math.max(...pc.map((e) => Math.round(e.getBoundingClientRect().width))) : null,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        both,
    }
}

const legacy = scanLegacy()
const byKind = legacy.reduce((a, u) => ((a[u.kind] = (a[u.kind] || 0) + 1), a), {})

const browser = await chromium.launch({ channel: 'chrome' })
const rows = []
let failures = 0

for (const [family, paths] of Object.entries(PAGES)) {
    if (ONLY && !ONLY.includes(family)) continue
    for (const locale of LOCALES) {
        const isRtl = RTL.has(locale)
        for (const width of WIDTHS) {
            const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
            const page = await ctx.newPage()
            for (const path of paths) {
                const url = `${BASE}/${locale}${path === '/' ? '' : path}`
                let m = null
                let err = ''
                try {
                    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
                    if (!res || res.status() >= 400) err = `HTTP ${res ? res.status() : '?'}`
                    else m = await page.evaluate(measure, [isRtl, width]).catch((e) => ((err = e.message), null))
                } catch (e) {
                    err = e.message.split('\n')[0]
                }
                const want = expectedEdge(width)
                const problems = []
                if (err) problems.push(err)
                if (m) {
                    for (const k of ['header', 'content', 'footer']) {
                        if (m[k] === null) problems.push(`${k}: not found`)
                        else if (Math.abs(m[k] - want) > TOLERANCE) problems.push(`${k} ${m[k]}px (want ${want})`)
                    }
                    if (m.maxPageContainer !== null && m.maxPageContainer > MAX_WIDTH) problems.push(`container ${m.maxPageContainer}px > ${MAX_WIDTH}`)
                    if (m.overflow) problems.push('horizontal overflow')
                    if (m.both) problems.push(`${m.both} element(s) with both container and page-container`)
                }
                if (problems.length) failures++
                rows.push({ family, locale, width, path, m, problems })
            }
            await ctx.close()
        }
    }
}
await browser.close()

// --- Report ---
console.log(`\nAlignment audit @ ${BASE}   target: ${48}px desktop / ${24}px phone, max ${MAX_WIDTH}px\n`)
const pad = (s, n) => String(s).padEnd(n)
console.log(`${pad('family', 12)}${pad('loc', 4)}${pad('w', 6)}${pad('path', 40)}${pad('header', 8)}${pad('content', 9)}${pad('footer', 8)}result`)
for (const r of rows) {
    const g = (k) => (r.m && r.m[k] !== null ? r.m[k] : '-')
    console.log(`${pad(r.family, 12)}${pad(r.locale, 4)}${pad(r.width, 6)}${pad(r.path, 40)}${pad(g('header'), 8)}${pad(g('content'), 9)}${pad(g('footer'), 8)}${r.problems.length ? 'FAIL ' + r.problems.join('; ') : 'ok'}`)
}

console.log(`\nLegacy container uses in src/: ${legacy.length}  (class: ${byKind.class || 0}, GridSystem prop: ${byKind['grid-prop'] || 0})`)
console.log(`Checks: ${rows.length}, failing: ${failures}`)

let exit = 0
if (MAX_LEGACY !== null && legacy.length > MAX_LEGACY) {
    console.log(`FAIL legacy uses ${legacy.length} > allowed ${MAX_LEGACY}`)
    exit = 1
}
if (failures) exit = 1
process.exit(BASELINE ? 0 : exit)
