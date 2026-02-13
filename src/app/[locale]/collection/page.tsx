import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations, getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { COLLECTION_QUERY, COLLECTION_PAGE_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableTextComponent } from '@/components/ui/PortableText'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.collection' })

    const pageData = await sanityFetch<any>({
        query: COLLECTION_PAGE_QUERY,
        tags: ['collectionPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const descriptionBlocks = getLocalizedValue<any>(pageData?.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    }
}

export const revalidate = 3600 // Revalidate every hour

export default async function CollectionPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.collection' })

    const [collectionItems, pageData] = await Promise.all([
        client.fetch(COLLECTION_QUERY),
        sanityFetch<any>({ query: COLLECTION_PAGE_QUERY, tags: ['collectionPage'] })
    ])

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const header = pageData?.header

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20 space-y-8 max-w-4xl">
                <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-charcoal">
                    {getLocalizedValue(header?.headline, locale) || title}
                </h1>
                <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                    {header?.description ? (
                        <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                    ) : (
                        <p>{t('description')}</p>
                    )}
                </div>
                <ResponsiveDivider variant="straight" className="text-umber/20" />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {collectionItems.map((item: any) => {
                    const itemTitle = getLocalizedValue(item.title, locale)
                    const artistName = getLocalizedValue(item.artistName, locale)

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
                                        alt={itemTitle || 'Collection Item'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        placeholder="blur"
                                        blurDataURL={item.mainImage?.asset?.metadata?.lqip}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-umber/20 font-mono text-xs uppercase tracking-widest">No Image</div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h2 className="font-medium text-lg text-charcoal group-hover:text-umber transition-colors tracking-tight">
                                    {itemTitle}
                                </h2>
                                <p className="text-charcoal/60 font-medium">
                                    {artistName}
                                </p>
                                <p className="text-[10px] text-umber/40 uppercase tracking-[0.2em] font-bold">
                                    {item.creationDate}
                                </p>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-2 flex-wrap pt-3">
                                        {item.tags.slice(0, 3).map((tag: any) => (
                                            <span key={tag._id} className="text-[9px] uppercase tracking-widest text-charcoal/40 border border-charcoal/10 px-2 py-0.5">
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
                <div className="text-center py-40 text-umber/30 font-mono uppercase tracking-[0.3em] text-xs">
                    <p>No collection items found.</p>
                </div>
            )}
        </div>
    )
}
