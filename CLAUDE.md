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

**Images.** Build URLs with `urlFor()` from `src/sanity/lib/image.ts`. Remote image hosts are whitelisted in `next.config.ts` (`cdn.sanity.io`, `images.unsplash.com`, etc.) — add new hosts there or `next/image` will reject them.

**Redirects.** `/support` and `/membership` permanently redirect to `/get-involved` (in `next.config.ts`).

## Agent skills

### Issue tracker

Issues live in GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Using default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at root). See `docs/agents/domain.md`.
