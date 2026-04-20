import { client, sanityFetch } from '@/sanity/lib/client'
import { EDUCATION_PAGE_QUERY, PROGRAMS_QUERY, RESOURCES_QUERY } from '@/sanity/lib/queries'
import { EducationFilter } from '@/components/education/EducationFilter'
import { ResourceGallery } from '@/components/education/ResourceGallery'
import { getTranslations } from 'next-intl/server'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: EDUCATION_PAGE_QUERY,
        tags: ['educationPage']
    })
    const t = await getTranslations({ locale, namespace: 'Pages.education' })

    if (!data) {
        return {
            title: t('title'),
            description: t('description')
        }
    }

    const descriptionBlocks = getLocalizedValue<any>(data.header?.descriptionRich, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title: getLocalizedValueAsString(data.title, locale) || t('title'),
        description
    }
}

export default async function EducationPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.education' })

    const [pageData, programs, resources] = await Promise.all([
        sanityFetch<any>({ query: EDUCATION_PAGE_QUERY, tags: ['educationPage'] }),
        sanityFetch<any[]>({ query: PROGRAMS_QUERY, tags: ['program'] }),
        sanityFetch<any[]>({ query: RESOURCES_QUERY, tags: ['resource'] })
    ])

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.descriptionRich, locale)
    const heroImage = pageData?.header?.image

    return (
        <div className="min-h-screen bg-stone-50/20 pb-32">
            {/* Immersive Hero Section */}
            <section className="relative h-[80vh] w-full bg-charcoal overflow-hidden pt-[var(--header-height)]">
                {heroImage?.asset?.url && (
                    <Image
                        src={heroImage.asset.url}
                        alt={title}
                        fill
                        className="object-cover opacity-60"
                        priority
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL={heroImage.asset.metadata?.lqip}
                    />
                )}
                {/* Subtle diagonal corner gradient: Bottom Right to Top Left */}
                <div className="absolute inset-0 bg-gradient-to-tl from-charcoal/60 via-charcoal/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 container mx-auto px-section-clamp h-full flex flex-col justify-end pb-24">
                    <div className="ml-auto w-full lg:w-1/2 text-left px-8 lg:px-0">
                        <div className="mb-6">
                            <h1 className="text-4xl md:text-[3.5rem] font-medium tracking-tighter text-white leading-[1] transform -translate-x-1">
                                {title}
                            </h1>
                        </div>
                        <div>
                            {description && (
                                <div className="text-[1.125rem] text-stone-100/90 font-light leading-[1.05] drop-shadow-md">
                                    <PortableText value={description} locale={locale} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sub-Navigation Bar */}
            <nav className="sticky top-[var(--header-height)] z-30 bg-charcoal text-white border-b border-white/10 backdrop-blur-md">
                <div className="container mx-auto px-section-clamp">
                    <ul className="flex items-center space-x-8 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <li><a href="#overview" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-stone-300 transition-colors">Overview</a></li>
                        {pageData?.sections?.map((section: any, idx: number) => {
                            const sectionTitle = getLocalizedValue(section.title, locale)
                            return sectionTitle ? (
                                <li key={idx}>
                                    <a href={`#section-${idx}`} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-stone-300 transition-colors">
                                        {sectionTitle}
                                    </a>
                                </li>
                            ) : null
                        })}
                        <li><a href="#pillars" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-stone-300 transition-colors">Audience Groups</a></li>
                        {resources && resources.length > 0 && (
                            <li><a href="#resources" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-stone-300 transition-colors">Resources</a></li>
                        )}
                        <li><a href="#programs" className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-stone-300 transition-colors">All Programs</a></li>
                    </ul>
                </div>
            </nav>

            {/* Content Sections (IMMA Style) */}
            <div id="overview" className="bg-white py-32 scroll-mt-32">
                <div className="container mx-auto px-section-clamp">
                    {/* Main Overview Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                        <div className="lg:col-span-4">
                            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-charcoal/40 sticky top-48">
                                Overview
                            </h2>
                        </div>
                        <div className="lg:col-span-8 prose prose-lg prose-stone max-w-none prose-p:text-umber/80 prose-p:font-light prose-p:leading-relaxed">
                            {description ? (
                                <PortableText value={description} locale={locale} />
                            ) : (
                                <p>{t('description')}</p>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    {pageData?.sections?.map((section: any, idx: number) => {
                        const sectionTitle = getLocalizedValue(section.title, locale)
                        const sectionContent = getLocalizedValue(section.content, locale)
                        if (!sectionTitle || !sectionContent) return null

                        return (
                            <div key={idx} id={`section-${idx}`} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pt-32 mt-32 border-t border-stone-100 scroll-mt-32">
                                <div className="lg:col-span-4">
                                    <h2 className="text-3xl md:text-5xl font-light tracking-tight text-charcoal sticky top-48">
                                        {sectionTitle}
                                    </h2>
                                </div>
                                <div className="lg:col-span-8 prose prose-lg prose-stone max-w-none prose-p:text-umber/80 prose-p:font-light prose-p:leading-relaxed">
                                    <PortableText value={sectionContent} locale={locale} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Pillars Section */}
            {pageData?.pillars && pageData.pillars.length > 0 && (
                <section id="pillars" className="py-32 bg-stone-50/50 scroll-mt-32">
                    <div className="container mx-auto px-section-clamp mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-charcoal/40 mb-16">
                            Explore More
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-8">
                            {pageData.pillars.map((pillar: any, i: number) => {
                                const isExternal = !!pillar.linkUrl
                                const pillarTitle = getLocalizedValue(pillar.title, locale)
                                const pillarDescription = getLocalizedValue(pillar.description, locale)
                                
                                const CardContent = (
                                    <div className="group flex flex-col space-y-6">
                                        {/* Title above the card */}
                                        <h3 className="text-2xl md:text-3xl font-light text-charcoal tracking-tight transition-colors duration-500 group-hover:text-umber">
                                            {pillarTitle}
                                        </h3>

                                        <div className="relative aspect-square bg-charcoal overflow-hidden cursor-pointer">
                                            {/* Background Image - Initial Color, Hover Grayscale + Zoom */}
                                            {pillar.image?.asset && (
                                                <Image
                                                    src={pillar.image.asset.url}
                                                    alt={pillarTitle || 'Pillar'}
                                                    fill
                                                    className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 group-hover:grayscale group-hover:opacity-50"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    placeholder="blur"
                                                    blurDataURL={pillar.image.asset.metadata?.lqip}
                                                />
                                            )}

                                            {/* Hover Description (Bottom) */}
                                            {pillarDescription && (
                                                <div className="absolute inset-x-0 bottom-0 p-8 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                    <p className="text-sm font-light text-stone-200 leading-relaxed max-w-[90%]">
                                                        {pillarDescription}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Hover Interaction Overlay (Blur + Icon) */}
                                            <div className={cn(
                                                "absolute inset-0 transition-all duration-700 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10",
                                                isExternal ? "bg-charcoal/30 backdrop-blur-[4px]" : "bg-charcoal/20"
                                            )}>
                                                {isExternal && (
                                                    <div className="flex flex-col items-center space-y-3 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                                        <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center bg-white/20 backdrop-blur-xl shadow-2xl">
                                                            <ArrowUpRight className="w-7 h-7 text-white" />
                                                        </div>
                                                        <span className="text-[10px] uppercase tracking-[0.4em] text-white font-black drop-shadow-md">
                                                            {locale === 'sw' ? 'TEMBELEA' : 'VISIT SITE'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )

                                if (isExternal) {
                                    return (
                                        <a 
                                            key={i} 
                                            href={pillar.linkUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            {CardContent}
                                        </a>
                                    )
                                }

                                return <div key={i}>{CardContent}</div>
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Resources Section */}
            {resources && resources.length > 0 && (
                <div id="resources" className="scroll-mt-32">
                    <ResourceGallery resources={resources} locale={locale} />
                </div>
            )}

            {/* All Programs Section */}
            <section id="programs" className="py-32 scroll-mt-32">
                <div className="container mx-auto px-section-clamp">
                    <div className="mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-charcoal/40 border-b border-charcoal/10 pb-4 inline-block mb-16">
                            {t('allPrograms')}
                        </h2>
                        <EducationFilter programs={programs} locale={locale} />
                    </div>
                </div>
            </section>
        </div>
    )
}
