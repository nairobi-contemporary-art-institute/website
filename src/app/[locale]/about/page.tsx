import { sanityFetch } from "@/sanity/lib/client"
import { ABOUT_PAGE_QUERY, TIMELINE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"
import { HistoryTimeline } from "@/components/about/HistoryTimeline"
import { HeroIMMA } from "@/components/ui/HeroIMMA"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: ABOUT_PAGE_QUERY,
        tags: ["aboutPage"],
    })

    if (!data) return { title: 'About' }

    return {
        title: getLocalizedValue(data.title, locale),
        description: getLocalizedValue(data.hero?.headline, locale)
    }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params

    const [data, timelineEvents, settings] = await Promise.all([
        sanityFetch<any>({
            query: ABOUT_PAGE_QUERY,
            tags: ["aboutPage"],
        }),
        sanityFetch<any[]>({
            query: TIMELINE_QUERY,
            tags: ["timelineEvent"],
        }),
        sanityFetch<any>({
            query: SITE_SETTINGS_QUERY,
            tags: ["siteSettings"],
        })
    ])

    if (!data) return null

    const title = getLocalizedValue(data.title, locale)
    const heroHeadline = getLocalizedValue(data.hero?.headline, locale)
    const heroIntro = getLocalizedValue(data.hero?.intro, locale)
    
    // Check global style preference
    const headerStyle = settings?.headerStyle || 'ncai'

    return (
        <GridSystem unstable_useContainer className="bg-ivory min-h-screen">
            {/* Hero Section */}
            {headerStyle === 'ncai' ? (
                <HeroIMMA
                    title={title}
                    image={data.hero?.image}
                    headline={heroHeadline}
                    intro={heroIntro}
                    caption={data.hero?.image?.caption ? getLocalizedValue(data.hero.image.caption, locale) : undefined}
                />
            ) : (
                <header className="relative pt-32 pb-20 overflow-hidden border-b border-charcoal/5">
                    <Grid columns={{ sm: 1, md: 12 }} gap={24}>
                        <GridCell column={{ sm: 1, md: 8 }} className="items-start justify-start p-0">
                            <div className="max-w-4xl space-y-8">
                                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9]">
                                    {title}
                                </h1>
                                {heroHeadline && (
                                    <p className="text-2xl md:text-4xl text-umber font-medium leading-tight tracking-tight">
                                        {heroHeadline}
                                    </p>
                                )}
                                {heroIntro && (
                                    <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl leading-relaxed">
                                        {heroIntro}
                                    </p>
                                )}
                            </div>
                        </GridCell>

                        {data.hero?.image && (
                            <GridCell column={{ sm: 1, md: 4 }} className="hidden md:flex p-0 relative min-h-[400px]">
                                <Image
                                    src={urlFor(data.hero.image).width(800).url()}
                                    alt=""
                                    fill
                                    className="object-cover opacity-20 grayscale brightness-50"
                                />
                                {data.hero.image.caption && (
                                    <div className="absolute bottom-4 right-4">
                                        <p className="text-[10px] text-charcoal/40 italic bg-ivory/20 px-2 py-1">
                                            {getLocalizedValue(data.hero.image.caption, locale)}
                                        </p>
                                    </div>
                                )}
                            </GridCell>
                        )}
                    </Grid>
                </header>
            )}

            <div className="py-20 space-y-40">
                {/* Modular Sections */}
                {data.sections?.map((section: any, idx: number) => {
                    const sectionTitle = getLocalizedValue(section.title, locale)
                    const sectionContent = getLocalizedValue(section.content, locale)
                    const layout = section.layout || 'standard'
                    const isSplit = layout === 'split'
                    const isDark = layout === 'dark-highlight'
                    const isTimeline = layout === 'history-timeline' || sectionTitle === 'Our History'

                    if (isTimeline) {
                        return (
                            <section key={idx} className="px-section-clamp space-y-16">
                                <Grid columns={{ sm: 1, md: 12 }}>
                                    <GridCell column={{ sm: 1, md: 8 }}>
                                        <div className="space-y-6">
                                            {sectionTitle && (
                                                <h2 className="text-4xl md:text-6xl font-black capitalize tracking-tighter leading-none text-charcoal">
                                                    {sectionTitle}
                                                </h2>
                                            )}
                                            {sectionContent && (
                                                <div className="prose prose-lg max-w-2xl text-charcoal/70">
                                                    <PortableText value={sectionContent} locale={locale} />
                                                </div>
                                            )}
                                        </div>
                                    </GridCell>
                                </Grid>

                                <HistoryTimeline events={timelineEvents} locale={locale} />
                            </section>
                        )
                    }

                    if (isDark) {
                        return (
                            <section key={idx} className="px-section-clamp bg-charcoal text-ivory -mx-section-clamp px-section-clamp py-32 rounded-sm shadow-2xl overflow-hidden relative group">
                                {/* Abstract background element */}
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-ochre/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

                                <Grid columns={{ sm: 1, md: 12 }} gap={48} className="items-center relative z-10">
                                    <GridCell column={{ sm: 1, md: 6 }} className="order-2 md:order-1 items-start justify-start p-0">
                                        <div className="space-y-8">
                                            {sectionTitle && (
                                                <h2 className="text-4xl md:text-6xl font-bold capitalize tracking-tighter leading-none">
                                                    {sectionTitle}
                                                </h2>
                                            )}
                                            {sectionContent && (
                                                <div className="prose prose-invert prose-lg max-w-none opacity-80">
                                                    <PortableText value={sectionContent} locale={locale} />
                                                </div>
                                            )}
                                        </div>
                                    </GridCell>

                                    {section.image && (
                                        <GridCell column={{ sm: 1, md: 6 }} className="order-1 md:order-2 p-0">
                                            <div className="relative aspect-square md:aspect-[4/5] w-full bg-ivory/5 overflow-hidden shadow-2xl">
                                                <Image
                                                    src={urlFor(section.image).width(1200).url()}
                                                    alt={sectionTitle || ''}
                                                    fill
                                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                                                />
                                                {section.image.caption && (
                                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                                        <p className="text-[10px] text-charcoal font-bold capitalize tracking-widest bg-ivory/80 backdrop-blur-sm px-3 py-1 inline-block">
                                                            {getLocalizedValue(section.image.caption, locale)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </GridCell>
                                    )}
                                </Grid>
                            </section>
                        )
                    }

                    return (
                        <section key={idx}>
                            <Grid columns={{ sm: 1, md: 12 }} gap={48} className="items-center">
                                <GridCell column={{ sm: 1, md: isSplit ? 6 : 8 }} className="items-start justify-start p-0">
                                    <div className="space-y-8">
                                        {sectionTitle && (
                                            <h2 className="text-4xl md:text-5xl font-bold capitalize tracking-tighter text-charcoal leading-none">
                                                {sectionTitle}
                                            </h2>
                                        )}
                                        {sectionContent && (
                                            <div className="prose prose-lg max-w-none text-charcoal/80">
                                                <PortableText value={sectionContent} locale={locale} />
                                            </div>
                                        )}
                                    </div>
                                </GridCell>

                                {isSplit && section.image && (
                                    <GridCell column={{ sm: 1, md: 6 }} className="p-0">
                                        <div className="relative aspect-[4/3] w-full bg-charcoal/5 overflow-hidden group">
                                            <Image
                                                src={urlFor(section.image).width(1200).url()}
                                                alt={sectionTitle || ''}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                            {section.image.caption && (
                                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                                    <p className="text-[10px] text-ivory font-bold capitalize tracking-widest bg-charcoal/60 backdrop-blur-sm px-3 py-1 inline-block">
                                                        {getLocalizedValue(section.image.caption, locale)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </GridCell>
                                )}
                            </Grid>
                        </section>
                    )
                })}

                <div className="mt-20">
                    <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
                </div>
            </div>
        </GridSystem>
    )
}
