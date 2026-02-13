import { type Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { ARTISTS_QUERY, ARTISTS_PAGE_QUERY } from '@/sanity/lib/queries'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextComponent } from '@/components/ui/PortableText'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.artists' })

    const pageData = await sanityFetch<any>({
        query: ARTISTS_PAGE_QUERY,
        tags: ['artistsPage']
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

export default async function ArtistsPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.artists' })
    const messages = await getMessages({ locale }) as any

    const [artists, pageData] = await Promise.all([
        client.fetch(ARTISTS_QUERY),
        sanityFetch<any>({ query: ARTISTS_PAGE_QUERY, tags: ['artistsPage'] })
    ])

    const header = pageData?.header
    const headline = getLocalizedValue(header?.headline, locale) || t('title')

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-4xl mb-24 space-y-8">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal uppercase leading-[0.85]">
                    {headline}
                </h1>
                {header?.description && (
                    <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                        <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                    </div>
                )}
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {artists.map((artist: any) => {
                    const name = getLocalizedValue(artist.name, locale)

                    return (
                        <Link
                            key={artist._id}
                            href={`/${locale}/artists/${artist.slug}`}
                            className="group block space-y-4"
                        >
                            <div className="aspect-square relative bg-charcoal/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                {artist.image ? (
                                    <Image
                                        src={urlFor(artist.image).width(400).height(400).url()}
                                        alt={name || 'Artist Image'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-light text-umber/10 bg-stone-50">
                                        {name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-charcoal group-hover:text-amber-900 transition-colors uppercase tracking-tight">
                                    {name || 'Untitled'}
                                </h2>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {artists.length === 0 && (
                <div className="py-40 text-center text-umber/30 font-mono uppercase tracking-[0.3em] text-xs">
                    No artists found.
                </div>
            )}
        </div>
    )
}
