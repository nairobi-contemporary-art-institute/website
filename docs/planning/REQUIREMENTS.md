# Requirements (Enhanced NCAI Content Tree + Multi-Language i18n)

## V1 Requirements (Launch)

### Core Platform
- [ ] **CORE-01**: Setup Next.js 15 + Tailwind v4 + Sanity project structure.
- [ ] **CORE-02**: Implement global layout (Header, Footer, Mobile Menu).
- [ ] **CORE-03**: Implement "Open/Closed" status indicator in broadcast bar.
- [ ] **CORE-04**: Global SEO & Footer contact info.
- [ ] **CORE-05**: **Internationalization (i18n)** covering 10 languages:
    - English (en), Swahili (sw), Arabic (ar), Hindi (hi), German (de), Portuguese (pt), French (fr), Spanish (es), Amharic (am), Somali (so).
- [ ] **CORE-06**: **Premium Motion (GSAP)**:
    - Setup `gsap` + `@gsap/react`.
    - Implement smooth page transitions.
    - Implement scroll-driven reveals (ScrollTrigger).
    - **Accessibility**: Implement Reduced Motion Toggle & Respect `prefers-reduced-motion`.
        - **Placement**: Header, Footer, and Floating Accessibility Controls.
- [ ] **CORE-07**: **Content Migration**: Audit and migrate existing Wix content to Sanity.

### Content Types (Sanity CMS)
- [ ] **CMS-01**: `Exhibition` (Title, dates, description, gallery, artists). *Localized Fields*.
- [ ] **CMS-02**: `Event` (Calendar items, registration). *Localized Fields*.
- [ ] **CMS-03**: `Artist` (Bio, Works, linked Exhibitions). *Localized Fields*.
- [ ] **CMS-04**: `ArchiveItem` (Digital assets for the Collection). *Localized Fields*.
- [ ] **CMS-05**: `Post` (Channel content: Video, Audio, Essay). *Localized Fields*.
- [ ] **CMS-06**: `Program` (Education categories: UJUZI, Schools, Families). *Localized Fields*.
- [ ] **CMS-07**: `Publication` (Book info). *Localized Fields*.
- [ ] **CMS-08**: `DigitalCommission` (New: Net art/Digital-first works). *Localized Fields*.
- [ ] **CMS-09**: `Member` & `Donation` foundations.
- [ ] **CMS-10**: `TimelineEvent` (For History of East African Art). *Localized Fields*.

### Feature Areas & Pages (Enhanced Strategy)
#### 1. Information & Visit
- [ ] **FE-01**: **Home Page**: Intro, Highlights, News, Status Widget.
    - [ ] **FE-01.1**: *Simplified Timeline Teaser* (3-4 key eras as a hook).
- [ ] **FE-02**: **About Us**: Mission, History, Team, Careers.
    - [ ] **FE-02.1**: *Institutional Timeline* (NCAI's history integrated with art context).
- [ ] **FE-03**: **Visit**: Location & Directions, **Accessibility**, **Gallery Policies**, Parking.
- [ ] **FE-04**: **Contact**: General Inquiries, Map.

#### 2. Programmes & Collection
- [ ] **FE-05**: **Exhibitions**: Current, Upcoming, Past Archive.
- [ ] **FE-06**: **Artists**: Index A-Z and Profile pages.
- [ ] **FE-07**: **Events**: Calendar feed with specific event details.
- [ ] **FE-08**: **Education (Segmented)**: UJUZI, Schools/Teachers, Families/Communities.
    - [ ] **FE-14**: **Immersive Art History Timeline**: Full-screen, content-rich interactive page.
- [ ] **FE-09**: **Library**: About and digitized collection access.
- [ ] **FE-10**: **Collection**: Searchable archive of artifacts.

#### 3. Media & Shop
- [ ] **FE-11**: **The Channel (Media)**: Watch (Artist Films), Listen (Podcasts/Audio Guides), Read (Essays/Reviews), Digital Commissions.
- [ ] **FE-12**: **Publications**: Catalog and Book shop-front references.
- [ ] **FE-13**: **Support Us**: Membership, Donations, Partnerships.

### Functional Requirements
- **Perf**: Core Vitals (LCP < 2.5s).
- **A11y**: WCAG 2.1 AA with dedicated Accessibility page.
- **RTL Support**: Arabic layout mirroring.
- **Font Support**: Latin, Arabic, Devanagari, and Ethiopic scripts.
