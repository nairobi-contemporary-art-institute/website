import { sanityFetch } from '@/sanity/lib/client'
import { COLLECTION_ITEM_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { GridSystem } from '@/components/ui/Grid/Grid'
import { Metadata } from 'next'
import { getLocalizedValue } from '@/sanity/lib/utils'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@/components/ui/PortableText'
import { getTranslations } from 'next-intl/server'

import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import { locales } from '@/i18n'

export async function generateStaticParams() {
    const documents = await sanityFetch<any[]>({
        query: SITEMAP_QUERY,
        tags: ['collection']
    })
    const works = documents.filter(doc => doc._type === 'collectionItem' && doc.slug)

    return locales.flatMap((locale) =>
        works.map((work) => ({
            locale,
            slug: work.slug,
        }))
    )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params
    const work = await sanityFetch<any>({
        query: COLLECTION_ITEM_BY_SLUG_QUERY,
        params: { slug },
        tags: [`collectionItem:${slug}`]
    })
    if (!work) return {}

    const t = await getTranslations({ locale, namespace: 'Pages.collection' })
    const title = getLocalizedValue(work.title, locale) || t('untitled')
    const artistName = getLocalizedValue(work.artist?.name, locale) || t('unknownArtist')

    return {
        title: `${title} ${t('by')} ${artistName}`,
        description: t('detailsDescription', { title: title as string }),
    }
}

export default async function CollectionItemPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.collection' })
    const work = await sanityFetch<any>({
        query: COLLECTION_ITEM_BY_SLUG_QUERY,
        params: { slug },
        tags: [`collectionItem:${slug}`]
    })

    if (!work) {
        notFound()
    }

    const title = getLocalizedValue(work.title, locale) || t('untitled')
    const artistName = getLocalizedValue(work.artist?.name, locale) || t('unknownArtist')
    const description = getLocalizedValue(work.description, locale)

    return (
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-24">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                    {/* Left: Image */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-charcoal/5">
                            {work.mainImage?.asset && (
                                <Image
                                    src={urlFor(work.mainImage).width(1200).url()}
                                    alt={title}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    {...(work.mainImage?.asset?.metadata?.lqip && {
                                        placeholder: 'blur',
                                        blurDataURL: work.mainImage.asset.metadata.lqip
                                    })}
                                />
                            )}
                        </div>
                        {work.mainImage?.caption && (
                            <div className="text-xs text-charcoal/50 leading-relaxed border-l border-charcoal/20 pl-4 italic">
                                {getLocalizedValue(work.mainImage.caption, locale)}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-12">
                        <header className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-charcoal italic leading-none">
                                {title}
                            </h1>
                            <Link
                                href={`/${locale}/artists/${work.artist?.slug || ''}`}
                                className="text-xl font-bold text-charcoal hover:underline decoration-charcoal/20 transition-all inline-block"
                            >
                                {artistName}
                            </Link>
                        </header>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-8 border-y border-charcoal/10">
                            <div>
                                <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('year')}</p>
                                <p className="text-sm text-charcoal">{work.creationDate || t('notAvailable')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('medium')}</p>
                                <p className="text-sm text-charcoal">{work.medium || t('notAvailable')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('dimensions')}</p>
                                <p className="text-sm text-charcoal">{work.dimensions || t('notAvailable')}</p>
                            </div>
                            {work.edition && (
                                <div>
                                    <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('edition')}</p>
                                    <p className="text-sm text-charcoal">{work.edition}</p>
                                </div>
                            )}
                            {work.acquisitionDate && (
                                <div>
                                    <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('acquisitionDate')}</p>
                                    <p className="text-sm text-charcoal">{work.acquisitionDate}</p>
                                </div>
                            )}
                            {work.creditLine && (
                                <div className="col-span-2 mt-2">
                                    <p className="text-[10px] tracking-widest capitalize font-bold text-charcoal/40 mb-1">{t('creditLine')}</p>
                                    <p className="text-sm text-charcoal italic">{getLocalizedValue(work.creditLine, locale)}</p>
                                </div>
                            )}
                        </div>

                        {description && (
                            <div className="prose prose-charcoal max-w-none">
                                <PortableText value={description} locale={locale} />
                            </div>
                        )}

                        {work.tags && work.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4">
                                {work.tags.map((tag: any) => (
                                    <span
                                        key={tag._id}
                                        className="inline-flex items-center px-2 py-1 bg-charcoal/5 text-charcoal/60 text-[10px] tracking-wider font-bold capitalize"
                                    >
                                        {getLocalizedValue(tag.title, locale)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </GridSystem>
    )
}
