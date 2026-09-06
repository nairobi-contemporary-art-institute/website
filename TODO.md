# TODO

## Immediate (Testing)
- [ ] Push typography commits — `0739a1c` (Inter self-host) + `591916a` (weight hierarchy) on `fix/cinematic-gallery-ref-type`; manual QA at `/styleguide` first, then push
- [ ] Verify video playback on channel page — added `videoUrl` to `POST_BY_SLUG_QUERY`, need to test with actual video posts
- [ ] Verify hero renders correctly with Sanity data in Studio — confirm new schema fields (slides, imageSize, date range) save and display properly

## Polish
- [ ] Fix `motion()` Framer Motion deprecation — migrate to `motion.create()` in `HomeHeroNew.tsx`
- [ ] Image overflow handling — images clip at section edges when hotspot positions near boundaries
- [ ] Dev server stability — investigate why server dies mid-session; consider health checks

## Data
- [ ] Collection items missing `slug`s — work cards render but aren't clickable (`href="#"`) in both masonry and By-Artist views. Backfill slugs in Sanity (or via import script) so `/collection/[slug]` detail pages link. Pre-existing; surfaced during By-Artist work.

## Features
- [ ] Mobile hero layout — text flip behavior needs mobile-specific adjustments
- [ ] Auto-advance controls — make carousel timing configurable per-slide
