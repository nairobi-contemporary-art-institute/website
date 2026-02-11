
import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { ARTISTS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Link from 'next/link'
import Image from 'next/image'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.artists?.title || 'Artists',
    }
}

export default async function ArtistsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getMessages({ locale }) as any
    const artists = await client.fetch(ARTISTS_QUERY)

    // Improve grouping if list is long, but simple list for now as per plan "Simple A-Z list"

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t.Pages?.artists?.title || 'Artists'}
                </h1>
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
                            <div className="aspect-square relative bg-charcoal/5 overflow-hidden rounded-full grayscale group-hover:grayscale-0 transition-all duration-500">
                                {artist.image ? (
                                    <Image
                                        src={urlFor(artist.image).width(400).height(400).url()}
                                        alt={name || 'Artist Image'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : ( // Fallback initial or icon
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-light text-umber/20">
                                        {name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-lg font-bold text-charcoal group-hover:text-indigo-600 transition-colors">
                                    {name || 'Untitled'}
                                </h2>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {artists.length === 0 && (
                <div className="py-20 text-center text-umber/40 italic">
                    No artists found.
                </div>
            )}
        </div>
    )
}
