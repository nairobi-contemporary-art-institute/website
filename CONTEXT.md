# NCAI Website

The digital presence of the Nairobi Contemporary Art Institute: exhibitions, artists, collection, channel, texts, events, education, and publications for an East African contemporary art audience.

## Language

**Exhibition**:
A time-bounded show with a title, a date range, and a venue.
_Avoid_: show, expo

**Artist**:
A maker of works. Identified by slug, never by display name: names are localized and can collide.
_Avoid_: creator, author

**Work**:
An individual artwork linked to its artist and optionally to exhibitions.
_Avoid_: piece, item

**Collection Item**:
The catalogue record that makes a work visible in the collection. Carries the linkable slug and the accessible image.
_Avoid_: work, holding

**Channel Post**:
An editorial media entry, in film or audio. Written pieces are Texts.
_Avoid_: article, video, blog

**Text**:
A periodically published written piece: an essay, interview, conversation, or artist's writing. Schema type `textPiece`.
_Avoid_: article, post, blog

**Speaker**:
A person taking part in an interview or conversation Text, listed once on the Text and chosen at the start of each turn. Shown by full name on their first turn, by initials after.
_Avoid_: participant (in UI copy), interviewee label

**Event**:
A scheduled occurrence with an event type.
_Avoid_: happening

**Publication**:
A printed or digital edition with cover art.
_Avoid_: book, paper

**Page container**:
The one outer column every section sits in. Sets where content starts on the left and the page padding. One width (max 1440px, centred) and one padding set (24px phone, 48px desktop) site-wide, shared by header, page sections and footer; sections do not choose their own.
_Avoid_: wrapper, layout width, `max-w-*` per section

**Measure**:
The width of a block of reading text, set by line length (45-75 characters), not by the page. Chosen from the named set in `globals.css` (`measure`, `measure-wide`, or full container width) and sits inside the Page container.
_Avoid_: container, max-width, column width

**Lede**:
The large introductory paragraph under a page title. Uses the `measure` width; today's `max-w-2xl` ledes should move to it.
_Avoid_: intro, subtitle, hero text
