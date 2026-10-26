# Texts are their own document type, separate from Channel posts

Written pieces (essays, interviews, conversations, artists' writings) live in a dedicated `textPiece` document ("Text") with a fixed reading template, instead of being Channel posts with `mediaType: 'text'`. Channel narrows to film and audio.

A Text needs things a post never had: a localized body, credited images that can run wide or full bleed, a type vocabulary, and links to exhibitions and other texts. Bolting these onto `post` would have left editors with one form full of fields that show and hide by media type. No post used `mediaType: 'text'`, so the split needed no migration.

The schema type is `textPiece` because `text` is a Sanity built-in type.

Considered Options: extend `post` with a text sub-type and serve `/texts` as a filtered view (one model, but a cluttered editor and an unlocalized body).
