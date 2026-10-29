#!/usr/bin/env node
/**
 * One-off: repoint CMS nav/footer links that 404 onto existing routes.
 * Walks siteSettings (published + draft) and rewrites any `url`/`href` in MAP.
 *
 * Usage:
 *   node scripts/fix-nav-404s.mjs           # dry run
 *   node scripts/fix-nav-404s.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const MAP = {
    '/showing': '/exhibitions#current',
    '/upcoming': '/exhibitions#upcoming',
    '/archive': '/exhibitions#archive',
    '/programme': '/whats-on',
    '/careers': '/about/careers',
    '/members': '/get-involved',
    '/support': '/get-involved',
    '/shop': '/publications',
    '/venue-hire': '/contact',
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

function rewrite(node, changes, path = '') {
    if (Array.isArray(node)) return node.map((n, i) => rewrite(n, changes, `${path}[${i}]`))
    if (node && typeof node === 'object') {
        const out = {}
        for (const [k, v] of Object.entries(node)) {
            if ((k === 'url' || k === 'href') && typeof v === 'string' && MAP[v]) {
                changes.push(`${path}.${k}: ${v} → ${MAP[v]}`)
                out[k] = MAP[v]
            } else out[k] = rewrite(v, changes, `${path}.${k}`)
        }
        return out
    }
    return node
}

for (const id of ['siteSettings', 'drafts.siteSettings']) {
    const doc = await client.getDocument(id)
    if (!doc) continue
    const changes = []
    const { _rev, _updatedAt, _createdAt, ...rest } = doc
    const next = rewrite(rest, changes)
    console.log(`${id}: ${changes.length} links`)
    changes.forEach((c) => console.log('  ' + c))
    if (APPLY && changes.length) await client.createOrReplace(next)
}
console.log(APPLY ? 'Applied.' : 'Dry run. Re-run with --apply to write.')
