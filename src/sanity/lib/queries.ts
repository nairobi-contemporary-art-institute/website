import { groq } from 'next-sanity'

/**
 * Fetch all exhibitions with basic info for listing.
 */
export const EXHIBITIONS_QUERY = groq`
  *[_type == "exhibition"] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    "artistNames": artists[]->name
  }
`

/**
 * Fetch a single exhibition by slug with full details.
 */
export const EXHIBITION_BY_SLUG_QUERY = groq`
  *[_type == "exhibition" && slug.current == $slug][0] {
    ...,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    artists[]-> {
        _id,
        name,
        "slug": slug.current,
        image
    },
    curators[]-> {
        _id,
        name,
        "slug": slug.current,
        image,
        roles
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    }
  }
`

/**
 * Fetch all artists for the directory.
 */
export const ARTISTS_QUERY = groq`
  *[_type == "artist"] | order(name[0].value asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    tags[]-> {
        title,
        type
    }
  }
`

/**
 * Fetch a single artist by slug.
 */
export const ARTIST_BY_SLUG_QUERY = groq`
  *[_type == "artist" && slug.current == $slug][0] {
    ...,
    image {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    },
    works[]-> {
        _id,
        title,
        year,
        medium,
        dimensions,
        edition,
        image {
            asset-> {
                _id,
                metadata { lqip }
            }
        },
        tags[]-> {
            title,
            type
        }
    },
    "exhibitions": *[_type == "exhibition" && references(^._id)] | order(startDate desc) {
        _id,
        title,
        "slug": slug.current,
        startDate,
        endDate,
        mainImage
    }
  }
`

/**
 * Fetch all posts for the Channel.
 */
export const POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author-> {
        name,
        image,
        "slug": slug.current
    },
    tags[]-> {
        title,
        type,
        "slug": slug.current
    },
    excerpt,
    mediaType,
    duration,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    }
  }
`

/**
 * Fetch a single post by slug.
 */
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ...,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    "audioUrl": audioFile.asset->url,
    author-> {
        name,
        image,
        roles,
        "slug": slug.current
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    }
  }
`

/**
 * Fetch all programs for Education.
 */
export const PROGRAMS_QUERY = groq`
  *[_type == "program"] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    programType,
    audience,
    startDate,
    endDate,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    excerpt,
    tags[]-> {
        title,
        type
    }
  }
`

/**
 * Fetch a single program by slug.
 */
export const PROGRAM_BY_SLUG_QUERY = groq`
  *[_type == "program" && slug.current == $slug][0] {
    ...,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    educators[]-> {
        _id,
        name,
        "slug": slug.current,
        image,
        roles
    },
    resources[] {
      "url": asset->url,
      "size": asset->size,
      "name": asset->originalFilename
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    }
  }
`
/**
 * Fetch all searchable documents for sitemap.
 */
export const SITEMAP_QUERY = groq`
  *[_type in ["exhibition", "artist", "post", "program", "collectionItem"]] {
    "slug": slug.current,
    _type,
    _updatedAt
  }
`

/**
 * Fetch all collection items.
 */
export const COLLECTION_QUERY = groq`
  *[_type == "collectionItem"] | order(creationDate desc) {
    _id,
    title,
    "slug": slug.current,
    creationDate,
    medium,
    dimensions,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    "artistName": artist->name,
    tags[]-> {
        title,
        type
    }
  }
`

/**
 * Fetch a single collection item by slug.
 */
export const COLLECTION_ITEM_BY_SLUG_QUERY = groq`
  *[_type == "collectionItem" && slug.current == $slug][0] {
    ...,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    artist->{
        _id,
        name,
        "slug": slug.current
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    }
  }
`
/**
 * Fetch all timeline events.
 */
export const TIMELINE_QUERY = groq`
  *[_type == "timelineEvent"] | order(year asc) {
    _id,
    year,
    title,
    description,
    media {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    variant
  }
`

/**
 * Fetch all events.
 */
export const EVENTS_QUERY = groq`
  *[_type == "event"] | order(startDate asc) {
    _id,
    title,
    "slug": slug.current,
    eventType,
    startDate,
    endDate,
    location,
    registrationLink,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    tags[]-> {
        title,
        type
    }
  }
`

/**
 * Fetch a single event by slug.
 */
export const EVENT_BY_SLUG_QUERY = groq`
  *[_type == "event" && slug.current == $slug][0] {
    ...,
    mainImage {
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    relatedExhibitions[]->{
        _id,
        title,
        "slug": slug.current,
        mainImage
    },
    educators[]-> {
        _id,
        name,
        "slug": slug.current,
        image,
        roles
    },
    tags[]-> {
        _id,
        title,
        type,
        "slug": slug.current
    }
  }
`

/**
 * Fetch a single page by slug.
 */
export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    ...
  }
`
