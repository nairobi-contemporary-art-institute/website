# Repository Guidelines

## Project Structure & Module Organization

NCAI (Nairobi Contemporary Art Institute) website — Next.js 16 App Router + Sanity CMS + next-intl.

Key non-obvious relationships:

- `src/app/[locale]/` — all public pages are locale-wrapped; middleware handles locale detection and redirects
- `src/app/studio/` — Sanity Studio embedded at `/studio` route, separate from Next.js content rendering
- `src/components/museum/` — shared cross-page component library (e.g. `TimelineTeaser`); prefer adding reusable components here over duplicating across feature folders
- `src/sanity/lib/` — runtime CMS integration: `client.ts`, `image.ts`, `queries.ts`; distinct from `sanity/` (schema definitions used only by Studio)
- `sanity/schemaTypes/` — CMS content model; changes here require Sanity Studio redeployment
- `src/lib/` — shared utilities (analytics, GSAP helpers, listmonk newsletter integration)
- `src/app/api/revalidate/` — on-demand ISR endpoint; Sanity webhooks call this to invalidate cached pages
- GSAP is explicitly transpiled in `next.config.ts` — do not remove `transpilePackages: ['gsap', '@gsap/react']`
- `@/*` path alias resolves to `./src/*`

## Build & Development Commands

```bash
npm install        # install deps
npm run dev        # dev server (port 3000)
npm run build      # production build (runs tsc + Next.js build)
npm run start      # serve production build
npm run lint       # ESLint (excludes sanity/, .next/, build/)
```

No test framework is configured. Manual verification via `npm run dev` is the current testing approach.

## Coding Style & Naming Conventions

- **TypeScript strict mode** — `strict: true` in tsconfig; avoid `any` (ESLint warns)
- **ESLint**: `next/core-web-vitals` + `next/typescript`; `@typescript-eslint/no-unused-vars` is warn-only; `react/no-unescaped-entities` is off
- `sanity/` directory is excluded from ESLint — Sanity schema files are not linted
- Components: PascalCase files in domain folders under `src/components/`
- Utilities: camelCase in `src/lib/`
- Tailwind CSS v4 via `@tailwindcss/postcss` — utility-first; use `tailwind-merge` for conditional class merging

## Internationalization

- All routes live under `src/app/[locale]/` — never add top-level app routes
- `next-intl` plugin configured via `./src/i18n.ts`
- Middleware (`src/middleware.ts`) handles locale detection and Sanity Studio bypass

## Commit Guidelines

Conventional commits with optional scope in parens:

```
feat(scope): description
fix: description
chore: description
docs(scope): description
```

Examples from history: `feat(v1.2): ...`, `docs(phase-01): ...`, `feat(infrastructure): ...`

Use `[skip ci]` suffix on planning/docs-only commits when no deployment is needed.
