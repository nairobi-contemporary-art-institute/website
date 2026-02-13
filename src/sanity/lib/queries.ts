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
    listImage {
      caption,
      asset-> { _id, metadata { lqip } }
    },
    mainImage {
      caption,
      asset-> { _id, metadata { lqip } }
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
    homepageImage {
      caption,
      asset-> { _id, metadata { lqip } }
    },
    listImage {
      caption,
      asset-> { _id, metadata { lqip } }
    },
    mainImage {
      caption,
      asset-> { _id, metadata { lqip } }
    },
    gallery[] {
      caption,
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
    },
    partners[]-> {
        _id,
        name,
        logo {
          asset-> {
            _id,
            url,
            metadata { lqip }
          }
        },
        website
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
      caption,
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
            caption,
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
    museumExhibitions[] {
        ...,
        image {
            caption,
            asset-> {
                _id,
                metadata { lqip }
            }
        }
    },
    "exhibitions": *[_type == "exhibition" && references(^._id)] | order(startDate desc) {
        _id,
        title,
        "slug": slug.current,
        startDate,
        endDate,
        listImage {
            caption,
            asset-> { _id, metadata { lqip } }
        },
        mainImage {
            caption,
            asset-> { _id, metadata { lqip } }
        }
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
      caption,
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
      caption,
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    videoCaption,
    audioCaption,
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
      caption,
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
      caption,
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
    },
    partners[]-> {
        _id,
        name,
        logo {
          asset-> {
            _id,
            url,
            metadata { lqip }
          }
        },
        website
    },
    relatedExhibitions[]-> {
        _id,
        title,
        "slug": slug.current,
        mainImage {
            asset-> {
                _id,
                metadata { lqip }
            }
        }
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
      caption,
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
      caption,
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
      caption,
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
      caption,
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
      caption,
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
    },
    partners[]-> {
        _id,
        name,
        logo {
          asset-> {
            _id,
            url,
            metadata { lqip }
          }
        },
        website
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
/**
 * Fetch global site settings (navigation, footer, social, hours).
 */
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    ...,
    headerMenu[] {
      label,
      url
    },
    footerCategories[] {
      title,
      links[] {
        label,
        url
      }
    },
    socialLinks,
    hours,
    specialStatus,
    contactInfo
  }
`
/**
 * Fetch the about page content.
 */
export const ABOUT_PAGE_QUERY = groq`
  *[_type == "aboutPage"][0] {
    ...,
    hero {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    },
    sections[] {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    },
    libraryArchive {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    }
  }
`

/**
 * Fetch the get involved page content.
 */
export const GET_INVOLVED_PAGE_QUERY = groq`
  *[_type == "getInvolvedPage"][0] {
    ...,
    hero {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    },
    sections[] {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    }
  }
`

/**
 * Fetch the home page content.
 */
export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage"][0] {
    ...,
    hero {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    },
    featuredExhibition-> {
      _id,
      title,
      "slug": slug.current,
      startDate,
      endDate,
      homepageImage {
        caption,
        asset-> {
          _id,
          metadata { 
            lqip,
            dimensions { width, height, aspectRatio }
          }
        }
      },
      mainImage {
        caption,
        asset-> {
          _id,
          metadata { 
            lqip,
            dimensions { width, height, aspectRatio }
          }
        }
      }
    },
    featuredPost-> {
      _id,
      title,
      "slug": slug.current,
      mainImage {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      },
      excerpt
    },
    featuredCards[] {
      title,
      subtitle,
      image {
        asset-> {
          _id,
          url,
          metadata { 
            lqip,
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      link {
        reference-> {
          _type,
          _id,
          "slug": slug.current,
          title,
          name
        },
        externalUrl
      }
    }
  }
`

/**
 * Fetch the visit page content.
 */
export const VISIT_PAGE_QUERY = groq`
  *[_type == "visitPage"][0] {
    ...,
    label,
    announcement,
    heroImage {
      caption,
      asset-> {
        _id,
        metadata { lqip }
      }
    },
    directions[] {
      ...,
      description
    },
    visitorCards[] {
      ...,
    },
    sections[] {
      ...,
      image {
        caption,
        asset-> {
          _id,
          metadata { lqip }
        }
      }
    }
  }
`

/**
 * Fetch the publications page content.
 */
export const PUBLICATIONS_PAGE_QUERY = groq`
  *[_type == "publicationsPage"][0] {
    ...,
    header {
      label,
      headline,
      description
    },
    featuredPublications[]-> {
      _id,
      title,
      author,
      description,
      details,
      "color": color.hex,
      textColor,
      textured,
      showTitle,
      showBranding,
      variant,
      coverImage {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      },
      price,
      buyLink
    },
    ctaSection {
      label,
      headline,
      description,
      ctaLabel,
      ctaUrl
    }
  }
`
/**
 * Fetch the education page content.
 */
export const EDUCATION_PAGE_QUERY = groq`
  *[_type == "educationPage"][0] {
    ...,
    header {
      headline,
      description
    },
    pillars[] {
      title,
      description,
      image {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      },
      audienceTag
    },
    featuredPrograms[]-> {
      _id,
      title,
      "slug": slug.current,
      programType,
      audience,
      startDate,
      mainImage {
        asset-> {
          _id,
          metadata { lqip }
        }
      },
      excerpt
    }
  }
`

/**
 * Fetch the events page content.
 */
export const EVENTS_PAGE_QUERY = groq`
  *[_type == "eventsPage"][0] {
    ...,
    header {
      headline,
      description
    },
    featuredEvents[]-> {
      _id,
      title,
      "slug": slug.current,
      eventType,
      startDate,
      mainImage {
        asset-> {
          _id,
          metadata { lqip }
        }
      },
      location,
      excerpt
    }
  }
`

/**
 * Fetch the accessibility page content.
 */
export const ACCESSIBILITY_PAGE_QUERY = groq`
  *[_type == "accessibilityPage"][0] {
    ...,
    header {
      headline,
      description
    },
    sections[] {
      title,
      content,
      image {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      }
    },
    venueGuide {
      title,
      description,
      "guideUrl": guideFile.asset->url,
      mapImage {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      }
    },
    policies[] {
      policyName,
      description
    }
  }
`

/**
 * Fetch the collection page content.
 */
export const COLLECTION_PAGE_QUERY = groq`
  *[_type == "collectionPage"][0] {
    ...,
    header {
      headline,
      description
    },
    featuredItems[]-> {
        _id,
        title,
        "slug": slug.current,
        creationDate,
        "artistName": artist->name,
        mainImage {
            asset-> {
                _id,
                metadata { lqip }
            }
        },
        tags[]-> {
            _id,
            title
        }
    }
  }
`

/**
 * Fetch the exhibitions page content.
 */
export const EXHIBITIONS_PAGE_QUERY = groq`
  *[_type == "exhibitionsPage"][0] {
    ...,
    header {
      headline,
      description
    }
  }
`

/**
 * Fetch the artists page content.
 */
export const ARTISTS_PAGE_QUERY = groq`
  *[_type == "artistsPage"][0] {
    ...,
    header {
      headline,
      description
    }
  }
`

/**
 * Fetch the support page content.
 */
export const SUPPORT_PAGE_QUERY = groq`
  *[_type == "supportPage"][0] {
    ...,
    header {
      ...,
      image {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      }
    },
    tiers[] {
      ...,
      description
    },
    sections[] {
      ...,
      image {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      }
    }
  }
`
