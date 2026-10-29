# NCAI Design Principles

Swiss / International Typographic Style, adapted for NCAI. Core idea: **clarity through reduction.** Every element earns its place; remove until removing more would harm understanding.

Distilled from the `swiss-design` skill by ZempTime (`ZempTime/zemptime-marketplace`), then adapted to what NCAI already ships (Inter, sharp edges, Light/Regular/Bold, Sanity-driven layouts). Where NCAI differs from the source, the NCAI value wins and is marked **NCAI**.

Related: ADR 0005 (`docs/adr/0005-swiss-design-principles.md`), tokens in `src/app/globals.css` (`@theme`).

## The four principles

| Principle | Rule | Test |
|---|---|---|
| Reduction | If it doesn't serve comprehension, it's noise. | Can I remove this without losing meaning? |
| Grid | Mathematical structure creates order. Alignment implies relationship. | Does alignment create rhythm and relationships? |
| Hierarchy | Control attention with contrast in size, weight, position. Three levels max. | Is there a clear reading order at a glance? |
| Typography | Type carries content and structure. One family. | Is type doing the structural work, not colour or decoration? |

Two checks before any layout ships:
- **Grayscale test**: if it fails in grayscale, structure is weak. Colour supplements hierarchy, never creates it.
- **Squint test**: blur your eyes. What reads first? If nothing, hierarchy is broken.

## Grid

Fewer alignment points = stronger grid. Every unique left edge adds cognitive load.

- **Base unit 8px.** Spacing is multiples of it: 4 / 8 / 16 / 24 / 32 / 48.
- **12-column page grid** (exists: `--grid-columns`), 24px gutter (3x base).
- **One Page container, one left margin.** All content blocks on a page share the same left edge. Do not hand-roll `max-w-*` + `px-*` per section; reuse the shared container. **Max width 1440px**, centred, with a full-bleed exception for hero and gallery images. Side padding is **`px-6 md:px-12`** (24px phone, 48px desktop). The header uses the same width and side padding as the page, so the logo and page content share a left edge.
- **Page container vs Measure** (see `CONTEXT.md`). The container fixes where content starts. A Measure fixes how wide a block of text runs. A Measure sits inside the container. Existing named widths in `globals.css`: `measure` (`--container-reading`, 40rem) and `measure-wide` (`--container-reading-wide`, 64rem), plus full container width. Reuse these; do not add parallel names or raw `max-w-*` for text.
- **Left-aligned by default.** Page-level text and blocks align to the container's left edge. Centring a narrower block (`mx-auto` with `max-w-5xl` / `6xl`) moves its left edge per page at 1440px and is the main source of misalignment. Allowed centred exceptions: the Texts reading column (`measure`, an editorial choice), modals, lightboxes, timelines.
- **Existing grid system.** `Grid` (`src/components/ui/Grid`, 12 columns via `--grid-columns`) and the Shift+G `GridInspector` already exist and are used on collection, exhibitions and artists pages. Extend these before building anything new.
- **`.container` is a hack today** (`globals.css`: `max-width: calc(100% - 48px) !important`, 24px margins, no cap, no padding), and 35 of its 56 uses stack their own `px-*` / `mx-auto` on top, so desktop content starts at 24, ~40-48 or 72px depending on the page. **Migration (decided): add a new `page-container` utility** (max 1440px, centred, `px-6 md:px-12`, no `!important`), move pages over in batches, strip their stacked `px-*` / `mx-auto`, then delete `.container`. Never apply both classes to one element. Progress meter: count of remaining `container` uses.
- Components use the same base unit inside (spacing is fractal).
- Vertical rhythm: line heights are multiples of the base unit.
- Tables: numbers right-align, text left-aligns, headers match their column.
- **Allowed breaks**: full-bleed images, pull quotes, optical corrections for icons. Texts (`TextBody`) already does column / wide / full bleed; that is the model.
- **Red flags**: "just this once" positioning, pixel nudges to "make it look right", different spacing in similar components. If you nudge pixels, the grid or the content is wrong. Fix the system, not the instance.

### Effective left edge (reference)
Before migration, desktop content starts at: texts list 24px, most pages ~40-48px (`container` + `px-section-clamp`), HomeAbout / banner / MegaMenu 72px, header 48px. After migration every one of these is 48px at 1440px (and 24px on phones), with the container centred beyond 1440px.

### Audit method
Measure against the definitions above, not an edge count alone.
1. **Sections on the container**: every section's content box starts at the Page container's left edge, at 1440 / 768 / 390. Report offenders.
2. **Text on a named Measure**: every text block's width maps to `measure`, `measure-wide` or full container width. Report stray `max-w-*` values (today: 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, plus md/xl/lg).
3. **`mx-auto` check**: flag any centred block inside the container that is not an allowed exception.
4. Also check: font sizes and weights in use, off-scale spacing, horizontal overflow.
Test locales: `en`, `ar` (RTL), `am` (long script). Use pinned content slugs; Sanity CDN lags about 60s.

## Hierarchy

Everything emphasised = nothing emphasised. Three levels only:

| Level | Purpose | Treatment |
|---|---|---|
| Primary | Main message or action | Large, bold, prominent |
| Secondary | Supporting content | Regular size and weight |
| Tertiary | Metadata, captions | Smaller, lighter, peripheral |

One strong lever per level (size, weight, or position). One primary action per view. Do not inflate sizes per feature.

## Typography

- **One family: Inter** (self-hosted), plus Noto for Arabic / Devanagari / Ethiopic. Variety is decoration.
- **NCAI weights: Light / Regular / Bold**, enforced in `@theme`. (Source recommends Regular + Bold only; NCAI keeps Light for display. Do not use Light below body size or for small text; it hurts legibility, especially in non-Latin scripts.)
- 4-5 sizes per view, following a ratio. If 12, 13, 14, 15, 16px all appear in one view, there is no system.
- Body: line-height 1.5, measure 45-75 characters (`max-width: 65ch`). Headings: line-height 1.2, `max-width: 25ch`. Check Amharic, Arabic and Hindi measure separately.
- Weight is scarce. Do not bold paragraphs; bold specific terms.
- Tabular figures (`font-variant-numeric: tabular-nums`) for dates, years, numbers.
- Headings signal structure, not importance. Never skip heading levels.

## Reduction

For each element ask: if I remove this, what do users lose? "Nothing" or "polish" = remove. "They won't understand X" = keep.

Remove: decorative borders and shadows where whitespace works, icons duplicating adjacent labels, colour that encodes no meaning, helper text restating the obvious, headers over single paragraphs.
Keep: separation that creates semantic grouping, colour that encodes state, motion that shows causation.

Traps: "users expect it", "it looks empty" (whitespace is breathing room), "just a small addition", "competitors have it".

Process: build with everything, remove one element, check the goal still works, repeat until removal breaks comprehension.

## NCAI-specific notes

- **Sharp edges already enforced** (`--radius-*: 0`). Consistent with reduction; do not reintroduce rounding.
- **Motion** (GSAP, Framer Motion, curvilinear dividers) is allowed only where it shows causation or is a deliberate editorial moment. Decorative motion is the first thing to cut. Reduced-motion must keep working.
- **Colour**: charcoal / ivory carry structure. Ochre, umber, blue are accents for state or emphasis, not for hierarchy.
- **Art is the ornament.** Images carry the visual weight; surrounding UI should recede.
- **CMS-driven layouts** must stay on the grid whatever editors choose. New `heroLayout` / `galleryLayout` variants snap to the 12-col grid and the container.

## Review checklist (use on every UI PR)

1. Left edges: 3 or fewer distinct alignment points per view?
2. Spacing values all from the 8px scale?
3. Three hierarchy levels or fewer, with one primary action?
4. Five type sizes or fewer, one family, weights from the allowed set?
5. Grayscale and squint tests pass?
6. Any element removable without loss? Remove it.
7. Any exception to the grid? Is it one of the allowed breaks?
