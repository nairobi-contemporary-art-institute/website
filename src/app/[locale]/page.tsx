import { getTranslations } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, POSTS_QUERY, TIMELINE_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link } from '@/i18n'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { TimelineTeaser } from '@/components/home/TimelineTeaser'
import { HomeHero } from '@/components/home/HomeHero'
import { PortableText } from '@/components/ui/PortableText'

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
    sanityFetch<any>({ query: HOME_PAGE_QUERY, tags: ['homePage'] })
  ])

  const now = new Date()

  // 1. Priority: Admin override
  // 2. Priority: Current active exhibition
  // 3. Priority: Next upcoming exhibition
  // 4. Fallback: Most recent exhibition

  let latestExhibition = homeData?.featuredExhibition

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* New Redesigned Hero Section */}
      <HomeHero
        exhibition={latestExhibition}
        featuredCards={homeData?.featuredCards}
        locale={locale}
      />

      {/* Featured Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Latest Exhibition */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-800 block border-b border-amber-800/20 pb-4">
              Current Exhibition
            </span>

            {latestExhibition ? (
              <Link href={`/exhibitions/${latestExhibition.slug}`} className="group block">
                <div className="relative bg-charcoal/5 mb-6">
                  {(latestExhibition.homepageImage || latestExhibition.mainImage) && (
                    <Image
                      src={urlFor(latestExhibition.homepageImage || latestExhibition.mainImage).width(1200).url()}
                      alt={getLocalizedValue(latestExhibition.title, locale) || 'Exhibition image'}
                      width={1200}
                      height={900}
                      className="w-full h-auto block"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal group-hover:text-amber-900 transition-colors">
                    {getLocalizedValue(latestExhibition.title, locale) || 'Untitled Exhibition'}
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-amber-800 group-hover:translate-x-2 transition-transform">
                    View Exhibition
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                      <path d="M15 1L19 5L15 9M0 5H19" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 text-gray-400 italic">
                No current exhibitions found.
              </div>
            )}
          </div>

          {/* Latest News / Channel */}
          <div className="lg:col-span-5 flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-800 block border-b border-amber-800/20 pb-4">
                From the Journal
              </span>
              {latestPost ? (
                <Link href={`/channel/${latestPost.slug.current}`} className="group flex flex-col gap-6">
                  <div className="aspect-[16/9] relative overflow-hidden bg-charcoal/5">
                    {latestPost.mainImage && (
                      <Image
                        src={urlFor(latestPost.mainImage).width(800).height(450).url()}
                        alt={getLocalizedValue(latestPost.title, locale) || 'Post image'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-charcoal group-hover:text-amber-900 transition-colors">
                      {getLocalizedValue(latestPost.title, locale) || 'Untitled Post'}
                    </h3>
                    <div className="text-sm text-umber/80 line-clamp-2 leading-relaxed prose-sm">
                      {typeof getLocalizedValue(latestPost.excerpt, locale) === 'string' ? (
                        <p>{getLocalizedValue(latestPost.excerpt, locale) as unknown as string}</p>
                      ) : (
                        <PortableText value={getLocalizedValue(latestPost.excerpt, locale)} locale={locale} />
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-8 border border-umber/10 text-center italic text-umber/40">
                  Visit the channel for latest updates.
                </div>
              )}
            </div>

            <Link href="/support" className="mt-auto group relative overflow-hidden bg-charcoal text-ivory p-10 flex flex-col justify-between min-h-[300px]">
              <div className="relative z-10 flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Get Involved</span>
                <h3 className="text-3xl font-bold tracking-tight max-w-[80%]">Join us in preserving contemporary art in East Africa.</h3>
              </div>

              <div className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest mt-8 group-hover:underline decoration-emerald-400 underline-offset-4 transition-all">
                Support NCAI
                <div className="w-1.5 h-1.5 bg-emerald-400" />
              </div>

              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/40 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-900/20 blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </div>

      <ResponsiveDivider variant="straight" weight="thin" className="text-umber/10" />

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
