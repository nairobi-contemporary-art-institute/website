# Texts are their own document type, separate from Channel posts

Written pieces (essays, interviews, conversations, artists' writings) live in a dedicated `textPiece` document ("Text") with a fixed reading template, instead of being Channel posts with `mediaType: 'text'`. Channel narrows to film and audio.

A Text needs things a post never had: a localized body, credited images that can run wide or full bleed, a type vocabulary, and links to exhibitions and other texts. Bolting these onto `post` would have left editors with one form full of fields that show and hide by media type. No post used `mediaType: 'text'`, so the split needed no migration.

The schema type is `textPiece` because `text` is a Sanity built-in type.

Considered Options: extend `post` with a text sub-type and serve `/texts` as a filtered view (one model, but a cluttered editor and an unlocalized body).

## Amendment: Texts also surface on the Channel

The data model split stands: Texts remain `textPiece` documents with their own `/texts` index and `/texts/[slug]` reading template. Editorially they now also appear on the Channel as "Read", alongside Listen (audio) and Watch (film): the Channel mega menu has a Read column linking to each text type, and `/channel` merges texts into its feed (`CHANNEL_TEXTS_QUERY`) under a Read filter. Channel cards for texts link to `/texts/[slug]`, so there is one canonical page per text.
