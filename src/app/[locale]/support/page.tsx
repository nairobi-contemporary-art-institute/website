import { type Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import { SUPPORT_PAGE_QUERY } from '@/sanity/lib/queries'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextComponent } from '@/components/ui/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.support' })

    const pageData = await sanityFetch<any>({
        query: SUPPORT_PAGE_QUERY,
        tags: ['supportPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const descriptionBlocks = getLocalizedValue<any>(pageData?.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : '')

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    }
}

export default async function SupportPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.support' })

    const pageData = await sanityFetch<any>({
        query: SUPPORT_PAGE_QUERY,
        tags: ['supportPage']
    })

    if (!pageData) {
        return (
            <div className="container mx-auto px-6 py-40 text-center">
                <h1 className="text-4xl font-light text-charcoal italic tracking-tight">
                    Support page content coming soon.
                </h1>
            </div>
        )
    }

    const { header, tiers, sections, contactSection } = pageData
    const headline = getLocalizedValue(header?.headline, locale) || t('title')

    return (
        <div className="bg-ivory min-h-screen">
            {/* Hero Section */}
            <header className="relative pt-32 pb-24 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-umber font-bold mb-6 block">
                            Support NCAI
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-charcoal uppercase leading-[0.85] mb-12">
                            {headline}
                        </h1>
                        {header?.description && (
                            <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed italic prose-lg">
                                <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                            </div>
                        )}
                    </div>
                </div>

                {header?.image && (
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
                        <Image
                            src={urlFor(header.image).width(1200).url()}
                            alt=""
                            fill
                            className="object-cover grayscale"
                        />
                    </div>
                )}
            </header>

            <div className="container mx-auto px-6">
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20 mb-24" />

                {/* Membership Tiers */}
                <section className="mb-40">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-umber/60 mb-4">Membership</h2>
                            <h3 className="text-4xl md:text-5xl font-light tracking-tighter text-charcoal italic">
                                Join a community dedicated to East African art history.
                            </h3>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tiers?.map((tier: any, idx: number) => {
                            const name = getLocalizedValue(tier.name, locale)
                            const price = getLocalizedValue(tier.price, locale)
                            const ctaLabel = getLocalizedValue(tier.ctaLabel, locale) || 'Join Now'
                            const isFeatured = tier.isFeatured

                            return (
                                <div
                                    key={idx}
                                    className={`relative p-8 border ${isFeatured ? 'bg-charcoal text-ivory border-charcoal' : 'bg-white border-charcoal/5'} flex flex-col h-full hover:shadow-xl transition-shadow duration-500`}
                                >
                                    {isFeatured && (
                                        <span className="absolute -top-3 left-8 bg-ochre text-ivory text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                                            Recommended
                                        </span>
                                    )}
                                    <div className="mb-8">
                                        <h4 className="text-2xl font-bold uppercase tracking-tight mb-2">{name}</h4>
                                        <p className={`text-3xl font-light ${isFeatured ? 'text-ochre' : 'text-umber/80'}`}>{price}</p>
                                    </div>

                                    <div className={`prose prose-sm mb-8 flex-grow ${isFeatured ? 'prose-invert opacity-80' : 'text-charcoal/70'}`}>
                                        <PortableTextComponent value={getLocalizedValue(tier.description, locale)} />
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
                                        className={`w-full py-4 text-center text-xs font-bold uppercase tracking-[0.2em] transition-all border ${isFeatured
                                                ? 'bg-ivory text-charcoal border-ivory hover:bg-ochre hover:text-ivory hover:border-ochre'
                                                : 'bg-charcoal text-ivory border-charcoal hover:bg-white hover:text-charcoal'
                                            }`}
                                    >
                                        {ctaLabel}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Additional Sections */}
                {sections?.map((section: any, idx: number) => {
                    const sectionTitle = getLocalizedValue(section.title, locale)
                    const isSplit = section.layout === 'split'

                    return (
                        <section key={idx} className="mb-40">
                            <div className={`grid gap-16 items-center ${isSplit ? 'lg:grid-cols-2' : 'max-w-4xl'}`}>
                                <div className="space-y-8">
                                    <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-charcoal">
                                        {sectionTitle}
                                    </h2>
                                    <div className="prose prose-lg prose-umber max-w-none opacity-90">
                                        <PortableTextComponent value={getLocalizedValue(section.content, locale)} />
                                    </div>
                                </div>
                                {isSplit && section.image && (
                                    <div className="relative aspect-[4/5] bg-charcoal/5 overflow-hidden">
                                        <Image
                                            src={urlFor(section.image).width(1200).url()}
                                            alt={sectionTitle || ''}
                                            fill
                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                        />
                                    </div>
                                )}
                            </div>
                        </section>
                    )
                })}

                {/* Contact Footer */}
                {contactSection && (
                    <section className="bg-amber-50 -mx-6 px-6 py-24 md:py-32 border-y border-amber-900/5">
                        <div className="max-w-4xl mx-auto text-center space-y-12">
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-charcoal italic">
                                {getLocalizedValue(contactSection.headline, locale)}
                            </h2>
                            {contactSection.email && (
                                <a
                                    href={`mailto:${contactSection.email}`}
                                    className="inline-block text-xl md:text-3xl font-bold text-amber-900 border-b-2 border-amber-900/10 hover:border-amber-900 transition-colors pb-2"
                                >
                                    {contactSection.email}
                                </a>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
