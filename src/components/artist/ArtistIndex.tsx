'use client'

import { useState, useMemo } from 'react'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

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
            displayName: getLocalizedValueAsString(artist.name, locale) || 'Untitled',
            firstLetter: (getLocalizedValueAsString(artist.name, locale)?.[0] || '#').toUpperCase()
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
        <div className="space-y-16">
            {/* A-Z Navigation */}
            <nav className="flex flex-wrap gap-4 border-b border-white/10 pb-12">
                <button
                    onClick={() => setActiveLetter(null)}
                    className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                        !activeLetter ? "text-white" : "text-white/20 hover:text-white"
                    )}
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
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                                activeLetter === letter ? "text-white" : 
                                hasArtists ? "text-white/20 hover:text-white" : "text-white/5 cursor-not-allowed"
                            )}
                        >
                            {letter}
                        </button>
                    )
                })}
            </nav>

            {/* Artists Grid - Minimalist typography grid matching Collection page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-2">
                {filteredArtists.map(artist => (
                    <Link
                        key={artist._id}
                        href={`/${locale}/artists/${artist.slug}`}
                        className="group flex flex-col pt-4 pb-6 border-b border-white/5 hover:border-white/20 transition-all"
                    >
                        <h3 className="text-2xl md:text-3xl text-white/60 group-hover:text-white transition-colors duration-300">
                            {artist.displayName}
                        </h3>
                    </Link>
                ))}
            </div>

            {filteredArtists.length === 0 && (
                <div className="py-24 text-center border-t border-white/5">
                    <p className="text-white/20 italic text-xl font-light">{t('noArtists')}</p>
                </div>
            )}
        </div>
    )
}
