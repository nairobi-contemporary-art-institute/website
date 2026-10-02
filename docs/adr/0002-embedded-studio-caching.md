# Embedded Studio with tag-based revalidation

The content studio runs inside the public web app with shared data-fetching wrapped in tag-based revalidation on an hourly default. One deploy serves editors and visitors, and stale content self-heals within the tag window.

Considered Options: separate studio deploy with uncached reads (fresher content, but two deploys to maintain and higher read load).
