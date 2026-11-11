# TODO (offline mirror — GitHub Issues #4–#13 are canonical, all `ready-for-agent`)

Reconciled 2026-11-11: removed typography push (Inter → Geist, #44), hero Studio verify (hero is Sanity-driven and live), mobile hero layout (superseded), localization decision (all 10 locales via #16, machine translations pending native review below), collection i18n keys (present in all 10 locales), per-slide timing (done), live hero colour check (confirmed 2026-11-11). Page container epic #17 closed (#63).

## Immediate (Testing)
- [ ] Verify video playback on channel page — added `videoUrl` to `POST_BY_SLUG_QUERY`, need to test with actual video posts (#11 — path verified in code against 6 playable portrait posts; in-browser check pending)

## Polish (#12 — motion() item closed as moot; per-slide timing done; mobile hero superseded by the split hero + #59)
- [ ] Image overflow handling — images clip at section edges when hotspot positions near boundaries
- [ ] Dev server stability — investigate why server dies mid-session; consider health checks (#13)

## Content migration (ncai254.com → Sanity)
- [ ] Artist Talk posts — 8 imported (`create_posts.js`) with blank `videoUrl`; per-video Vimeo IDs not in scrape. Backfill Vimeo URLs so `/channel/[slug]` plays. (#11 — the 8 are the `*-in-conversation` + walk-and-talk posts)
- [ ] Publication cover images — 4 new pubs use generated 3D covers (color only), `coverImage` blank; page-order mapping ambiguous. Add real covers in Studio if wanted. (#8)
- [ ] Artist Films page — 4 Vimeo links, no titles/metadata; not imported. Pull titles from Vimeo then create film posts. (#11)
- [ ] Channel root (`/channel`) intro images — 2 Wix images not migrated. (#8)

## Data
- [ ] Collection items missing `slug`s — work cards render but aren't clickable (`href="#"`) in both masonry and By-Artist views. Backfill slugs in Sanity (or via import script) so `/collection/[slug]` detail pages link. Pre-existing; surfaced during By-Artist work. (#4)

## Collection page (Studio-Museum-style artist browsing — `a328f43`)
- [ ] Representative thumbnail is "artist's first work with an image" (client-derived). If curators want control, add a `collectionThumbnail` field to the artist schema + wire into `ARTISTS_INDEX_QUERY` / grouping. (#10)
- [ ] Pagination — reference paginates artists (~29 pages); we render all artist cards at once. Fine at current scale; add pagination/lazy-load as the collection grows. (#10)

## Follow-ups from the 2026-11-10 visual-pass session (#39–#61 merged)
- [ ] **Watch the staggered hero entrance by eye** (#61) — measured, not viewed; also try reduced-motion.
- [ ] **Fill placeholders in Studio** — "[title and year to be confirmed]" (2 works in the Armitage/Lassnig/van Rampelberg show), "[title to be confirmed]" (Tabula Rasa hero image), "Title 1–6" on Tabula Rasa `work` documents / remaining gallery captions. These show publicly until filled.
- [ ] **Native-speaker review** of machine translations added in #54/#56 (`WhatsOn` namespace, Read/Listen/Watch): am, ar, so, sw, hi first.
- [ ] **Event/programme type labels** (~25 options, e.g. "Artist Talk", "Course") are CMS-driven and English-only; translate in Sanity or add to messages. About/Visit intro paragraphs and exhibition titles/descriptions are English-only in Sanity.
- [ ] **Header title in Somali** — longest title; always falls back to the compact logo (by design, `useTitleFits`). Revisit if a shorter Somali title is approved.
- [ ] **Ready-to-run Venice palette** — `scripts/patch-hero-venice-palette.mjs` was applied 2026-11-10; Resounding Rhizomes then reverted (`scripts/revert-resounding-rhizomes-colour.mjs`). NCAI in Venice stays `#CB0520`. Do not re-run the palette script without removing the Resounding Rhizomes entry. Pre-change values: `backups/hero-palette-before-venice-2026-11-10.txt` (untracked).
- [ ] **CLAUDE.md** — add: after Sanity content changes or branch switches, `rm -rf .next` before restarting `next dev` (fetched data is cached there; restart alone is not enough). Not yet written.
- [ ] Untracked local files left alone: `.memsearch/`, `backups/`, `scripts/data/demo-content/texts-batch-1.json`.

