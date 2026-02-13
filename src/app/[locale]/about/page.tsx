import { sanityFetch } from "@/sanity/lib/client"
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

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
    const data = await sanityFetch<any>({
        query: ABOUT_PAGE_QUERY,
        tags: ["aboutPage"],
    })

    if (!data) return null

    const title = getLocalizedValue(data.title, locale)
    const heroHeadline = getLocalizedValue(data.hero?.headline, locale)
    const heroIntro = getLocalizedValue(data.hero?.intro, locale)

    return (
        <div className="bg-ivory">
            {/* Hero Section */}
            <header className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-charcoal mb-8 uppercase">
                            {title}
                        </h1>
                        {heroHeadline && (
                            <p className="text-2xl md:text-3xl text-umber font-medium mb-6 leading-tight">
                                {heroHeadline}
                            </p>
                        )}
                        {heroIntro && (
                            <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl">
                                {heroIntro}
                            </p>
                        )}
                    </div>
                </div>
                {data.hero?.image && (
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block group">
                        <Image
                            src={urlFor(data.hero.image).width(800).url()}
                            alt=""
                            fill
                            className="object-cover"
                        />
                        {data.hero.image.caption && (
                            <div className="absolute bottom-4 left-4 pointer-events-auto">
                                <p className="text-[10px] text-charcoal/40 italic bg-ivory/20 px-2 py-1">
                                    {getLocalizedValue(data.hero.image.caption, locale)}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <div className="container mx-auto px-6 pb-20">
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20 mb-20" />

                {/* Main Content Sections */}
                <div className="space-y-32">
                    {data.sections?.map((section: any, idx: number) => {
                        const sectionTitle = getLocalizedValue(section.title, locale)
                        const sectionContent = getLocalizedValue(section.content, locale)
                        const isSplit = section.layout === 'split'

                        return (
                            <section key={idx} className={`grid gap-12 ${isSplit ? 'lg:grid-cols-2 lg:items-center' : 'max-w-3xl'}`}>
                                <div className="space-y-6">
                                    {sectionTitle && (
                                        <h2 className="text-3xl font-bold uppercase tracking-tight text-charcoal">
                                            {sectionTitle}
                                        </h2>
                                    )}
                                    {sectionContent && (
                                        <PortableText value={sectionContent} locale={locale} />
                                    )}
                                </div>
                                {isSplit && section.image && (
                                    <div className="space-y-4">
                                        <div className="relative aspect-[4/3] bg-charcoal/5 overflow-hidden">
                                            <Image
                                                src={urlFor(section.image).width(1200).url()}
                                                alt={sectionTitle || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {section.image.caption && (
                                            <p className="text-sm text-umber/60 italic border-l-2 border-umber/10 pl-4">
                                                {getLocalizedValue(section.image.caption, locale)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </section>
                        )
                    })}

                    {/* Library & Archive Section */}
                    {data.libraryArchive && (
                        <section className="bg-charcoal text-ivory -mx-6 px-6 py-20 lg:py-32">
                            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8 order-2 lg:order-1">
                                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">
                                        {getLocalizedValue(data.libraryArchive.title, locale)}
                                    </h2>
                                    <div className="prose prose-invert prose-lg max-w-none opacity-90">
                                        <PortableText value={getLocalizedValue(data.libraryArchive.content, locale)} locale={locale} />
                                    </div>
                                </div>
                                {data.libraryArchive.image && (
                                    <div className="space-y-4 order-1 lg:order-2">
                                        <div className="relative aspect-square lg:aspect-[4/5] bg-ivory/10 overflow-hidden">
                                            <Image
                                                src={urlFor(data.libraryArchive.image).width(1200).url()}
                                                alt="Library & Archive"
                                                fill
                                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>
                                        {data.libraryArchive.image.caption && (
                                            <p className="text-sm text-ivory/40 italic border-l-2 border-ivory/10 pl-4">
                                                {getLocalizedValue(data.libraryArchive.image.caption, locale)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}

