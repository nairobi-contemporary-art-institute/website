'use client'

import { useState, useMemo } from 'react'
import { getLocalizedValue } from '@/sanity/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useTranslations } from 'next-intl'

interface ArtistIndexProps {
    artists: any[]
    locale: string
}

export function ArtistIndex({ artists, locale }: ArtistIndexProps) {
    const t = useTranslations('Pages.artists')
    const [activeLetter, setActiveLetter] = useState<string | null>(null)

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    const processedArtists = useMemo(() => {
        return artists.map(artist => ({
            ...artist,
            displayName: getLocalizedValue(artist.name, locale) || 'Untitled',
            firstLetter: (getLocalizedValue(artist.name, locale)?.[0] || '#').toUpperCase()
        })).sort((a, b) => a.displayName.localeCompare(b.displayName))
    }, [artists, locale])

    const filteredArtists = useMemo(() => {
        if (!activeLetter) return processedArtists
        return processedArtists.filter(artist => artist.firstLetter === activeLetter)
    }, [processedArtists, activeLetter])

    const lettersWithArtists = useMemo(() => {
        const set = new Set(processedArtists.map(a => a.firstLetter))
        return set
    }, [processedArtists])

    return (
        <div className="space-y-12">
            {/* A-Z Navigation */}
            <nav className="flex flex-wrap gap-2 md:gap-4 border-b border-charcoal/10 pb-8">
                <button
                    onClick={() => setActiveLetter(null)}
                    className={`text-sm font-medium transition-colors ${!activeLetter ? 'text-charcoal border-b-2 border-charcoal' : 'text-charcoal/40 hover:text-charcoal'}`}
                >
                    {locale === 'en' ? 'ALL' : 'ZOTE'}
                </button>
                {alphabet.map(letter => {
                    const hasArtists = lettersWithArtists.has(letter)
                    return (
                        <button
                            key={letter}
                            disabled={!hasArtists}
                            onClick={() => setActiveLetter(letter)}
                            className={`text-sm font-medium transition-colors ${activeLetter === letter
                                ? 'text-charcoal border-b-2 border-charcoal'
                                : hasArtists
                                    ? 'text-charcoal/40 hover:text-charcoal'
                                    : 'text-charcoal/10 cursor-not-allowed'
                                }`}
                        >
                            {letter}
                        </button>
                    )
                })}
            </nav>

            {/* Artists Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                {filteredArtists.map(artist => (
                    <Link
                        key={artist._id}
                        href={`/${locale}/artists/${artist.slug}`}
                        className="group space-y-4"
                    >
                        <div className="aspect-[3/4] relative bg-charcoal/5 overflow-hidden">
                            {artist.image?.asset ? (
                                <Image
                                    src={urlFor(artist.image).width(600).height(800).url()}
                                    alt={artist.displayName}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    {...(artist.image.asset.metadata?.lqip && {
                                        placeholder: 'blur',
                                        blurDataURL: artist.image.asset.metadata.lqip
                                    })}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-4xl font-bold">
                                    {artist.firstLetter}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-charcoal leading-tight transition-colors group-hover:text-charcoal/60">
                            {artist.displayName}
                        </h3>
                    </Link>
                ))}
            </div>

            {filteredArtists.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-charcoal/40 italic">{t('noArtists')}</p>
                </div>
            )}
        </div>
    )
}
