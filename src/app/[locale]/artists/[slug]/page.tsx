import { sanityFetch } from '@/sanity/lib/client'
import { ARTIST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { GridSystem } from '@/components/ui/Grid/Grid'
import { ArtistContent } from '@/components/artist/ArtistContent'
import { Metadata } from 'next'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { notFound } from 'next/navigation'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import { locales } from '@/i18n'

export async function generateStaticParams() {
    const documents = await sanityFetch<any[]>({
        query: SITEMAP_QUERY,
        tags: ['artist']
    })
    const artists = documents.filter(doc => doc._type === 'artist' && doc.slug)

    return locales.flatMap((locale) =>
        artists.map((artist) => ({
            locale,
            slug: artist.slug,
        }))
    )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params
    const artist = await sanityFetch<any>({
        query: ARTIST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`artist:${slug}`]
    })
    if (!artist) return {}

    const name = getLocalizedValue(artist.name, locale)

    return {
        title: name,
        description: `Artist profile for ${name} at NCAI.`,
    }
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
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
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-24">
                <ArtistContent artist={artist} locale={locale} />
            </main>
        </GridSystem>
    )
}
