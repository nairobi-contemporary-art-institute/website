import { sanityFetch } from '@/sanity/lib/client'
import { ACCESSIBILITY_PAGE_QUERY } from '@/sanity/lib/queries'
import { getTranslations } from 'next-intl/server'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { DownloadIcon } from '@sanity/icons'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: ACCESSIBILITY_PAGE_QUERY,
        tags: ['accessibilityPage']
    })
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })

    if (!data) {
        return {
            title: t('title'),
            description: t('description')
        }
    }

    const descriptionBlocks = getLocalizedValue<any>(data.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title: getLocalizedValue(data.title, locale) || t('title'),
        description
    }
}

export default async function AccessibilityPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })

    const pageData = await sanityFetch<any>({
        query: ACCESSIBILITY_PAGE_QUERY,
        tags: ['accessibilityPage']
    })

    const title = getLocalizedValue(pageData?.header?.headline, locale) || getLocalizedValue(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale)

    return (
        <div className="min-h-screen bg-stone-50/20 pb-32">
            <header className="container mx-auto px-section-clamp page-header-padding pb-20 border-b border-charcoal/5">
                <div className="max-w-4xl">
                    <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                        {title}
                    </h1>
                    {description ? (
                        <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            <PortableText value={description} locale={locale} />
                        </div>
                    ) : (
                        <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            {t('intro')}
                        </p>
                    )}
                </div>
            </header>

            {/* Accessibility Sections */}
            {pageData?.sections && pageData.sections.length > 0 && (
                <section className="px-section-clamp container mx-auto px-section-clamp py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                        {pageData.sections.map((section: any, i: number) => (
                            <div key={i} className="flex flex-col space-y-12">
                                {section.image?.asset && (
                                    <div className="relative aspect-[16/9] bg-stone-200 overflow-hidden rounded-sm">
                                        <Image
                                            src={section.image.asset.url}
                                            alt={getLocalizedValue(section.title, locale) || 'Accessibility Section'}
                                            fill
                                            className="object-cover"
                                            placeholder="blur"
                                            blurDataURL={section.image.asset.metadata?.lqip}
                                        />
                                    </div>
                                )}
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-4xl font-light tracking-tight text-charcoal">
                                        {getLocalizedValue(section.title, locale)}
                                    </h2>
                                    <div className="prose prose-stone prose-lg max-w-none text-charcoal/70 leading-relaxed font-light">
                                        <PortableText value={getLocalizedValue(section.content, locale)} locale={locale} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Venue Guide Section */}
            {pageData?.venueGuide && (
                <section className="px-section-clamp bg-charcoal text-white py-32 mt-12">
                    <div className="container mx-auto px-section-clamp">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-7xl font-light tracking-tighter">
                                        {getLocalizedValue(pageData.venueGuide.title, locale)}
                                    </h2>
                                    <p className="text-xl text-stone-400 font-light max-w-lg leading-relaxed">
                                        {getLocalizedValue(pageData.venueGuide.description, locale)}
                                    </p>
                                </div>

                                {pageData.venueGuide.guideUrl && (
                                    <a
                                        href={pageData.venueGuide.guideUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-4 bg-white text-charcoal px-8 py-5 text-sm capitalize tracking-widest font-medium hover:bg-stone-200 transition-colors group"
                                    >
                                        <DownloadIcon className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                                        Download Venue Guide (PDF)
                                    </a>
                                )}
                            </div>

                            {pageData.venueGuide.mapImage?.asset && (
                                <div className="relative aspect-[4/3] bg-stone-800 rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                                    <Image
                                        src={pageData.venueGuide.mapImage.asset.url}
                                        alt="Venue Map"
                                        fill
                                        className="object-cover opacity-90 transition-opacity hover:opacity-100"
                                        placeholder="blur"
                                        blurDataURL={pageData.venueGuide.mapImage.asset.metadata?.lqip}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Facility Policies */}
            {pageData?.policies && pageData.policies.length > 0 && (
                <section className="px-section-clamp container mx-auto px-section-clamp py-32">
                    <div className="max-w-4xl">
                        <h2 className="text-xs font-bold capitalize tracking-[0.3em] text-umber border-b border-umber/10 pb-4 inline-block mb-16">
                            Facility Policies
                        </h2>
                        <div className="grid grid-cols-1 gap-16">
                            {pageData.policies.map((policy: any, i: number) => (
                                <div key={i} className="group border-l-2 border-charcoal/5 pl-12 py-2 hover:border-umber/40 transition-colors">
                                    <h3 className="text-2xl font-medium text-charcoal mb-4 tracking-tight">
                                        {getLocalizedValue(policy.policyName, locale)}
                                    </h3>
                                    <div className="prose prose-stone prose-lg text-charcoal/70 font-light max-w-3xl leading-relaxed">
                                        <PortableText value={getLocalizedValue(policy.description, locale)} locale={locale} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back to Home CTA */}
            <div className="container mx-auto px-section-clamp pt-12 pb-24 border-t border-charcoal/5">
                <Link
                    href={`/${locale}`}
                    className="text-xs font-mono capitalize tracking-[0.2em] text-charcoal/40 hover:text-charcoal transition-colors border-b border-transparent hover:border-charcoal/20 pb-1"
                >
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    )
}
