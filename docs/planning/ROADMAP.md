# Project Roadmap

## Phase 1: Foundation, CMS & i18n Infrastructure
**Goal**: Technical initialization with robust multi-language support.
- **Design System Definition**: Define Color Palette, Typography, and Layout Grid in `DESIGN_SYSTEM.md`.
- **Brand Asset Integration**: Import Logos, Favicons, and initial brand assets.
- Initialize Next.js 15, Tailwind v4, Sanity.
- **Configure i18n Routing**: Setup middleware for 10 languages: `en`, `sw`, `ar`, `hi`, `de`, `pt`, `fr`, `es`, `am`, `so`.
- **Configure Fonts**: Implement `next/font` with subsets/families for Latin, Arabic, Devanagari, and Ethiopic scripts.
- **Configure Layouts**: Implement LTR/RTL switching logic based on locale.
- **Configure CMS i18n**: Enable field-level translation for all 10 languages in Sanity options.
- Implement Core Schemas (`Exhibition`, `Artist`, etc.) with localization enabled.
- **Milestone**: "Hello World" site reachable in all 10 language paths with correct fonts/layout.

## Phase 2: Core Architecture & Info Pages
**Goal**: Static pages and Global Layout.
- **Component Construction**: Build UI Library (Buttons, Cards, Inputs) based on Design System.
- Build Global Navigation with **Language Switcher**.
- Build Static Pages (Localized): About, Visit, Contact, Support Us.
- **Milestone**: Base site structure navigable in all languages.

## Phase 3: The Artistic Core (Exhibitions & Artists)
**Goal**: The primary value proposition.
- Build "Exhibitions" section (List & Details).
- Build "Artists" section (Index & Profiles).
- Implement Search functionality foundation.
- **Milestone**: Browsable catalog of exhibitions and artists.

## Phase 4: Engagement, Channel & Education
**Goal**: Dynamic content for visitors.
- Build "Events" Calendar.
- Build "Education" & "Library" sections.
- Build "The Channel" (Media/Blog) & Publications list.
- **Milestone**: Full content site operational.

## Phase 5: Polish & Launch
**Goal**: Production readiness.
- Performance Optimization (Image handling).
- SEO & Metadata entry (Localized for all 10 langs).
- Accessibility Audit.
- **Milestone**: Public Launch (v1).
