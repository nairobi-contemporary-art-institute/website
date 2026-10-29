# Swiss design principles govern layout, hierarchy and type

NCAI's UI follows Swiss / International Typographic Style: an 8px base unit, a 12-column grid with a single shared container, three hierarchy levels, one typeface family, and reduction as the default response to "it looks plain". The full rules and review checklist live in `docs/DESIGN_PRINCIPLES.md`.

The site already had the aesthetic (Inter, sharp edges, restrained palette) but no written rule behind it, so layout drifted: sections picked their own max-width and padding, producing UI misalignments. Writing the grid down gives a fixable standard, "alignment points per view", instead of case-by-case taste.

NCAI deviates from the source skill in two places: it keeps Light alongside Regular and Bold (display use only), and it permits editorial motion where it shows causation or is a deliberate moment.

Considered Options: leave principles implicit in `globals.css` (misalignment keeps recurring, nothing to review against); adopt the third-party skill as a runtime dependency (adds an unvetted install and imposes its two-weight rule on a trilingual-script site).
