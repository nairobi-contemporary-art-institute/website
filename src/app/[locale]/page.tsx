import { getTranslations } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, POSTS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link } from '@/i18n'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  // Fetch latest exhibition and news
  const [exhibitions, posts] = await Promise.all([
    client.fetch(EXHIBITIONS_QUERY),
    client.fetch(POSTS_QUERY)
  ])

  const latestExhibition = exhibitions[0]
  const latestPost = posts[0]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center p-8 bg-ivory overflow-hidden">
        <div className="z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter text-umber animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl tracking-wide leading-relaxed text-umber/90 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {t('description')}
          </p>
        </div>

        {/* Subtle Background Pattern/Element */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('/grid.svg')] bg-repeat" />
        </div>
      </section>

      <ResponsiveDivider variant="curved" weight="medium" className="text-umber/10" />

      {/* Featured Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Latest Exhibition */}
          {latestExhibition && (
            <div className="lg:col-span-7">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-800 mb-4 block">
                Latest Exhibition
              </span>
              <Link href={`/exhibitions/${latestExhibition.slug}`} className="group block">
                <div className="aspect-[4/3] relative overflow-hidden bg-charcoal/5 mb-6">
                  {latestExhibition.mainImage && (
                    <Image
                      src={urlFor(latestExhibition.mainImage).width(1200).height(900).url()}
                      alt={getLocalizedValue(latestExhibition.title, locale) || 'Exhibition image'}
                      fill
                      priority
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  )}
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-charcoal group-hover:text-amber-900 transition-colors mb-4">
                  {getLocalizedValue(latestExhibition.title, locale) || 'Untitled Exhibition'}
                </h2>
                <p className="text-lg text-umber/90 leading-relaxed mb-6 line-clamp-3">
                  {latestExhibition.description && latestExhibition.description[0]?.children?.[0]?.text}
                </p>
                <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-amber-800">
                  View Exhibition
                  <svg width="20" height="1" className="bg-amber-800">
                    <rect width="20" height="1" fill="currentColor" />
                  </svg>
                </div>
              </Link>
            </div>
          )}

          {/* Latest News / Channel */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-800 mb-8 block">
                From the Journal
              </span>
              {latestPost ? (
                <Link href={`/channel/${latestPost.slug}`} className="group flex flex-col gap-6">
                  <div className="aspect-[16/9] relative overflow-hidden bg-charcoal/5">
                    {latestPost.mainImage && (
                      <Image
                        src={urlFor(latestPost.mainImage).width(800).height(450).url()}
                        alt={getLocalizedValue(latestPost.title, locale) || 'Post image'}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal group-hover:text-amber-900 transition-colors mb-2">
                      {getLocalizedValue(latestPost.title, locale) || 'Untitled Post'}
                    </h3>
                    <p className="text-sm text-umber/90 line-clamp-2">
                      {latestPost.excerpt}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="p-8 border border-umber/10 text-center italic text-umber/40">
                  Visit the channel for latest updates.
                </div>
              )}
            </div>

            <div className="mt-auto p-12 bg-charcoal text-ivory flex flex-col gap-6 relative overflow-hidden group">
              <h3 className="text-3xl font-bold tracking-tight">Support NCAI</h3>
              <p className="text-ivory/60 text-sm leading-relaxed">
                Join us in our mission to preserve and grow contemporary art in East Africa.
              </p>
              <Link
                href="/support"
                className="w-fit px-8 py-3 bg-ivory text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-amber-50 transition-colors"
              >
                Learn More
              </Link>
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-800/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </div>

      <ResponsiveDivider variant="straight" weight="thin" className="text-umber/10" />
    </div>
  )
}
