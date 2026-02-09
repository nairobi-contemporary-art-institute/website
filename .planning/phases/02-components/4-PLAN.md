---
phase: 2
plan: 4
wave: 1
---

# Plan 2.4: Header & Navigation

## Objective
Implement the global Header, Navigation system, and Language Switcher, and polish existing components with animation.

## Context
- [DESIGN_SYSTEM.md](file:///Users/ciarannash/Documents/NCAI/docs/planning/specs/DESIGN_SYSTEM.md)
- [RESEARCH.md](file:///Users/ciarannash/Documents/NCAI/.planning/phases/02-components/RESEARCH.md)
- `src/i18n.ts` (Routing logic)

## Tasks

<task type="auto">
  <name>Polish ResponsiveDivider Animation</name>
  <files>
    - `src/components/ui/ResponsiveDivider.tsx`
  </files>
  <action>
    Implement GSAP "Draw-in" animation to the ResponsiveDivider.
    1. Import `useGSAP` from `@gsap/react` and `gsap`.
    2. Use `useRef` for the SVG or Path element.
    3. In `useGSAP`, animate the path's `strokeDashoffset` from its total length to 0.
       - Use `path.getTotalLength()` to get length.
       - Set `strokeDasharray` to length.
       - Animate `strokeDashoffset` from length to 0.
       - Ease: 'power2.out' or similar smooth ease.
       - Duration: ~1.5s.
    4. Ensure `vector-effect="non-scaling-stroke"` is preserved.
  </action>
  <verify>Divider animates ("draws itself") when component mounts.</verify>
  <done>ResponsiveDivider has entrance animation.</done>
</task>

<task type="auto">
  <name>Create LanguageSwitcher</name>
  <files>
    - [NEW] `src/components/ui/LanguageSwitcher.tsx`
  </files>
  <action>
    Create a client component to switch between locales.
    1. Import `usePathname`, `useRouter`, `locales` from `@/i18n`. (Note: Verify import path from `src/i18n.ts` export).
    2. Render a simple dropdown or list of languages.
    3. On click/change, push the new path with the updated locale prefix.
    4. Style: Minimalist text or "Globe" icon, consistent with Design System.
  </action>
  <verify>Changing language updates the URL and stays on the same page.</verify>
  <done>LanguageSwitcher implemented and functional.</done>
</task>

<task type="auto">
  <name>Implement Header & Navigation</name>
  <files>
    - [NEW] `src/components/layout/Header.tsx`
    - `src/app/[locale]/layout.tsx`
  </files>
  <action>
    Create the global Header component.
    1. Structure: `<header>` with semantic HTML.
    2. Content:
       - Logo (NCAI) linked to home (`/`).
       - Desktop Nav: Links to `/about`, `/visit`, `/exhibitions`, `/collection`, `/education`, `/support`.
       - Utils: `LanguageSwitcher`.
       - Mobile Nav: Hamburger button -> Slide-over menu or Dropdown.
    3. Styling:
       - Sticky or fixed at top.
       - Glassmorphism effects (backdrop-blur) if desired.
       - Responsive layout (flex/grid).
    4. Integration:
       - Import and add `<Header />` to `src/app/[locale]/layout.tsx` (inside `NextIntlClientProvider` to share context if needed, or if Header handles its own messages).
  </action>
  <verify>Header appears on all pages. Navigation links work. Mobile menu toggles.</verify>
  <done>Header component implemented and integrated.</done>
</task>

## Success Criteria
- [ ] ResponsiveDivider has "draw-in" animation.
- [ ] Header includes working Navigation and Language Switcher.
- [ ] Responsive behavior (Mobile vs Desktop) verified.
