'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { useTranslations } from 'next-intl'
import { ArtTooltip } from '@/components/ui/ArtTooltip'
import { cn } from '@/lib/utils'

interface CollectionItem {
    _id: string;
    title: any;
    slug: string;
    creationDate?: string;
    year?: string;
    medium?: any;
    mainImage?: any;
    artistName?: string;
    onLoan?: boolean;
    onDisplay?: boolean;
    displayLocation?: any;
    artist?: {
        name: any;
        slug?: string;
    }
}

interface CollectionClientProps {
    locale: string;
    items: CollectionItem[];
    artists: any[];
}

export function CollectionClient({ locale, items, artists }: CollectionClientProps) {
    const t = useTranslations('Pages.collection')
    const [view, setView] = useState<'collection' | 'artists'>('collection')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterArtist, setFilterArtist] = useState('')
    const [filterMedium, setFilterMedium] = useState('')
    const [filterYear, setFilterYear] = useState('')
    const [onlyWithImages, setOnlyWithImages] = useState(false)
    const [sortBy, setSortBy] = useState<'random' | 'az'>('random')
    const [isMounted, setIsMounted] = useState(false)
    const [shuffledPool, setShuffledPool] = useState<CollectionItem[]>([])

    React.useEffect(() => {
        setIsMounted(true)
        // Fisher-Yates shuffle for a stable random pool
        const pool = [...items]
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]]
        }
        setShuffledPool(pool)
    }, [items])

    // Derived data for filters
    const mediums = useMemo(() => {
        const set = new Set<string>()
        items.forEach(item => {
            const m = getLocalizedValue(item.medium, locale)
            if (m) set.add(m)
        })
        return Array.from(set).sort()
    }, [items, locale])

    const years = useMemo(() => {
        const set = new Set<string>()
        items.forEach(item => {
            const y = item.creationDate || item.year
            if (y) {
                // Try to extract year if it's a string like "c. 1994"
                const match = y.match(/\d{4}/)
                if (match) set.add(match[0])
                else set.add(y)
            }
        })
        return Array.from(set).sort((a, b) => b.localeCompare(a))
    }, [items])

    const filteredItems = useMemo(() => {
        const source = (isMounted && sortBy === 'random') ? shuffledPool : items

        const list = source.filter(item => {
            const title = getLocalizedValue(item.title, locale)?.toLowerCase() || ''
            const artist = (getLocalizedValue(item.artist?.name, locale) || item.artistName || '').toLowerCase()
            const medium = getLocalizedValue(item.medium, locale) || ''
            const year = item.creationDate || item.year || ''
            
            const matchesSearch = title.includes(searchQuery.toLowerCase()) || artist.includes(searchQuery.toLowerCase())
            const matchesArtist = !filterArtist || artist.includes(filterArtist.toLowerCase())
            const matchesMedium = !filterMedium || medium === filterMedium
            const matchesYear = !filterYear || year.includes(filterYear)
            const matchesImages = !onlyWithImages || !!item.mainImage

            return matchesSearch && matchesArtist && matchesMedium && matchesYear && matchesImages
        })

        if (sortBy === 'az') {
            return [...list].sort((a, b) => {
                const titleA = getLocalizedValue(a.title, locale) || ''
                const titleB = getLocalizedValue(b.title, locale) || ''
                return titleA.localeCompare(titleB)
            })
        }

        return list
    }, [items, shuffledPool, locale, searchQuery, filterArtist, filterMedium, filterYear, onlyWithImages, sortBy, isMounted])

    const sortedArtists = useMemo(() => {
        return [...artists].sort((a, b) => {
            const nameA = getLocalizedValue(a.name, locale) || ''
            const nameB = getLocalizedValue(b.name, locale) || ''
            return nameA.localeCompare(nameB)
        })
    }, [artists, locale])

    const reShuffle = () => {
        setSortBy('random')
        const pool = [...items]
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]]
        }
        setShuffledPool(pool)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setFilterArtist('')
        setFilterMedium('')
        setFilterYear('')
        setOnlyWithImages(false)
        setSortBy('random') // Also reset to random exploration
    }

    return (
        <div className="space-y-12">
            {/* Upper Action Bar: Tabs (Left) and Search (Right) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('collection')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300",
                            (!isMounted || view === 'collection') ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                        )}
                    >
                        {t('title') || 'Collection'}
                    </button>
                    <button
                        onClick={() => setView('artists')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300",
                            (isMounted && view === 'artists') ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                        )}
                    >
                        {t('artistsAZ') || 'Artists A-Z'}
                    </button>
                </div>

                {(isMounted && view === 'collection') && (
                    <div className="w-full md:max-w-xl relative group">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder') || "Search collection"}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-light text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
                        />
                        <div className="absolute right-0 bottom-5 text-white">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15.8033 15.8033M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {(isMounted && view === 'collection') && (
                <>
                    {/* Filters Row */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
                            <FilterDropdown
                                label="Artist"
                                value={filterArtist}
                                options={sortedArtists.map(a => getLocalizedValue(a.name, locale)).filter((n): n is string => !!n)}
                                onChange={setFilterArtist}
                                allLabel={t('allLabel', { label: 'Artist' })}
                            />
                            {/* Artwork Title search can be handled by Search, but let's keep it as an option if desired */}
                            <div className="border-b border-white/20 py-2 text-white/20 text-sm font-medium tracking-wide">
                                Artwork Title
                            </div>
                            <FilterDropdown
                                label="Category"
                                value={filterMedium}
                                options={mediums}
                                onChange={setFilterMedium}
                                allLabel={t('allLabel', { label: 'Category' })}
                            />
                            <FilterDropdown
                                label="Year"
                                value={filterYear}
                                options={years}
                                onChange={setFilterYear}
                                allLabel={t('allLabel', { label: 'Year' })}
                            />
                        </div>

                        {/* Footer Filter Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">FILTER BY:</span>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={onlyWithImages}
                                            onChange={(e) => setOnlyWithImages(e.target.checked)}
                                        />
                                        <div className={cn(
                                            "w-5 h-5 border transition-all duration-300",
                                            onlyWithImages ? "bg-white border-white" : "bg-[#2A2A2A] border-white/10 group-hover:border-white/40"
                                        )} />
                                        {onlyWithImages && (
                                            <svg className="absolute inset-0 m-auto text-black" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                                        Works with images
                                    </span>
                                </label>

                                <div className="h-4 w-[1px] bg-white/10" />

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center gap-3 group/btn">
                                        <button 
                                            onClick={reShuffle}
                                            className="p-4 text-white/40 hover:text-white transition-all bg-white/5 rounded-full hover:bg-white/10"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover/btn:rotate-180 transition-transform duration-500">
                                                <path d="M4 4V9H4.58152M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.49944 20 7.26677 18.8527 5.7998 17.0558M20 20V15H19.4185M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover/btn:text-white/60 transition-colors">
                                            {t('shuffleWorks') || 'Shuffle Works'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group/btn">
                                        <button 
                                            onClick={() => setSortBy('az')}
                                            className={cn(
                                                "p-4 transition-all rounded-full",
                                                sortBy === 'az' ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                                            )}
                                        >
                                            <span className="text-[12px] font-black">A–Z</span>
                                        </button>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover/btn:text-white/60 transition-colors">
                                            {t('sortAZ') || 'Alphabetise'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 group/btn">
                                <button 
                                    onClick={resetFilters}
                                    className="p-4 text-white/40 hover:text-white transition-all bg-white/5 rounded-full hover:bg-white/10"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover/btn:-rotate-180 transition-transform duration-500">
                                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2235 2 18.0481 3.52352 19.8284 5.82843M19.8284 5.82843V1M19.8284 5.82843H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 group-hover/btn:text-white/60 transition-colors">
                                    {t('resetFilters') || 'Reset Filters'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid - Using columns for true masonry */}
                    <div className="columns-1 md:columns-2 lg:columns-4 gap-8 [column-fill:_balance]">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => (
                                <WorkCard key={item._id} item={item} locale={locale} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="py-48 text-center border-t border-white/5">
                            <p className="text-white/20 italic text-xl">{t('noFilteredResults')}</p>
                            <button onClick={resetFilters} className="mt-8 text-white/60 hover:text-white border-b border-white/20 pb-1 text-sm uppercase tracking-widest">{t('clearFilters')}</button>
                        </div>
                    )}
                </>
            )}

            {(isMounted && view === 'artists') && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {sortedArtists.map((artist) => (
                        <Link 
                            key={artist._id} 
                            href={`/${locale}/artists/${artist.slug}`}
                            className="text-xl md:text-2xl text-white/60 hover:text-white transition-colors duration-300 py-2 border-b border-white/5"
                        >
                            {getLocalizedValue(artist.name, locale)}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

function FilterDropdown({ label, value, options, onChange, allLabel }: { label: string, value: string, options: string[], onChange: (v: string) => void, allLabel: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative group">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="w-full flex items-center justify-between border-b border-white/20 py-2 text-white/60 hover:text-white focus:text-white transition-colors"
            >
                <span className="text-sm font-medium tracking-wide truncate">{value || label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}>
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/5 shadow-2xl z-[100] max-h-64 overflow-y-auto"
                    >
                        <button 
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest text-white/40 hover:bg-white hover:text-black transition-colors"
                        >
                            {allLabel}
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={cn(
                                    "w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors",
                                    value === opt ? "bg-white text-black" : "text-white/60 hover:bg-white hover:text-black"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function WorkCard({ item, locale, index }: { item: CollectionItem, locale: string, index: number }) {
    const tCol = useTranslations('Pages.collection')
    const title = getLocalizedValue(item.title, locale) || 'Untitled'
    const artistName = (getLocalizedValue(item.artist?.name, locale) || item.artistName || '')
    const date = item.creationDate || item.year || ''
    const image = item.mainImage
    const hasStatus = item.onDisplay || item.onLoan
    const displayLocation = getLocalizedValue(item.displayLocation, locale)
    
    // Explicitly use metadata for height/width if available to avoid cropping
    const imgMetadata = image?.asset?.metadata?.dimensions
    const aspectRatio = imgMetadata?.aspectRatio || 1

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: (index % 12) * 0.05 }}
            className="break-inside-avoid mb-16 group"
        >
            <Link href={`/${locale}/collection/${item.slug}`} className="space-y-6 block">
                <div className="relative bg-white/5 overflow-hidden">
                    {image?.asset ? (
                        <div style={{ aspectRatio: aspectRatio }}>
                            <Image
                                src={urlFor(image).width(800).url()}
                                alt={title}
                                width={imgMetadata?.width || 800}
                                height={imgMetadata?.height || 800}
                                className="w-full h-auto group-hover:scale-105 transition-transform duration-700 ease-out"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        </div>
                    ) : (
                        <div className="aspect-[4/5] w-full h-full flex items-center justify-center text-white/10 text-[10px] uppercase tracking-widest">
                            {tCol('noImageAvailable')}
                        </div>
                    )}

                    {hasStatus && (
                        <div className="absolute top-4 right-4 z-10">
                            <ArtTooltip 
                                content={
                                    <div className="flex flex-col gap-1">
                                        {item.onDisplay && (
                                            <p className="font-bold flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                {displayLocation ? tCol('onDisplayAt', { location: displayLocation }) : tCol('currentlyOnDisplay')}
                                            </p>
                                        )}
                                        {item.onLoan && (
                                            <p className="font-bold flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                {tCol('outOnLoan')}
                                            </p>
                                        )}
                                    </div>
                                }
                            >
                                <div className="w-3 h-3 rounded-full bg-white/40 ring-4 ring-black/40 shadow-lg" />
                            </ArtTooltip>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-white/70 transition-colors italic leading-tight uppercase tracking-tight">
                        {title}
                    </h3>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/60">{artistName}</p>
                        <p className="text-xs text-white/40 uppercase tracking-widest">
                            {getLocalizedValue(item.medium, locale)}
                            {date && ` / ${date}`}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
