import { sanityFetch } from "@/sanity/lib/client"
import { GET_INVOLVED_PAGE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: GET_INVOLVED_PAGE_QUERY,
        tags: ["getInvolvedPage"],
    })

    if (!data) return { title: 'Get Involved' }

    return {
        title: getLocalizedValue(data.title, locale),
        description: getLocalizedValue(data.hero?.headline, locale)
    }
}

export default async function GetInvolvedPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: GET_INVOLVED_PAGE_QUERY,
        tags: ["getInvolvedPage"],
    })

    if (!data) return null

    const title = getLocalizedValue(data.title, locale)
    const heroHeadline = getLocalizedValue(data.hero?.headline, locale)
    const heroIntro = getLocalizedValue(data.hero?.intro, locale)

    return (
        <div className="bg-ivory">
            {/* Hero Section */}
            <header className="relative pt-32 pb-20 overflow-hidden border-b border-charcoal/5">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal mb-8 uppercase leading-[0.9]">
                            {title}
                        </h1>
                        {heroHeadline && (
                            <p className="text-2xl md:text-4xl text-umber font-medium mb-8 leading-tight tracking-tight">
                                {heroHeadline}
                            </p>
                        )}
                        {heroIntro && (
                            <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl leading-relaxed">
                                {heroIntro}
                            </p>
                        )}
                    </div>
                </div>
                {data.hero?.image && (
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none hidden lg:block">
                        <Image
                            src={urlFor(data.hero.image).width(1200).url()}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </header>

            <div className="container mx-auto px-6 py-20">
                {/* Main Content Sections */}
                <div className="grid gap-px bg-charcoal/10 border border-charcoal/10">
                    {data.sections?.map((section: any, idx: number) => {
                        const sectionTitle = getLocalizedValue(section.title, locale)
                        const sectionContent = getLocalizedValue(section.content, locale)
                        const ctaText = getLocalizedValue(section.cta?.text, locale)
                        const ctaUrl = section.cta?.url

                        return (
                            <section key={idx} className="bg-ivory group overflow-hidden">
                                <div className="grid lg:grid-cols-2 min-h-[400px]">
                                    <div className="p-8 lg:p-16 flex flex-col justify-center">
                                        <div className="space-y-8">
                                            {sectionTitle && (
                                                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-charcoal leading-none">
                                                    {sectionTitle}
                                                </h2>
                                            )}
                                            {sectionContent && (
                                                <div className="prose prose-lg max-w-none text-charcoal/80">
                                                    <PortableText value={sectionContent} />
                                                </div>
                                            )}
                                            {ctaUrl && ctaText && (
                                                <div className="pt-4">
                                                    <Link
                                                        href={ctaUrl}
                                                        className="inline-flex items-center gap-4 bg-charcoal text-ivory px-8 py-4 uppercase font-bold tracking-widest hover:bg-umber transition-colors duration-300"
                                                    >
                                                        {ctaText}
                                                        <span className="text-xl">→</span>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative aspect-square lg:aspect-auto bg-charcoal/5 overflow-hidden">
                                        {section.image ? (
                                            <Image
                                                src={urlFor(section.image).width(1200).url()}
                                                alt={sectionTitle || ''}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-charcoal/10">
                                                <span className="text-9xl font-black">{idx + 1}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </div>

                <div className="mt-20">
                    <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
                </div>
            </div>
        </div>
    )
}
