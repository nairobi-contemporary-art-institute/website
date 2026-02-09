---
phase: 2
plan: 5
wave: 1
---

# Plan 2.5: Static Pages

## Objective
Scaffold the core informational pages of the site with basic content structure to establish the site architecture.

## Context
- `src/app/[locale]/layout.tsx`
- `messages/en.json`

## Tasks

<task type="auto">
  <name>Create Static Page Routes</name>
  <files>
    - [NEW] `src/app/[locale]/about/page.tsx`
    - [NEW] `src/app/[locale]/visit/page.tsx`
    - [NEW] `src/app/[locale]/contact/page.tsx`
    - [NEW] `src/app/[locale]/support/page.tsx`
    - `messages/en.json`
  </files>
  <action>
    1. Update `messages/en.json` to include titles/content for the new pages.
    2. Create `page.tsx` for each route:
       - `/about`
       - `/visit`
       - `/contact`
       - `/support`
    3. For each page:
       - Use `generateMetadata` to set localized titles.
       - Use `useTranslations` to render content.
       - Implement a basic layout structure (Hero + Content).
  </action>
  <verify>Navigate to /about, /visit, etc. and see correct titles/content.</verify>
  <done>Static pages created and accessible via routing.</done>
</task>

## Success Criteria
- [ ] All 4 static pages exist and render without errors.
- [ ] Metadata titles are correct for each page.
