import { sanityFetch } from '@/sanity/lib/client'
import { COLLECTION_QUERY, COLLECTION_PAGE_QUERY, ARTISTS_INDEX_QUERY } from '@/sanity/lib/queries'
import { GridSystem } from '@/components/ui/Grid/Grid'
import { Metadata } from 'next'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { PortableText } from '@/components/ui/PortableText'
import { CollectionClient } from '@/components/collection/CollectionClient'

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

    const [pageData, allWorks, allArtists] = await Promise.all([
        sanityFetch<any>({ query: COLLECTION_PAGE_QUERY, tags: ['collectionPage'] }),
        sanityFetch<any[]>({ query: COLLECTION_QUERY, tags: ['collectionItem'] }),
        sanityFetch<any[]>({ query: ARTISTS_INDEX_QUERY, tags: ['artist'] })
    ])

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale)

    return (
        <div className="bg-[#0A0A0A] min-h-screen text-white">
            <GridSystem unstable_useContainer>
                <main className="pt-64 pb-24">
                    <header className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                                {title}
                            </h1>
                        </div>
                        {description && (
                            <div className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed prose-invert pt-4">
                                <PortableText value={description} locale={locale} />
                            </div>
                        )}
                    </header>

                    <CollectionClient 
                        locale={locale} 
                        items={allWorks} 
                        artists={allArtists}
                    />
                </main>
            </GridSystem>
        </div>
    )
}
