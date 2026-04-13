import { sanityFetch } from '@/sanity/lib/client'
import { COLLECTION_QUERY, COLLECTION_PAGE_QUERY } from '@/sanity/lib/queries'
import { GridSystem } from '@/components/ui/Grid/Grid'
import { Metadata } from 'next'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { PortableText } from '@/components/ui/PortableText'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const pageData = await sanityFetch<any>({ query: COLLECTION_PAGE_QUERY, tags: ['collectionPage'] })

    if (!pageData) {
        const t = await getTranslations({ locale, namespace: 'Pages.collection' })
        return {
            title: t('title'),
            description: t('description'),
        }
    }

    const title = getLocalizedValueAsString(pageData.title, locale) || 'Collection'
    const descriptionBlocks = getLocalizedValue<any>(pageData.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : 'Digital Collection Archive at NCAI')

    return {
        title,
        description,
    }
}

export default async function CollectionPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.collection' })

    const [pageData, allWorks] = await Promise.all([
        sanityFetch<any>({ query: COLLECTION_PAGE_QUERY, tags: ['collectionPage'] }),
        sanityFetch<any[]>({ query: COLLECTION_QUERY, tags: ['collectionItem'] })
    ])

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale)

    const featuredItems = pageData?.featuredItems || []
    const featuredIds = new Set(featuredItems.map((item: any) => item._id))
    const regularWorks = allWorks.filter(work => !featuredIds.has(work._id))

    const renderWorkCard = (work: any, isFeatured = false) => {
        const workTitle = getLocalizedValue(work.title, locale) || t('untitled')
        const artistName = getLocalizedValue(work.artistName, locale) || t('unknownArtist')

        return (
            <Link
                key={work._id}
                href={`/${locale}/collection/${work.slug || ''}`}
                className={`group space-y-6 ${isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
                <div className={`relative bg-charcoal/5 overflow-hidden ${isFeatured ? 'aspect-[4/3]' : 'aspect-square'}`}>
                    {work.mainImage?.asset ? (
                        <Image
                            src={urlFor(work.mainImage).width(isFeatured ? 1200 : 800).height(isFeatured ? 900 : 800).url()}
                            alt={workTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes={isFeatured ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                            {...(work.mainImage?.asset?.metadata?.lqip && {
                                placeholder: 'blur',
                                blurDataURL: work.mainImage.asset.metadata.lqip
                            })}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal/20">{t('noImage')}</div>
                    )}
                    {isFeatured && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-ivory text-charcoal text-[10px] capitalize tracking-widest px-2 py-1 font-bold">
                                Featured
                            </span>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className={`${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold text-charcoal leading-tight italic group-hover:underline decoration-charcoal/20 transition-all`}>
                        {workTitle}
                    </h3>
                    <div className="space-y-1">
                        <p className={`${isFeatured ? 'text-lg' : 'text-sm'} font-medium text-charcoal`}>{artistName}</p>
                        <p className={`${isFeatured ? 'text-sm' : 'text-xs'} text-charcoal/60`}>
                            {getLocalizedValue(work.medium, locale)}
                            {work.creationDate && `, ${work.creationDate}`}
                        </p>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-24">
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-charcoal leading-none capitalize">
                        {title}
                    </h1>
                    {description ? (
                        <div className="mt-8 text-xl md:text-2xl text-charcoal/70 max-w-3xl leading-relaxed">
                            <PortableText value={description} locale={locale} />
                        </div>
                    ) : (
                        <p className="mt-6 text-xl text-charcoal/60 max-w-2xl leading-relaxed">
                            {t('description')}
                        </p>
                    )}
                </header>

                {/* Featured Items Section */}
                {featuredItems.length > 0 && (
                    <section className="px-section-clamp mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {featuredItems.map((item: any) => renderWorkCard(item, true))}
                        </div>
                        <div className="mt-16 h-px w-full bg-charcoal/10" />
                    </section>
                )}

                {/* Main Collection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {regularWorks.map((work: any) => renderWorkCard(work))}
                </div>

                {allWorks.length === 0 && (
                    <div className="py-24 text-center border-t border-charcoal/10">
                        <p className="text-charcoal/40 italic">{t('noItems')}</p>
                    </div>
                )}
            </main>
        </GridSystem>
    )
}
