# Project Sitemap: Source of Truth

This document serves as the master sitemap for the NCAI website. It tracks the implementation status of all routes and captures key UX architectural considerations.

## Implemented Legend
- [ ] Planned / Not Started
- [/] In Progress / Partially Implemented
- [x] Complete / Verified

---

## Site Structure

```text
/ (Home: English Default)
├── [Locale Prefixes: /sw, /ar, /hi, /de, /pt, /fr, /es, /am, /so]
│
├── [ ] / (Home)
│   └── [ ] Simplified Timeline Teaser Section (3-4 Hook Eras)
│
├── [ ] /about (About Us)
│   ├── [ ] /about/mission (Mission & Vision)
│   ├── [ ] /about/history
│   │   └── [ ] Institutional Curvilinear Timeline Component
│   ├── [ ] /about/team
│   └── [ ] /about/careers (Careers & Opportunities)
│
├── [ ] /visit
│   ├── [ ] /visit/hours (Location & Hours)
│   ├── [ ] /visit/accessibility (Inclusive Access Info)
│   ├── [ ] /visit/policies (Gallery Rules & Consent)
│   └── [ ] /visit/directions
│
├── [ ] /exhibitions
│   ├── [ ] /exhibitions/current
│   ├── [ ] /exhibitions/upcoming
│   ├── [ ] /exhibitions/archive (Past Exhibitions)
│   └── [ ] /exhibitions/:slug (Rich Media Detail)
│
├── [ ] /artists
│   ├── [ ] /artists/index (A-Z Directory)
│   └── [ ] /artists/:slug (Artist Profile)
│
├── [ ] /events
│   ├── [ ] /events/calendar
│   └── [ ] /events/:slug (Registration Flow)
│
├── [ ] /education
│   ├── [ ] /timeline (Immersive Art History: Full-screen)
│   ├── [ ] /education/ujuzi (Mentorship)
│   ├── [ ] /education/schools (Educators)
│   └── [ ] /education/families (Community)
│
├── [ ] /channel (Media Hub)
│   ├── [ ] /channel/watch (Artist Films)
│   ├── [ ] /channel/listen (Podcasts)
│   ├── [ ] /channel/read (Essays/Reviews)
│   └── [ ] /channel/commissions (Digital Arts)
│
├── [ ] /collection (Digital Archive)
│   ├── [ ] /collection/search
│   └── [ ] /collection/:id (Artifact Detail)
│
├── [ ] /library (Physical & Digital)
│
├── [ ] /support
│   ├── [ ] /support/membership
│   ├── [ ] /support/donate
│   └── [ ] /support/partnerships
│
├── [ ] /shop (V2 Foundation)
│   ├── [ ] /shop/publications
│   └── [ ] /shop/merchandise
│
├── [ ] /contact (Inquiry Form)
│
└── [Global Layout]
    ├── [ ] Accessibility Controls (Reduced Motion Toggle)
    ├── [ ] Global Header / Mobile Menu
    └── [ ] Global Broadcast Bar (Open/Closed Indicator)
```

---

## Architectural Notes

### 1. Immersive Timeline Navigation
The `/timeline` route is distinct from the rest of the site. While the standard pages use traditional scrolling, the Immersive Timeline acts as a **Digital Wing**. It utilizes a "Scroll-Locked" or "Virtual Scroll" experience where the user's scroll wheel drives the motion path of the SVG spine rather than the vertical displacement of the page.

### 2. Multi-Tiered History Experience
Instead of relegating history to a single page, we use a **Waterfall Strategy**:
*   **The Hook**: Home section teaser.
*   **The Context**: About Us institutional trail.
*   **The Deep Dive**: The Immersive Experience.
All three pull from the same `TimelineEvent` Sanity schema but filter content based on `VariantPriority`.

### 3. Internationalization (i18n) Logic
We utilize **Sub-path Routing**. Middleware will detect the user's browser language and redirect to the appropriate prefix (`/sw/`, `/en/`, etc.) if no prefix is present.
*   **RTL Consideration**: The entire layout (Sidebar, Grid systems, Timeline direction) must mirror for the `/ar` locale.

### 4. Accessibility First
High-motion GSAP experiences can be exclusionary. We implement a **Motion-Aware Rendering** strategy:
*   If `Reduced Motion` is active, the curvilinear components are replaced with a standard, accessible vertical list. This is handled via a global `useReducedMotion` React context.

### 5. Media-Dense Loading
Given the "media-rich" requirement for the Channel and Timeline, we prioritize **Lazy-Loading** and **Next/Image optimization**. Video assets will be streamed (Mux/Vimeo) rather than locally hosted to ensure performant loading in regions with varying bandwidth.
