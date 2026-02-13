
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client, sanityFetch } from '@/sanity/lib/client'
import { ARTIST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { ArtistContent } from '@/components/artist/ArtistContent'

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    const artist = await sanityFetch<any>({
        query: ARTIST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`artist:${slug}`]
    })

    if (!artist) {
        return {
            title: 'Artist Not Found',
        }
    }

    const name = getLocalizedValue(artist.name, locale)
    const bioBlocks = getLocalizedValue<any>(artist.bio, locale)
    const description = typeof bioBlocks === 'string'
        ? bioBlocks
        : (bioBlocks ? portableTextToPlainText(bioBlocks) : `Artist profile for ${name}`)

    return {
        title: name,
        description,
        openGraph: {
            title: name,
            description,
            images: artist.image ? [urlFor(artist.image).width(1200).height(630).url()] : [],
        },
    }
}

export default async function ArtistPage({ params }: Props) {
    const { locale, slug } = await params
    const artist = await sanityFetch<any>({
        query: ARTIST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`artist:${slug}`]
    })

    if (!artist) {
        notFound()
    }

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <ArtistContent artist={artist} locale={locale} />

            <footer className="max-w-7xl mx-auto mt-48 pt-10 border-t border-charcoal/10">
                <Link href={`/${locale}/artists`} className="text-[10px] font-bold tracking-[0.3em] uppercase text-charcoal/40 hover:text-charcoal transition-colors">
                    ← Back to Artists Index
                </Link>
            </footer>
        </div>
    )
}
