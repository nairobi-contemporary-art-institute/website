import { sanityFetch } from "@/sanity/lib/client"
import { GET_INVOLVED_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import Link from "next/link"
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"
import { Check } from "lucide-react"
import { HeroIMMA } from "@/components/ui/HeroIMMA"

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
    const [data, settings] = await Promise.all([
        sanityFetch<any>({
            query: GET_INVOLVED_PAGE_QUERY,
            tags: ["getInvolvedPage"],
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
    const headerStyle = settings?.headerStyle || 'ncai'

    return (
        <GridSystem unstable_useContainer>
            <div className="bg-ivory min-h-screen">
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
                    <header className="relative page-header-padding pb-20 overflow-hidden border-b border-charcoal/5">
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
                                        sizes="(max-width: 768px) 100vw, 33vw"
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
                    {/* Membership Tiers Section */}
                    {data.membershipTiers && data.membershipTiers.length > 0 && (
                        <section className="px-section-clamp px-section-clamp">
                            <div className="mb-16">
                                <h2 className="text-xs font-bold capitalize tracking-[0.3em] text-umber/60 mb-4">Membership</h2>
                                <h3 className="text-4xl md:text-5xl font-light tracking-tighter text-charcoal italic">
                                    Join a community dedicated to East African art history.
                                </h3>
                            </div>

                            <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={32}>
                                {data.membershipTiers.map((tier: any, idx: number) => {
                                    const name = getLocalizedValue(tier.name, locale)
                                    const price = getLocalizedValue(tier.price, locale)
                                    const ctaLabel = getLocalizedValue(tier.ctaLabel, locale) || 'Join Now'
                                    const isFeatured = tier.isFeatured

                                    return (
                                        <GridCell key={idx} className="p-0">
                                            <div
                                                className={`relative w-full p-8 border ${isFeatured ? 'bg-charcoal text-ivory border-charcoal' : 'bg-white border-charcoal/5'} flex flex-col h-full group hover:shadow-2xl transition-all duration-500`}
                                            >
                                                {isFeatured && (
                                                    <span className="absolute -top-3 left-8 bg-ochre text-ivory text-[10px] capitalize font-bold tracking-widest px-3 py-1 z-20">
                                                        Recommended
                                                    </span>
                                                )}
                                                <div className="mb-8">
                                                    <h4 className="text-2xl font-bold capitalize tracking-tight mb-2">{name}</h4>
                                                    <p className={`text-3xl font-light ${isFeatured ? 'text-ochre' : 'text-umber/80'}`}>{price}</p>
                                                </div>

                                                <div className={`prose prose-sm mb-8 flex-grow ${isFeatured ? 'prose-invert opacity-80' : 'text-charcoal/70'}`}>
                                                    <PortableText value={getLocalizedValue(tier.description, locale)} locale={locale} />
                                                </div>

                                                {tier.benefits && (
                                                    <ul className="space-y-4 mb-12">
                                                        {tier.benefits.map((benefit: any, bIdx: number) => (
                                                            <li key={bIdx} className="flex gap-3 items-start text-sm">
                                                                <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-ochre' : 'text-umber'}`} />
                                                                <span>{getLocalizedValue(benefit, locale)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                <Link
                                                    href={tier.ctaUrl || '#'}
                                                    className={`w-full py-4 text-center text-xs font-bold capitalize tracking-[0.2em] transition-all border ${isFeatured
                                                        ? 'bg-ivory text-charcoal border-ivory hover:bg-ochre hover:text-ivory hover:border-ochre'
                                                        : 'bg-charcoal text-ivory border-charcoal hover:bg-white hover:text-charcoal'
                                                        }`}
                                                >
                                                    {ctaLabel}
                                                </Link>
                                            </div>
                                        </GridCell>
                                    )
                                })}
                            </Grid>
                        </section>
                    )}

                    {/* Additional Sections */}
                    <div className="space-y-32">
                        {data.sections?.map((section: any, idx: number) => {
                            const sectionTitle = getLocalizedValue(section.title, locale)
                            const sectionContent = getLocalizedValue(section.content, locale)
                            const ctaText = getLocalizedValue(section.cta?.text, locale)
                            const ctaUrl = section.cta?.url
                            const isSplit = section.layout === 'split'

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
                                                {ctaUrl && ctaText && (
                                                    <div className="pt-4">
                                                        <Link
                                                            href={ctaUrl}
                                                            className="inline-flex items-center gap-4 bg-charcoal text-ivory px-8 py-4 capitalize font-bold tracking-widest hover:bg-umber transition-all duration-300 group"
                                                        >
                                                            {ctaText}
                                                            <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </GridCell>

                                        {isSplit && section.image && (
                                            <GridCell column={{ sm: 1, md: 6 }} className="p-0">
                                                <div className="relative aspect-square w-full bg-charcoal/5 overflow-hidden group">
                                                    <Image
                                                        src={urlFor(section.image).width(1200).url()}
                                                        alt={sectionTitle || ''}
                                                        fill
                                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
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
                    </div>

                    {/* Contact Section */}
                    {data.contactSection && (
                        <section className="px-section-clamp bg-umber/5 -mx-section-clamp px-section-clamp py-32 border-y border-umber/10">
                            <Grid columns={{ sm: 1, md: 12 }}>
                                <GridCell column={{ sm: 1, md: 8 }} className="mx-auto text-center space-y-12">
                                    <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-charcoal italic leading-tight">
                                        {getLocalizedValue(data.contactSection.headline, locale)}
                                    </h2>
                                    {data.contactSection.email && (
                                        <a
                                            href={`mailto:${data.contactSection.email}`}
                                            className="inline-block text-xl md:text-3xl font-bold text-umber border-b-2 border-umber/20 hover:border-umber transition-all duration-300 pb-2"
                                        >
                                            {data.contactSection.email}
                                        </a>
                                    )}
                                </GridCell>
                            </Grid>
                        </section>
                    )}

                    <div className="mt-20">
                        <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
                    </div>
                </div>
            </div>
        </GridSystem>
    )
}
