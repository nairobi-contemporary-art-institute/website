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

## Follow-ups from the 2026-11-10 visual-pass session (#39–#61 merged)
- [ ] **Check the live homepage hero colour** — Resounding Rhizomes was reverted in Sanity to `#838c83` (black text) on 2026-11-10, but the live site cached the old Sea Pink `#E98E96` (data cache up to 1h; the Sanity → `/api/revalidate` webhook did not fire for the edit). Confirm https://website-psi-woad-51.vercel.app/en shows grey-green; if still pink after ~1h, trigger the webhook / redeploy. Also confirm the Sanity webhook for `homePage` is configured (secret `SANITY_REVALIDATE_SECRET` lives in Vercel, not locally).
- [ ] **Watch the staggered hero entrance by eye** (#61) — measured, not viewed; also try reduced-motion.
- [ ] **Fill placeholders in Studio** — "[title and year to be confirmed]" (2 works in the Armitage/Lassnig/van Rampelberg show), "[title to be confirmed]" (Tabula Rasa hero image), "Title 1–6" on Tabula Rasa `work` documents / remaining gallery captions. These show publicly until filled.
- [ ] **Native-speaker review** of machine translations added in #54/#56 (`WhatsOn` namespace, Read/Listen/Watch): am, ar, so, sw, hi first.
- [ ] **Event/programme type labels** (~25 options, e.g. "Artist Talk", "Course") are CMS-driven and English-only; translate in Sanity or add to messages. About/Visit intro paragraphs and exhibition titles/descriptions are English-only in Sanity.
- [ ] **Header title in Somali** — longest title; always falls back to the compact logo (by design, `useTitleFits`). Revisit if a shorter Somali title is approved.
- [ ] **Ready-to-run Venice palette** — `scripts/patch-hero-venice-palette.mjs` was applied 2026-11-10; Resounding Rhizomes then reverted (`scripts/revert-resounding-rhizomes-colour.mjs`). NCAI in Venice stays `#CB0520`. Do not re-run the palette script without removing the Resounding Rhizomes entry. Pre-change values: `backups/hero-palette-before-venice-2026-11-10.txt` (untracked).
- [ ] **CLAUDE.md** — add: after Sanity content changes or branch switches, `rm -rf .next` before restarting `next dev` (fetched data is cached there; restart alone is not enough). Not yet written.
- [ ] Untracked local files left alone: `.memsearch/`, `backups/`, `scripts/data/demo-content/texts-batch-1.json`.

