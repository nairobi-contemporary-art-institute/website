# TODO (offline mirror — GitHub Issues #4–#13 are canonical, all `ready-for-agent`)

## Immediate (Testing)
- [ ] Push typography commits — `0739a1c` + `591916a` on `fix/cinematic-gallery-ref-type`; manual QA at `/styleguide` first, then push (#5 — commits pushed 2026-10-03; QA still pending)
- [ ] Verify video playback on channel page — added `videoUrl` to `POST_BY_SLUG_QUERY`, need to test with actual video posts (#11 — path verified in code against 6 playable portrait posts; in-browser check pending)
- [ ] Verify hero renders correctly with Sanity data in Studio — confirm new schema fields (slides, imageSize, date range) save and display properly (#7)

## Polish (#12 — motion() item closed as moot; auto-advance landed per-slide timing)
- [ ] Image overflow handling — images clip at section edges when hotspot positions near boundaries
- [ ] Dev server stability — investigate why server dies mid-session; consider health checks (#13)
- [ ] Mobile hero layout — text flip behavior needs mobile-specific adjustments

## Content migration (ncai254.com → Sanity)
- [ ] Localization — all imports English-only (`internationalizedArray` key `en`); am/ar/de/es empty. Decide: machine-translate pass vs editor task. (#9 decision → #10 execution)
- [ ] Artist Talk posts — 8 imported (`create_posts.js`) with blank `videoUrl`; per-video Vimeo IDs not in scrape. Backfill Vimeo URLs so `/channel/[slug]` plays. (#11 — the 8 are the `*-in-conversation` + walk-and-talk posts)
- [ ] Publication cover images — 4 new pubs use generated 3D covers (color only), `coverImage` blank; page-order mapping ambiguous. Add real covers in Studio if wanted. (#8)
- [ ] Artist Films page — 4 Vimeo links, no titles/metadata; not imported. Pull titles from Vimeo then create film posts. (#11)
- [ ] Channel root (`/channel`) intro images — 2 Wix images not migrated. (#8)

## Data
- [ ] Collection items missing `slug`s — work cards render but aren't clickable (`href="#"`) in both masonry and By-Artist views. Backfill slugs in Sanity (or via import script) so `/collection/[slug]` detail pages link. Pre-existing; surfaced during By-Artist work. (#4)

## Collection page (Studio-Museum-style artist browsing — `a328f43`)
- [ ] i18n coverage — new `viewWorks`/`hideWorks` keys added to `en`/`sw` only; other 8 locales have no `Pages.collection` at all, so `/collection` shows raw keys there. Ties into Localization item above. (#10, after #9)
- [ ] Representative thumbnail is "artist's first work with an image" (client-derived). If curators want control, add a `collectionThumbnail` field to the artist schema + wire into `ARTISTS_INDEX_QUERY` / grouping. (#10)
- [ ] Pagination — reference paginates artists (~29 pages); we render all artist cards at once. Fine at current scale; add pagination/lazy-load as the collection grows. (#10)

## Features (#12)
- [ ] Per-slide carousel timing — DONE 2026-10-03 (hero `durationSeconds` + fallback; needs Studio redeploy)
