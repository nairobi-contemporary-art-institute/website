# Single-document multi-locale content

All human-readable content lives in one document per entity with per-locale entries, rather than one document per locale. Editors update a single record; readers fall back to a default locale when their locale is empty.

Considered Options: per-locale documents (simpler queries, but N-way editorial duplication and painful cross-locale linking).
