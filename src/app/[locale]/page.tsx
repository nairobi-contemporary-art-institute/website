import { getTranslations } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, POSTS_QUERY, TIMELINE_QUERY, HOME_PAGE_QUERY, FEATURED_COLLECTION_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link } from '@/i18n'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { TimelineTeaser } from '@/components/home/TimelineTeaser'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeHeroNew } from '@/components/home/HomeHeroNew'
import { PortableText } from '@/components/ui/PortableText'
import { MuseumGrid } from '@/components/ui/MuseumGrid'
import { MuseumCardData } from '@/lib/types/museum-card'
import { CollectionTeaser } from '@/components/home/CollectionTeaser'
import { AnnouncementBanner } from '@/components/home/AnnouncementBanner'
import { COLLECTION_QUERY } from '@/sanity/lib/queries'

// Define interfaces for fetched data
interface Exhibition {
  _id: string;
  slug: string;
  title: any;
  mainImage: any;
  description: any;
  startDate: string;
  endDate: string;
}

interface Post {
  slug: { current: string };
  title: any;
  mainImage: any;
  excerpt: string;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  // Fetch latest exhibition, news, and timeline teaser using sanityFetch for better cache control
  const [exhibitions, posts, timelineEvents, homeData] = await Promise.all([
    sanityFetch<Exhibition[]>({ query: EXHIBITIONS_QUERY, tags: ['exhibition'] }),
    sanityFetch<Post[]>({ query: POSTS_QUERY, tags: ['post'] }),
    sanityFetch<any[]>({ query: TIMELINE_QUERY, tags: ['timeline'] }),
    sanityFetch<any>({ query: HOME_PAGE_QUERY, tags: ['homePage'] }),
    sanityFetch<any[]>({ query: COLLECTION_QUERY, tags: ['collectionItem'] })
  ])

  // Process collection items for the teaser
  let teaserItems = homeData?.collectionTeaser?.featuredItems || []
  if (teaserItems.length === 0 && homeData?.collectionTeaser?.enabled !== false) {
    // Fallback to items with featuredOnHome toggle enabled
     teaserItems = (await sanityFetch<any[]>({ 
      query: FEATURED_COLLECTION_QUERY, 
      tags: ['collectionItem', 'work'] 
    }))

    // If still empty, fallback to latest collection items
    if (teaserItems.length === 0) {
      teaserItems = (await sanityFetch<any[]>({ 
        query: COLLECTION_QUERY, 
        tags: ['collectionItem', 'work'] 
      })).slice(0, 40)
    }
  }

  const now = new Date()

  // 1. Priority: Admin override
  // 2. Priority: Current active exhibition
  // 3. Priority: Next upcoming exhibition
  // 4. Fallback: Most recent exhibition

  let latestExhibition = homeData?.featuredExhibition
  const exhT = await getTranslations({ locale, namespace: 'Pages.exhibitions' })

  if (!latestExhibition && exhibitions && exhibitions.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTime = today.getTime()

    // 1. Find a currently running exhibition
    latestExhibition = exhibitions.find((exh: any) => {
      const start = new Date(exh.startDate)
      start.setHours(0, 0, 0, 0)
      const startTime = start.getTime()

      const end = exh.endDate ? new Date(exh.endDate) : null
      if (end) end.setHours(23, 59, 59, 999)
      const endTime = end ? end.getTime() : Infinity

      return startTime <= todayTime && todayTime <= endTime
    })

    // 2. If no current, find the nearest upcoming one
    if (!latestExhibition) {
      const upcoming = exhibitions
        .filter((exh: any) => {
          const start = new Date(exh.startDate)
          start.setHours(0, 0, 0, 0)
          return start.getTime() > todayTime
        })
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

      latestExhibition = upcoming[0]
    }

    // 3. Last fallback: the most recent exhibition (already first in list due to query order)
    if (!latestExhibition) {
      latestExhibition = exhibitions[0]
    }
  }

  const latestPost = homeData?.featuredPost || posts?.[0] as Post | undefined

  // Map exhibitions and posts into the unified MuseumCardData interface
  const gridItems: MuseumCardData[] = [
    ...(exhibitions || []).map((exh: any): MuseumCardData => ({
      id: exh._id || exh.slug,
      href: `/exhibitions/${exh.slug}`,
      label: exhT('title'),
      title: getLocalizedValue(exh.title, locale) || 'Untitled',
      date: exh.startDate ? new Date(exh.startDate).getFullYear().toString() : '',
      image: exh.listImage || exh.homepageImage || exh.mainImage,
      tags: ['Exhibitions'],
      backgroundColor: '#2a3b4c'
    })),
    ...(posts || []).map((post: any): MuseumCardData => ({
      id: post._id || (post.slug?.current),
      href: `/channel/${typeof post.slug === 'string' ? post.slug : post.slug?.current}`,
      label: 'JOURNAL',
      title: getLocalizedValue(post.title, locale) || 'Untitled Post',
      date: post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : '',
      image: post.mainImage,
      tags: ['News', 'Journal'],
      backgroundColor: '#a05a2c'
    }))
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section — new configurable hero or legacy fallback */}
      {homeData?.hero?.enabled && homeData?.hero?.slides?.length > 0 ? (
        <HomeHeroNew heroData={homeData.hero} locale={locale} />
      ) : (
        <HomeHero
          exhibition={latestExhibition}
          featuredCards={homeData?.featuredCards}
          locale={locale}
        />
      )}

      {/* Announcement Banner */}
      {homeData?.announcement?.enabled && (
        <AnnouncementBanner
          data={homeData.announcement}
          locale={locale}
        />
      )}

      {/* Masonry Museum Grid */}
      <MuseumGrid items={gridItems} filterPrefix={t('exploreCollection')} />

      {/* Collection Teaser Section */}
      {homeData?.collectionTeaser?.enabled !== false && (
        <CollectionTeaser 
          data={{
            ...homeData.collectionTeaser,
            featuredItems: teaserItems,
            exploreCollectionLabel: t('exploreCollection'),
            viewFullCollectionLabel: t('viewFullCollection')
          }}
          locale={locale}
        />
      )}

      {/* Timeline Teaser Section */}
      {(homeData?.timelineTeaser?.show !== false) && (
        <TimelineTeaser
          events={timelineEvents}
          locale={locale}
          headline={getLocalizedValue(homeData?.timelineTeaser?.headline, locale)}
        />
      )}
    </div>
  )
}
