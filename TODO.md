# TODO

## Immediate (Testing)
- [ ] Push typography commits — `0739a1c` (Inter self-host) + `591916a` (weight hierarchy) on `fix/cinematic-gallery-ref-type`; manual QA at `/styleguide` first, then push
- [ ] Verify video playback on channel page — added `videoUrl` to `POST_BY_SLUG_QUERY`, need to test with actual video posts
- [ ] Verify hero renders correctly with Sanity data in Studio — confirm new schema fields (slides, imageSize, date range) save and display properly

## Polish
- [ ] Fix `motion()` Framer Motion deprecation — migrate to `motion.create()` in `HomeHeroNew.tsx`
- [ ] Image overflow handling — images clip at section edges when hotspot positions near boundaries
- [ ] Dev server stability — investigate why server dies mid-session; consider health checks

## Content migration (ncai254.com → Sanity)
- [ ] Localization — all imports English-only (`internationalizedArray` key `en`); am/ar/de/es empty. Decide: machine-translate pass vs editor task.
- [ ] Artist Talk posts — 8 imported (`create_posts.js`) with blank `videoUrl`; per-video Vimeo IDs not in scrape. Backfill Vimeo URLs so `/channel/[slug]` plays.
- [ ] Publication cover images — 4 new pubs use generated 3D covers (color only), `coverImage` blank; page-order mapping ambiguous. Add real covers in Studio if wanted.
- [ ] Artist Films page — 4 Vimeo links, no titles/metadata; not imported. Pull titles from Vimeo then create film posts.
- [ ] Channel root (`/channel`) intro images — 2 Wix images not migrated.

## Data
- [ ] Collection items missing `slug`s — work cards render but aren't clickable (`href="#"`) in both masonry and By-Artist views. Backfill slugs in Sanity (or via import script) so `/collection/[slug]` detail pages link. Pre-existing; surfaced during By-Artist work.

## Collection page (Studio-Museum-style artist browsing — `a328f43`)
- [ ] i18n coverage — new `viewWorks`/`hideWorks` keys added to `en`/`sw` only; other 8 locales have no `Pages.collection` at all, so `/collection` shows raw keys there. Ties into Localization item above.
- [ ] Representative thumbnail is "artist's first work with an image" (client-derived). If curators want control, add a `collectionThumbnail` field to the artist schema + wire into `ARTISTS_INDEX_QUERY` / grouping.
- [ ] Pagination — reference paginates artists (~29 pages); we render all artist cards at once. Fine at current scale; add pagination/lazy-load as the collection grows.

## Features
- [ ] Mobile hero layout — text flip behavior needs mobile-specific adjustments
- [ ] Auto-advance controls — make carousel timing configurable per-slide
