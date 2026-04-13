import { sanityFetch } from '@/sanity/lib/client'
import { ARTISTS_INDEX_QUERY, ARTISTS_PAGE_QUERY } from '@/sanity/lib/queries'
import { GridSystem } from '@/components/ui/Grid/Grid'
import { ArtistIndex } from '@/components/artist/ArtistIndex'
import { Metadata } from 'next'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const pageData = await sanityFetch<any>({ query: ARTISTS_PAGE_QUERY, tags: ['artistsPage'] })

    if (!pageData) {
        return {
            title: locale === 'en' ? 'Artists' : 'Wasanii',
            description: 'Artists associated with Nairobi Contemporary Art Institute.',
        }
    }

    const title = getLocalizedValueAsString(pageData.title, locale) || 'Artists'
    const descriptionBlocks = getLocalizedValue<any>(pageData.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : 'Artists associated with NCAI')

    return {
        title,
        description,
    }
}

export default async function ArtistsPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.artists' })

    const [pageData, artists] = await Promise.all([
        sanityFetch<any>({ query: ARTISTS_PAGE_QUERY, tags: ['artistsPage'] }),
        sanityFetch<any[]>({ query: ARTISTS_INDEX_QUERY, tags: ['artist'] })
    ])

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale)

    return (
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-24">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-charcoal leading-none capitalize">
                        {title}
                    </h1>
                    {description && (
                        <div className="mt-8 text-xl md:text-2xl text-charcoal/70 max-w-3xl leading-relaxed">
                            <PortableText value={description} locale={locale} />
                        </div>
                    )}
                </header>

                <ArtistIndex artists={artists} locale={locale} />
            </main>
        </GridSystem>
    )
}
