
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { EXHIBITION_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'
import { LogoGrid } from '@/components/ui/LogoGrid'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { Gallery } from '@/components/ui/Gallery'

// Placeholder date formatter
const formatDateLocal = (dateString: string, locale: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    const exhibition = await sanityFetch<any>({
        query: EXHIBITION_BY_SLUG_QUERY,
        params: { slug },
        tags: [`exhibition:${slug}`]
    })

    if (!exhibition) {
        return {
            title: 'Exhibition Not Found',
        }
    }

    const title = getLocalizedValue(exhibition.title, locale)
    const descriptionBlocks = getLocalizedValue<any>(exhibition.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : `Exhibition: ${title}`)

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: exhibition.mainImage ? [urlFor(exhibition.mainImage).width(1200).height(630).url()] : [],
        },
    }
}

export default async function ExhibitionPage({ params }: Props) {
    const { locale, slug } = await params
    const exhibition = await sanityFetch<any>({
        query: EXHIBITION_BY_SLUG_QUERY,
        params: { slug },
        tags: [`exhibition:${slug}`]
    })

    if (!exhibition) {
        notFound()
    }

    const title = getLocalizedValue(exhibition.title, locale)
    const description = getLocalizedValue(exhibition.description, locale)
    const t = await getMessages({ locale }) as any

    const settings = await sanityFetch<any>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings']
    });

    const artists = exhibition.artists || []

    return (
        <div className="container mx-auto px-section-clamp py-20 min-h-screen">
            <div className="flex flex-col">
                <header className="max-w-3xl mb-12 space-y-6">
                    <span className="inline-block px-3 py-1 border border-umber/20 text-xs font-bold tracking-widest text-umber/60">
                        {t.Pages?.exhibitions?.label || 'Exhibition'}
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-charcoal">
                        {title || 'Untitled'}
                    </h1>

                    <div className="flex items-center space-x-4 text-lg text-umber font-medium">
                        <span>{formatDateLocal(exhibition.startDate, locale)}</span>
                        {exhibition.endDate && (
                            <>
                                <span className="text-umber/40">—</span>
                                <span>{formatDateLocal(exhibition.endDate, locale)}</span>
                            </>
                        )}
                    </div>
                </header>

                {exhibition.mainImage && (
                    <div className="mb-20 space-y-4 w-full">
                        <div className="relative bg-charcoal/5 w-full">
                            <Image
                                src={urlFor(exhibition.mainImage).width(2400).url()}
                                alt={title || 'Exhibition Main Image'}
                                width={2400}
                                height={1200}
                                className="w-full h-auto block"
                                priority
                                loading="eager"
                                placeholder="blur"
                                blurDataURL={exhibition.mainImage.asset?.metadata?.lqip}
                            />
                        </div>
                        {exhibition.mainImage.caption && (
                            <div className="max-w-3xl text-sm text-umber/60 leading-relaxed">
                                <ArtCaption content={getLocalizedValue(exhibition.mainImage.caption, locale)} />
                            </div>
                        )}
                    </div>
                )}

                <div className="max-w-3xl space-y-16">
                    {/* Enquire Button */}
                    <div>
                        <Link
                            href={`/${locale}/contact?subject=Enquiry: ${title}`}
                            className="inline-block px-section-clamp py-2 border border-charcoal text-xs capitalize tracking-widest font-bold hover:bg-charcoal hover:text-off-white transition-all"
                        >
                            Enquire
                        </Link>
                    </div>

                    {/* Description */}
                    <div className="prose prose-lg max-w-none text-charcoal/80 leading-relaxed font-serif">
                        <PortableText value={description} locale={locale} />
                    </div>
                </div>

                {/* Gallery Section */}
                {exhibition.gallery && exhibition.gallery.length > 0 && (
                    <Gallery images={exhibition.gallery} locale={locale} />
                )}

                <div className="max-w-3xl space-y-16">
                    {/* More Information */}
                    <section className="px-section-clamp space-y-6 pt-16 border-t border-rich-blue/20">
                        <h2 className="text-2xl font-semibold tracking-tight text-charcoal">More information</h2>
                        <div className="flex flex-col space-y-4">
                            <button className="text-left text-sm font-medium underline underline-offset-4 decoration-umber/30 hover:decoration-umber transition-all w-fit">
                                Download the full press release
                            </button>
                            {artists.map((artist: any) => (
                                <Link
                                    key={artist._id}
                                    href={`/${locale}/artists/${artist.slug}`}
                                    className="text-sm font-medium underline underline-offset-4 decoration-umber/30 hover:decoration-umber transition-all w-fit"
                                >
                                    About {getLocalizedValue(artist.name, locale)}
                                </Link>
                            ))}
                            <Link
                                href={`/${locale}/contact`}
                                className="text-sm font-medium underline underline-offset-4 decoration-umber/30 hover:decoration-umber transition-all w-fit"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </section>

                    {/* Location */}
                    <section className="px-section-clamp space-y-6 pt-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-charcoal">Location</h2>
                        <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                            {settings?.contactInfo?.address && (
                                <div className="whitespace-pre-line">
                                    {settings.contactInfo.address}
                                </div>
                            )}
                            {settings?.hours && (
                                <div className="space-y-1">
                                    <p className="font-semibold text-charcoal">Opening Times:</p>
                                    <p>Tuesday – Saturday: 10:00am – 6:00pm</p>
                                </div>
                            )}
                            <Link
                                href={settings?.contactInfo?.googleMapsUrl || '#'}
                                target="_blank"
                                className="inline-block text-sm font-medium underline underline-offset-4 decoration-umber/30 hover:decoration-umber transition-all"
                            >
                                View map
                            </Link>
                        </div>
                    </section>

                    {/* Partners */}
                    <LogoGrid
                        partners={exhibition.partners}
                        locale={locale}
                        title={t.Common?.partners || 'Our Partners'}
                    />

                    <footer className="pt-10 border-t border-rich-blue/20">
                        <Link href={`/${locale}/exhibitions`} className="text-sm font-bold tracking-widest text-umber hover:text-charcoal transition-colors">
                            ← Back to Exhibitions
                        </Link>
                    </footer>
                </div>
            </div>
        </div>
    )
}
