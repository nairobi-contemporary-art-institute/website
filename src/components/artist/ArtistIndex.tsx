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
    const [scope, setScope] = useState<'all' | 'exhibited' | 'collection'>('all')

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    const processedArtists = useMemo(() => {
        return artists.map(artist => ({
            ...artist,
            displayName: getLocalizedValueAsString(artist.name, locale) || 'Untitled',
            firstLetter: (getLocalizedValueAsString(artist.name, locale)?.[0] || '#').toUpperCase()
        })).sort((a, b) => a.displayName.localeCompare(b.displayName))
    }, [artists, locale])

    const scopedArtists = useMemo(() => {
        if (scope === 'exhibited') return processedArtists.filter(a => a.exhibited)
        if (scope === 'collection') return processedArtists.filter(a => a.inCollection)
        return processedArtists
    }, [processedArtists, scope])

    const filteredArtists = useMemo(() => {
        if (!activeLetter) return scopedArtists
        return scopedArtists.filter(artist => artist.firstLetter === activeLetter)
    }, [scopedArtists, activeLetter])

    const lettersWithArtists = useMemo(() => {
        const set = new Set(scopedArtists.map(a => a.firstLetter))
        return set
    }, [scopedArtists])

    return (
        <div className="space-y-16">
            {/* Scope filter: an artist can be in both */}
            <div role="group" aria-label={t('filterLabel')} className="flex flex-wrap gap-6 text-sm font-bold">
                {(['all', 'exhibited', 'collection'] as const).map(key => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={scope === key}
                        onClick={() => { setScope(key); setActiveLetter(null) }}
                        className={cn(
                            "transition-colors underline-offset-8",
                            scope === key ? "text-white underline" : "text-white/50 hover:text-white"
                        )}
                    >
                        {t(`filter.${key}`)}
                    </button>
                ))}
            </div>

            {/* A-Z Navigation */}
            <nav aria-label="Artist index" className="flex flex-wrap gap-4 border-b border-white/10 pb-12">
                <button
                    onClick={() => setActiveLetter(null)}
                    className={cn(
                        "text-sm font-black uppercase tracking-widest transition-all",
                        !activeLetter ? "text-white" : "text-white/60 hover:text-white"
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
                                "text-sm font-black uppercase tracking-widest transition-all",
                                activeLetter === letter ? "text-white" : 
                                hasArtists ? "text-white/60 hover:text-white" : "text-white/15 cursor-not-allowed"
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
                        <h2 className="text-2xl md:text-3xl text-white/60 group-hover:text-white transition-colors duration-300">
                            {artist.displayName}
                        </h2>
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
