# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nairobi Contemporary Art Institute (NCAI) website — a premium, multilingual digital presence for exhibitions, artists, education programs, and a growing digital archive of East African contemporary art.

## Commands

- `npm run dev` — start dev server (Next.js + Turbopack) on http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`)

No test runner is configured — there is no test script or framework in the repo.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Sanity v5 (headless CMS, Studio mounted in-app) · `next-intl` (i18n) · GSAP + Framer Motion for animation.

## Architecture

**Everything is locale-scoped.** All pages live under `src/app/[locale]/` and are driven by `next-intl`. Locale config is in `src/i18n.ts`; UI strings live in `messages/*.json` (am, ar, de, en, es, …). `next.config.ts` wraps the config in `withNextIntl`.

**Content is Sanity-driven.** There are two Sanity locations:
- `sanity/schemaTypes/*` — Studio document/object schemas (exhibition, artist, event, post, page, siteSettings, etc.).
- `src/sanity/lib/*` — how the app reads content: `client.ts`, `queries.ts`, `image.ts`, `utils.ts`.

**Data fetching pattern.** Use `sanityFetch()` from `src/sanity/lib/client.ts` — it wraps `client.fetch` with Next.js tag-based revalidation (default 3600s). Keep GROQ queries centralized in `src/sanity/lib/queries.ts` rather than inlining them in components.

**Localized fields are internationalized arrays.** Many Sanity fields (e.g. artist `name`, portable text) are arrays keyed by locale (`name[@._key == $locale].value`). Never index them raw — use `getLocalizedValue()` and `portableTextToPlainText()` from `src/sanity/lib/utils.ts`.

**Studio** is served in-app at `/studio` (`src/app/studio/`).

**Composed, schema-driven pages.** Detail pages assemble many section components based on schema fields rather than hardcoded layout. Example: the exhibition detail page (`src/app/[locale]/exhibitions/[slug]/page.tsx`) reads fields like `heroLayout`, `galleryLayout`, `extraSections[]`, and `mediaModule`, then renders matching components from `src/components/exhibitions/`. When changing a page's layout, expect to touch both the schema (`sanity/schemaTypes/`) and the query (`src/sanity/lib/queries.ts`), not just the component.

**Texts (`/texts`).** Essays, interviews, conversations and artists' writings are the `textPiece` document type (`text` is a Sanity built-in). The body is `textBody`, rendered by its own serializer `src/components/texts/TextBody.tsx` (per-block widths: column / wide / full bleed) — not the shared `components/ui/PortableText.tsx`. Interviews list `participants` (Speakers) and mark turns with an inline `speaker` object; `labelSpeakerTurns()` in `src/lib/texts.ts` shows full name first, initials after. Text pages emit Article + Person JSON-LD (`src/lib/jsonld.ts`). Pages that list texts carry the `textPiece` cache tag. Live nav for Texts is added by `scripts/patch-nav-texts.mjs` (dry run by default). See ADR 0004.

**Images.** Build URLs with `urlFor()` from `src/sanity/lib/image.ts`. Remote image hosts are whitelisted in `next.config.ts` (`cdn.sanity.io`, `images.unsplash.com`, etc.) — add new hosts there or `next/image` will reject them.

**Design principles.** UI follows Swiss-style rules in `docs/DESIGN_PRINCIPLES.md` (8px base, 12-col grid, one shared container, 3 hierarchy levels, Inter only, reduction first). Check new layouts against its review checklist; fix misalignment in the system (container/tokens), not with per-section nudges. See ADR 0005.

**Homepage hero + Visit us.** Hero slides are Sanity content (`homePage.hero.slides[]`), not code: image, `layout` (`split-right` = image left / colour panel right), `gradientColor`, `forceBlackText` all live in the CMS, so changing a slide's colour or image is a Sanity patch (see `scripts/ingest-*-featured-image.mjs`, dry run by default), not a deploy. `HomeHeroNew.tsx` renders it with edge arrows and picks black/white arrow colour from the backdrop. The hero and `VisitUs.tsx` (hours from `siteSettings.hours`, Nairobi time) share the first viewport: hero is `flex-1`, the band sits at the bottom. Icons come from Next file conventions in `src/app/` (`favicon.ico` must have RGBA PNG layers, `icon.svg`, `apple-icon.png`, `manifest.ts`) — don't re-add manual `icons` metadata.

**Redirects.** `/support` and `/membership` permanently redirect to `/get-involved` (in `next.config.ts`).

## Git workflow

`main` is protected (PR required, no force push or deletion; admins can bypass) and auto-deploys to Vercel. Work on a branch, run `npm run build`, open a PR, then merge. After changing Sanity content locally, restart `next dev` — fetched data is cached in memory.

## Agent skills

### Issue tracker

Issues live in GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

**GitHub account for this repo: `nairobi-contemporary-art-institute`** (not the machine's default `gh` account). `git` is set per-repo in `.git/config` to use it. Claude sessions get `GH_TOKEN` for it from a SessionStart hook in `.claude/settings.local.json`. Any other agent or shell must prefix `gh` commands: `GH_TOKEN=$(gh auth token --user nairobi-contemporary-art-institute) gh …`.

### Triage labels

Using default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at root). See `docs/agents/domain.md`.
