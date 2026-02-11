
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { EXHIBITION_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'

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
    const exhibition = await client.fetch(EXHIBITION_BY_SLUG_QUERY, { slug })

    if (!exhibition) {
        return {
            title: 'Exhibition Not Found',
        }
    }

    const title = getLocalizedValue(exhibition.title, locale)

    return {
        title,
        openGraph: {
            title,
            images: exhibition.mainImage ? [urlFor(exhibition.mainImage).width(1200).height(630).url()] : [],
        },
    }
}

export default async function ExhibitionPage({ params }: Props) {
    const { locale, slug } = await params
    const exhibition = await client.fetch(EXHIBITION_BY_SLUG_QUERY, { slug })

    if (!exhibition) {
        notFound()
    }

    const title = getLocalizedValue(exhibition.title, locale)
    const description = getLocalizedValue(exhibition.description, locale)
    const t = await getMessages({ locale }) as any // generic typing fallback

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-4xl mx-auto mb-16 text-center space-y-6">
                <span className="inline-block px-3 py-1 rounded-full border border-umber/20 text-xs font-bold tracking-widest uppercase text-umber/60">
                    {t.Pages?.exhibitions?.label || 'Exhibition'}
                </span>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-charcoal">
                    {title || 'Untitled'}
                </h1>

                <div className="flex items-center justify-center space-x-4 text-lg text-umber font-medium">
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
                <div className="mb-20">
                    <div className="aspect-[16/9] md:aspect-[21/9] relative bg-charcoal/5 overflow-hidden rounded-sm w-full">
                        <Image
                            src={urlFor(exhibition.mainImage).width(1920).height(1080).url()}
                            alt={title || 'Exhibition Main Image'}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_250px] gap-16">
                <div className="space-y-12">
                    <section>
                        <h2 className="sr-only">About</h2>
                        <PortableText value={description} locale={locale} />
                    </section>

                    {exhibition.gallery && exhibition.gallery.length > 0 && (
                        <section className="space-y-8">
                            <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20" />
                            <h2 className="text-2xl font-bold text-charcoal">Gallery</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {exhibition.gallery.map((image: any, i: number) => (
                                    <div key={i} className="aspect-[4/3] relative bg-charcoal/5 overflow-hidden rounded-sm">
                                        <Image
                                            src={urlFor(image).width(800).height(600).url()}
                                            alt={`Gallery image ${i + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="space-y-12">
                    <div className="sticky top-24 space-y-12">
                        {/* Artists */}
                        {exhibition.artists && exhibition.artists.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold tracking-widest uppercase text-umber/60 mb-6 border-b border-umber/10 pb-2">
                                    Artists
                                </h3>
                                <ul className="space-y-4">
                                    {exhibition.artists.map((artist: any) => {
                                        const artistName = getLocalizedValue(artist.name, locale)
                                        return (
                                            <li key={artist._id} className="group flex items-center space-x-3">
                                                <Link
                                                    href={`/${locale}/artists/${artist.slug}`}
                                                    className="flex items-center space-x-3 w-full"
                                                >
                                                    {artist.image && (
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-charcoal/5 text-xs">
                                                            <Image
                                                                src={urlFor(artist.image).width(100).height(100).url()}
                                                                alt={artistName || 'Artist'}
                                                                fill
                                                                className="object-cover grayscale group-hover:grayscale-0 transition-all"
                                                            />
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-charcoal group-hover:text-indigo-600 transition-colors">
                                                        {artistName}
                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Curators */}
                        {exhibition.curators && exhibition.curators.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold tracking-widest uppercase text-umber/60 mb-6 border-b border-umber/10 pb-2">
                                    Curated By
                                </h3>
                                <ul className="space-y-4">
                                    {exhibition.curators.map((curator: any) => {
                                        const curatorName = getLocalizedValue(curator.name, locale)
                                        return (
                                            <li key={curator._id} className="flex items-center space-x-3">
                                                {curator.image && (
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-charcoal/5 text-xs">
                                                        <Image
                                                            src={urlFor(curator.image).width(100).height(100).url()}
                                                            alt={curatorName || 'Curator'}
                                                            fill
                                                            className="object-cover grayscale"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-charcoal">
                                                        {curatorName}
                                                    </span>
                                                    <span className="text-[10px] text-charcoal/60 uppercase tracking-wider">
                                                        {curator.roles?.[0] || 'Curator'}
                                                    </span>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Tags */}
                        {exhibition.tags && exhibition.tags.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold tracking-widest uppercase text-umber/60 mb-4 border-b border-umber/10 pb-2">
                                    Related
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {exhibition.tags.map((tag: any) => (
                                        <span
                                            key={tag._id}
                                            className="text-[10px] uppercase tracking-wider font-bold bg-charcoal/5 px-2 py-1 rounded-sm text-charcoal/60 hover:bg-charcoal/10 transition-colors cursor-default"
                                        >
                                            {getLocalizedValue(tag.title, locale)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <footer className="max-w-4xl mx-auto mt-20 pt-10 border-t border-umber/10 flex justify-between">
                <Link href={`/${locale}/exhibitions`} className="text-sm font-bold tracking-widest uppercase text-umber hover:text-indigo-600 transition-colors">
                    ← Back to Exhibitions
                </Link>
            </footer>
        </div>
    )
}
