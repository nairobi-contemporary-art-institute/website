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
    heroLayout,
    backgroundThemeColor,
    heroTextArt,
    admission,
    bookingUrl,
    showInternalNavigation,
    artistListLayout,
    enquiryModule,
    "pressKitUrl": pressKit.asset->url,
    "exhibitionGuideUrl": exhibitionGuide.asset->url,
    manualRelatedContent[]-> {
        _id,
        _type,
        "title": coalesce(title, name),
        "slug": slug.current,
        mainImage {
            asset-> { _id, metadata { lqip } }
        },
        image {
            asset-> { _id, metadata { lqip } }
        },
        startDate,
        endDate,
        "artistNames": artists[]->name[@._key == $locale][0].value
    },
    extraSections[] {
        _type,
        _key,
        title,
        layoutType,
        content,
        author,
        images[] {
            caption,
            asset-> {
                _id,
                metadata { lqip }
            }
        }
    },
    mediaModule {
        mediaType,
        title,
        label,
        url,
        image {
            asset-> { _id, metadata { lqip } }
        },
        backgroundColor
    },
    listImage {
      caption,
      asset-> { _id, metadata { lqip } }
    },
    galleryLayout,
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
        image {
            ...,
            asset-> { _id, metadata { lqip } },
            imageCredit-> { name, "slug": slug.current, hasProfile }
        },
        bio,
        "portraitPost": *[_type == "post" && references(^._id) && (title[@._key == $locale].value match "*Portrait*" || slug.current match "*portrait*")][0] {
            _id,
            _type,
            title,
            "slug": slug.current,
            publishedAt,
            mediaType,
            duration,
            excerpt,
            mainImage {
                asset-> { _id, metadata { lqip } }
            },
            tags[]-> { _id, title }
        }
    },
    curators[]-> {
        _id,
        _type,
        name,
        "slug": slug.current,
        hasProfile,
        image {
            ...,
            asset-> { _id, metadata { lqip } },
            imageCredit-> { name, "slug": slug.current, hasProfile }
        },
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
    },
    "relatedPosts": *[_type == "post" && (references(^._id) || references(^.artists[]._ref) || count(tags[@._ref in ^.tags[]._ref]) > 0)] | order(publishedAt desc)[0...4] {
        _id,
        _type,
        title,
        "slug": slug.current,
        publishedAt,
        mediaType,
        excerpt,
        mainImage {
            asset-> { _id, metadata { lqip } }
        }
    }
  }
`

/**
 * Fetch all artists for the directory.
 */
export const ARTISTS_INDEX_QUERY = groq`
  *[_type == "artist"] | order(name[0].value asc) {
    _id,
    name,
    "slug": slug.current,
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
  }
`
/**
 * Fetch a single artist by slug.
 */
export const ARTIST_BY_SLUG_QUERY = groq`*[_type == "artist" && slug.current == $slug][0] {
    ...,
    longBio,
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
    "works": *[_type == "work" && references(^._id) && showOnArtistProfile != false] | order(year desc) {
        _id,
        title,
        year,
        medium,
        dimensions,
        edition,
        mediaType,
        videoUrl,
        videoCaption,
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
    featuredExhibitions[]-> {
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
    },
    "artistPosts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
        _id,
        _type,
        title,
        "slug": slug.current,
        publishedAt,
        mediaType,
        excerpt,
        mainImage {
            asset-> { _id, metadata { lqip } }
        }
    },
    "relatedArtists": *[_type == "artist" && _id != ^._id && count(tags[@._ref in ^.tags[]._ref]) > 0][0...8] {
        _id,
        name,
        "slug": slug.current,
        image {
            asset-> { _id, metadata { lqip } }
        },
        tags[]-> { title }
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
    authors[]-> {
        name,
        image,
        "slug": slug.current
    },
    tags[]-> {
        _id,
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
    videoUrl,
    videoCaption,
    audioCaption,
    "audioUrl": audioFile.asset->url,
    authors[]-> {
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
    },
    relatedArtist-> {
        _id,
        name,
        "slug": slug.current,
        bio,
        image {
            asset-> { _id, metadata { lqip } }
        },
        works[0...4]-> {
            _id,
            title,
            year,
            medium,
            image {
                asset-> { _id, metadata { lqip } }
            }
        },
        featuredExhibitions[0...3]-> {
            _id,
            title,
            "slug": slug.current,
            listImage {
                asset-> { _id, metadata { lqip } }
            }
        }
    }
  }
`

/**
 * Fetch other artist portraits excluding the current one.
 */
export const RELATED_ARTIST_PORTRAITS_QUERY = groq`
  *[_type == "post" && slug.current match "artist-portrait-*" && slug.current != $slug] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mediaType,
    duration,
    mainImage {
      asset-> { _id, metadata { lqip } }
    },
    tags[]-> { _id, title }
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
  *[(_type == "collectionItem" || _type == "work") && showInCollection != false] | order(coalesce(creationDate, year) desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "creationDate": coalesce(creationDate, year),
    medium,
    dimensions,
    "mainImage": coalesce(mainImage, image) {
      asset-> { _id, metadata { lqip, dimensions { width, height, aspectRatio } } }
    },
    "artistName": artist->name,
    artist-> {
        name,
        "slug": slug.current
    },
    tags[]-> {
        title,
        type
    },
    onLoan,
    onDisplay,
    displayLocation
  }
`

/**
 * Fetch featured collection items for the homepage.
 */
export const FEATURED_COLLECTION_QUERY = groq`
  *[(_type == "collectionItem" || _type == "work") && featuredOnHome == true] | order(coalesce(creationDate, year) desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "creationDate": coalesce(creationDate, year),
    medium,
    dimensions,
    "mainImage": coalesce(mainImage, image) {
      asset-> { _id, metadata { lqip, dimensions { width, height, aspectRatio } } }
    },
    "artistName": artist->name,
    artist-> {
        name,
        "slug": slug.current
    },
    onLoan,
    onDisplay,
    displayLocation
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
    "year": string(year),
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
  *[_id == "siteSettings"][0] {
    ...,
    newsletterPopup,
    "headerStyle": coalesce(headerStyle, "ncai"),
    "headerFeaturedImages": headerFeaturedImages[]{
      asset->,
      hotspot,
      crop,
      caption,
      link
    },
    utilityNav[] {
      label,
      "url": coalesce(
        internalLink->{
          "url": select(
            _type == "exhibition" => "/exhibitions/" + slug.current,
            _type == "post" => "/channel/" + slug.current,
            _type == "artist" => "/artists/" + slug.current,
            _type == "event" => "/events/" + slug.current,
            _type == "program" => "/programs/" + slug.current,
            _type == "publication" => "/publications/" + slug.current,
            _type == "page" => "/" + slug.current,
            _type == "aboutPage" => "/about",
            _type == "visitPage" => "/visit",
            _type == "getInvolvedPage" => "/get-involved",
            _type == "homePage" => "/",
            _type == "publicationsPage" => "/publications",
            _type == "educationPage" => "/education",
            _type == "artistsPage" => "/artists",
            _type == "exhibitionsPage" => "/exhibitions",
            _type == "eventsPage" => "/events",
            _type == "collectionPage" => "/collection",
            "/" + slug.current
          )
        }.url,
        url
      )
    },
    headerMenu[] {
      label,
      "url": coalesce(
        internalLink->{
          "url": select(
            _type == "exhibition" => "/exhibitions/" + slug.current,
            _type == "post" => "/channel/" + slug.current,
            _type == "artist" => "/artists/" + slug.current,
            _type == "event" => "/events/" + slug.current,
            _type == "program" => "/programs/" + slug.current,
            _type == "publication" => "/publications/" + slug.current,
            _type == "page" => "/" + slug.current,
            _type == "aboutPage" => "/about",
            _type == "visitPage" => "/visit",
            _type == "getInvolvedPage" => "/get-involved",
            _type == "homePage" => "/",
            _type == "publicationsPage" => "/publications",
            _type == "educationPage" => "/education",
            _type == "artistsPage" => "/artists",
            _type == "exhibitionsPage" => "/exhibitions",
            _type == "eventsPage" => "/events",
            _type == "collectionPage" => "/collection",
            "/" + slug.current
          )
        }.url,
        url
      ),
      columns[] {
        title,
        links[] {
          label,
          "url": coalesce(
            internalLink->{
              "url": select(
                _type == "exhibition" => "/exhibitions/" + slug.current,
                _type == "post" => "/channel/" + slug.current,
                _type == "artist" => "/artists/" + slug.current,
                _type == "event" => "/events/" + slug.current,
                _type == "program" => "/programs/" + slug.current,
                _type == "publication" => "/publications/" + slug.current,
                _type == "page" => "/" + slug.current,
                _type == "aboutPage" => "/about",
                _type == "visitPage" => "/visit",
                _type == "getInvolvedPage" => "/get-involved",
                _type == "homePage" => "/",
                _type == "publicationsPage" => "/publications",
                _type == "educationPage" => "/education",
                _type == "artistsPage" => "/artists",
                _type == "exhibitionsPage" => "/exhibitions",
                _type == "eventsPage" => "/events",
                _type == "collectionPage" => "/collection",
                "/" + slug.current
              )
            }.url,
            url
          )
        }
      }
    },
    footerCategories[] {
      title,
      links[] {
        label,
        "url": coalesce(
          internalLink->{
            "url": select(
              _type == "exhibition" => "/exhibitions/" + slug.current,
              _type == "post" => "/channel/" + slug.current,
              _type == "artist" => "/artists/" + slug.current,
              _type == "event" => "/events/" + slug.current,
              _type == "program" => "/programs/" + slug.current,
              _type == "publication" => "/publications/" + slug.current,
              _type == "page" => "/" + slug.current,
              _type == "aboutPage" => "/about",
              _type == "visitPage" => "/visit",
              _type == "getInvolvedPage" => "/get-involved",
              _type == "homePage" => "/",
              _type == "publicationsPage" => "/publications",
              _type == "educationPage" => "/education",
              _type == "artistsPage" => "/artists",
              _type == "exhibitionsPage" => "/exhibitions",
              _type == "eventsPage" => "/events",
              _type == "collectionPage" => "/collection",
              "/" + slug.current
            )
          }.url,
          url
        )
      }
    },
    socialLinks,
    hours,
    specialStatus,
    contactInfo,
    entranceAnimationPool[] { 
      alt,
      caption,
      asset-> { _id, url } 
    }
  }
`
/**
 * Fetch the about page content.
 */
export const ABOUT_PAGE_QUERY = groq`
  *[_id == "aboutPage"][0] {
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
    membershipTiers[] {
      ...,
      description
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
    contactSection
  }
`

/**
 * Fetch the home page content.
 */
export const HOME_PAGE_QUERY = groq`
  *[_id == "homePage"][0] {
    ...,
    hero {
      enabled,
      mode,
      autoAdvanceSeconds,
      slides[] {
        image {
          caption,
          hotspot,
          asset-> {
            _id,
            metadata {
              lqip,
              dimensions { width, height, aspectRatio }
            }
          }
        },
        imageSize {
          widthPercent
        },
        gradientColor,
        gradientOpacity,
        preHeading,
        title,
        subtitle,
        description,
        date {
          startDate,
          endDate
        },
        location,
        layout,
        contentPosition,
        contentWidth,
        imageAlignment,
        intelligentContrast,
        forceBlackText,
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
    },
    announcement {
      enabled,
      preHeading,
      heading,
      briefText,
      ctaLabel,
      ctaUrl,
      logo {
        asset-> { _id, url, metadata { lqip, dimensions { width, height } } }
      },
      backgroundImage {
        asset-> { _id, url, metadata { lqip, dimensions { width, height } } },
        hotspot
      },
      exploreMore {
        title,
        cards[] {
          title,
          description,
          buttonText,
          url,
          style,
          state
        },
        secondaryCta {
          text,
          url
        }
      },
      pressRelease,
      accordionLabel
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
    },
    collectionTeaser {
      enabled,
      headline,
      descriptionRich,
      featuredItems[]-> {
        _id,
        title,
        "slug": slug.current,
        creationDate,
        mainImage {
          asset-> {
            _id,
            metadata {
              lqip,
              dimensions { width, height, aspectRatio }
            }
          }
        },
        artist-> {
          name
        }
      },
      "featuredWorks": *[_type == "work" && featuredOnHome == true] {
        _id,
        title,
        year,
        medium,
        onLoan,
        onDisplay,
        displayLocation,
        image {
          asset-> {
            _id,
            metadata {
              lqip,
              dimensions { width, height, aspectRatio }
            }
          }
        },
        artist-> {
          name,
          "slug": slug.current
        }
      }
    }
  }
`

/**
 * Fetch the visit page content.
 */
export const VISIT_PAGE_QUERY = groq`
  *[_id == "visitPage"][0] {
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
export const RESOURCES_QUERY = groq`
  *[_type == "resource"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    type,
    audience,
    ageRange,
    "fileUrl": file.asset->url,
    "fileSize": file.asset->size,
    coverImage {
      asset-> {
        _id,
        url,
        metadata { lqip }
      }
    },
    audience,
    exhibition-> {
      title
    },
    exhibitionFallback,
    featured
  }
`

export const EDUCATION_PAGE_QUERY = groq`
  *[_id == "educationPage"][0] {
    ...,
    header {
      headline,
      descriptionRich,
      image {
        asset-> {
          _id,
          url,
          metadata { lqip }
        }
      }
    },
    sections[] {
        title,
        content
    },
    pillars[] {
      title,
      description,
      linkUrl,
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
    },
    noticeBar {
      enabled,
      autoMondayClosing,
      customStatus {
        label,
        linkText,
        linkUrl
      }
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
        _type,
        title,
        "slug": slug.current,
        "creationDate": coalesce(creationDate, year),
        medium,
        "artistName": artist->name,
        artist-> {
            name,
            "slug": slug.current
        },
        "mainImage": coalesce(mainImage, image),
        tags[]-> {
            _id,
            title
        },
        onLoan,
        onDisplay,
        displayLocation
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
 * Fetch the team/personnel content.
 */
export const TEAM_QUERY = groq`
  *[_type == "person" && hasProfile != false] | order(name[0].value asc) {
    _id,
    name,
    "slug": slug.current,
    roles,
    category,
    image {
      asset-> { _id, metadata { lqip } },
      imageCredit-> { name, "slug": slug.current }
    },
    bio
  }
`
