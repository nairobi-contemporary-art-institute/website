
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { COLLECTION_ITEM_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    const item = await client.fetch(COLLECTION_ITEM_BY_SLUG_QUERY, { slug })

    if (!item) {
        return {
            title: 'Collection Item Not Found',
        }
    }

    const title = getLocalizedValue(item.title, locale)
    const artistName = item.artist ? getLocalizedValue(item.artist.name, locale) : ''

    return {
        title: `${title} - ${artistName}`,
        openGraph: {
            title: `${title} - ${artistName}`,
            images: item.mainImage ? [urlFor(item.mainImage).width(1200).height(630).url()] : [],
        },
    }
}

export default async function CollectionItemPage({ params }: Props) {
    const { locale, slug } = await params
    const item = await client.fetch(COLLECTION_ITEM_BY_SLUG_QUERY, { slug })

    if (!item) {
        notFound()
    }

    const title = getLocalizedValue(item.title, locale)
    const artistName = item.artist ? getLocalizedValue(item.artist.name, locale) : 'Unknown Artist'
    const medium = getLocalizedValue(item.medium, locale)
    const description = getLocalizedValue(item.description, locale)
    const creditLine = getLocalizedValue(item.creditLine, locale)
    const t = await getMessages({ locale }) as any

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <header className="mb-12">
                <Link href={`/${locale}/collection`} className="text-xs font-bold tracking-widest uppercase text-umber/60 hover:text-indigo-600 transition-colors mb-6 inline-block">
                    ← {t.Pages?.collection?.back || 'Back to Collection'}
                </Link>
            </header>

            <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
                {/* Main Image */}
                <div className="space-y-8">
                    <div className="relative bg-charcoal/5 overflow-hidden w-full">
                        {/* 
                           For collection items, we probably want to respect the aspect ratio 
                           rather than forcing a specific one, or use `style={{ objectFit: 'contain' }}`
                        */}
                        <Image
                            src={urlFor(item.mainImage).width(1200).url()}
                            alt={title || 'Collection Item'}
                            width={1200}
                            height={1200}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Details Sidebar */}
                <div className="space-y-10 lg:sticky lg:top-24">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-charcoal italic">
                            {title}
                        </h1>
                        {item.artist && (
                            <Link
                                href={`/${locale}/artists/${item.artist.slug}`}
                                className="text-xl md:text-2xl font-medium text-umber hover:text-indigo-600 transition-colors block"
                            >
                                {artistName}
                            </Link>
                        )}
                        {item.creationDate && (
                            <p className="text-lg text-umber/80">
                                {item.creationDate}
                            </p>
                        )}
                    </div>

                    <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20" />

                    <div className="space-y-4 text-sm text-umber/80 font-medium">
                        {medium && (
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-umber/60 uppercase text-xs tracking-wider pt-1">Medium</span>
                                <span>{medium}</span>
                            </div>
                        )}
                        {item.dimensions && (
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-umber/60 uppercase text-xs tracking-wider pt-1">Dimensions</span>
                                <span>{item.dimensions}</span>
                            </div>
                        )}
                        {creditLine && (
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-umber/60 uppercase text-xs tracking-wider pt-1">Credit</span>
                                <span>{creditLine}</span>
                            </div>
                        )}
                        {item.acquisitionDate && (
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-umber/60 uppercase text-xs tracking-wider pt-1">Acquired</span>
                                <span>{new Date(item.acquisitionDate).getFullYear()}</span>
                            </div>
                        )}

                        {item.tags && item.tags.length > 0 && (
                            <div className="pt-6 border-t border-umber/10">
                                <span className="text-umber/60 uppercase text-xs tracking-wider block mb-3 font-bold">Related Topics</span>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag: any) => (
                                        <span key={tag._id} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-bold bg-amber-50 px-3 py-1">
                                            {getLocalizedValue(tag.title, locale)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {description && (
                        <div className="pt-8 border-t border-umber/10">
                            <PortableText value={description} locale={locale} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
