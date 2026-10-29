#!/usr/bin/env node
/**
 * Snap ad-hoc typography and spacing utilities onto the design-system scale
 * (docs/DESIGN_PRINCIPLES.md → Type scale, 8px spacing).
 *
 * - Arbitrary font sizes (text-[10px], text-[1.125rem] …) → nearest text-* step.
 * - Arbitrary letter-spacing (tracking-[0.3em] …) → tracking-widest / wider / tight.
 * - Arbitrary unitless display leading (leading-[0.9] …) → leading-display / none / tight.
 * - Off-grid spacing steps (3 = 12px, 5 = 20px, 1.5, 2.5, 3.5) → nearest 8px step.
 *   Skipped in src/components/layout (header/footer heights are tuned by hand).
 *
 * Keeps responsive/state prefixes (md:, hover:, -) intact. Idempotent.
 * Skips src/components/styleguide (it documents raw values on purpose).
 *
 * Usage:
 *   node scripts/codemod-type-scale.mjs           # dry run: per-file counts
 *   node scripts/codemod-type-scale.mjs --apply   # rewrite files
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const APPLY = process.argv.includes('--apply')
const ROOT = 'src'
const SKIP_DIRS = [join('src', 'components', 'styleguide')]
const NO_SPACING_DIRS = [join('src', 'components', 'layout')]

const STEPS = [
    [12, 'xs'], [14, 'sm'], [16, 'base'], [18, 'lg'], [20, 'xl'], [24, '2xl'], [32, '3xl'],
    [40, '4xl'], [48, '5xl'], [64, '6xl'], [80, '7xl'], [96, '8xl'], [128, '9xl'],
]
const nearestStep = (px) => {
    if (px < 12) return 'xs' // nothing below 12px: illegible, and the scale floor
    if (px > 144) return null // hero art sizes stay bespoke
    return STEPS.reduce((best, s) => (Math.abs(s[0] - px) < Math.abs(best[0] - px) ? s : best))[1]
}

const toPx = (value, unit) => (unit === 'px' ? value : unit === 'rem' ? value * 16 : null)

const SPACING = { '1.5': '2', '2.5': '2', '3': '4', '3.5': '4', '5': '6' }
const SPACING_PROPS = 'p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y'

// Utilities sit after a space, quote, backtick or prefix colon; that boundary keeps
// e.g. `group-hover:` prefixes and avoids touching non-class strings.
const B = '(^|[\\s"\'`:])'

function transform(src, { spacing }) {
    let n = 0
    let out = src.replace(new RegExp(`${B}text-\\[(\\d*\\.?\\d+)(px|rem)\\]`, 'g'), (m, pre, v, unit) => {
        const step = nearestStep(toPx(parseFloat(v), unit))
        if (!step) return m
        n++
        return `${pre}text-${step}`
    })
    out = out.replace(new RegExp(`${B}tracking-\\[(-?\\d*\\.?\\d+)em\\]`, 'g'), (m, pre, v) => {
        const em = parseFloat(v)
        const t = em >= 0.1 ? 'widest' : em >= 0.05 ? 'wider' : em > 0 ? 'wide' : em <= -0.025 ? 'tighter' : 'tight'
        n++
        return `${pre}tracking-${t}`
    })
    out = out.replace(new RegExp(`${B}leading-\\[(\\d*\\.?\\d+)\\]`, 'g'), (m, pre, v) => {
        const l = parseFloat(v)
        const t = l < 0.98 ? 'display' : l <= 1.1 ? 'none' : l <= 1.3 ? 'tight' : null
        if (!t) return m
        n++
        return `${pre}leading-${t}`
    })
    if (spacing) {
        out = out.replace(
            new RegExp(`${B}(-?)(${SPACING_PROPS})-(1\\.5|2\\.5|3\\.5|3|5)(?=[\\s"'\`]|$)`, 'g'),
            (m, pre, neg, prop, step) => {
                n++
                return `${pre}${neg}${prop}-${SPACING[step]}`
            },
        )
    }
    return { out, n }
}

function walk(dir, files = []) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (SKIP_DIRS.some((d) => p.startsWith(d))) continue
        if (statSync(p).isDirectory()) walk(p, files)
        else if (p.endsWith('.tsx')) files.push(p)
    }
    return files
}

let total = 0
for (const file of walk(ROOT)) {
    const src = readFileSync(file, 'utf8')
    const spacing = !NO_SPACING_DIRS.some((d) => file.startsWith(d))
    const { out, n } = transform(src, { spacing })
    if (!n) continue
    total += n
    console.log(`${String(n).padStart(4)}  ${file}`)
    if (APPLY) writeFileSync(file, out)
}
console.log(`${APPLY ? 'Rewrote' : 'Would rewrite'} ${total} utilities.`)
