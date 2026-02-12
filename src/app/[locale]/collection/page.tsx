
import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { COLLECTION_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export const metadata: Metadata = {
    title: 'Collection',
    description: 'Explore the NCAI Collection.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function CollectionPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const collectionItems = await client.fetch(COLLECTION_QUERY)
    const t = await getMessages({ locale }) as any

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20 space-y-8 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-charcoal">
                    {t.Pages?.collection?.title || 'Collection'}
                </h1>
                <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                    {t.Pages?.collection?.description || 'Discover works from the NCAI permanent collection, featuring contemporary art from East Africa and beyond.'}
                </p>
                <ResponsiveDivider variant="straight" className="text-umber/20" />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {collectionItems.map((item: any) => {
                    const title = getLocalizedValue(item.title, locale)
                    const artistName = getLocalizedValue(item.artistName, locale) // artistName comes from join in query

                    return (
                        <Link
                            key={item._id}
                            href={`/${locale}/collection/${item.slug}`}
                            className="group block space-y-4"
                        >
                            <div className="aspect-[3/4] relative bg-charcoal/5 overflow-hidden">
                                {item.mainImage ? (
                                    <Image
                                        src={urlFor(item.mainImage).width(600).height(800).url()}
                                        alt={title || 'Collection Item'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        placeholder="blur"
                                        blurDataURL={item.mainImage?.asset?.metadata?.lqip}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-umber/20">No Image</div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h2 className="font-bold text-lg text-charcoal group-hover:text-indigo-600 transition-colors">
                                    {title}
                                </h2>
                                <p className="text-umber/80 font-medium">
                                    {artistName}
                                </p>
                                <p className="text-xs text-umber/60 uppercase tracking-widest">
                                    {item.creationDate}
                                </p>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-2 flex-wrap pt-2">
                                        {item.tags.slice(0, 3).map((tag: any) => (
                                            <span key={tag._id} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-bold bg-amber-50 px-2 py-0.5">
                                                {getLocalizedValue(tag.title, locale)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>

            {collectionItems.length === 0 && (
                <div className="text-center py-20 text-umber/50">
                    <p>No collection items found.</p>
                </div>
            )}
        </div>
    )
}
