'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { Dialog } from '@base-ui/react'
import { useAnalytics } from '@/lib/analytics'

interface SearchResult {
    _id: string
    _type: string
    title: any // Localized title/name
    slug: string
    image?: any
    date?: string
}

const CATEGORIES = ['all', 'exhibition', 'artist', 'post', 'program', 'event'] as const
type Category = typeof CATEGORIES[number]

export function SearchModal({ isOpen, onClose, locale }: { isOpen: boolean; onClose: () => void; locale: string }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [activeCategory, setActiveCategory] = useState<Category>('all')
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const t = useTranslations('Search')
    const { trackEvent } = useAnalytics()

    // Context for animations
    const { contextSafe } = useGSAP({ scope: containerRef })

    // Animation: Result Entrance
    const animateResults = contextSafe(() => {
        gsap.fromTo('.search-result-item',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
                overwrite: true
            }
        )
    })

    // Handle search fetch
    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                const foundResults = data.results || []
                setResults(foundResults)

                if (foundResults.length > 0) {
                    trackEvent({
                        action: 'search_query',
                        category: 'discovery',
                        label: query,
                        value: foundResults.length
                    })
                }

                // Trigger animation after results are set
                setTimeout(animateResults, 50)
            } catch (err) {
                console.error('Search failed:', err)
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchResults, 300)
        return () => clearTimeout(timer)
    }, [query])

    // Cleanup state when closed
    useEffect(() => {
        if (!isOpen) {
            setQuery('')
            setResults([])
            setActiveCategory('all')
        }
    }, [isOpen])

    const getLocalizedTitle = (title: any) => {
        if (!title) return 'Untitled'
        if (typeof title === 'string') return title
        if (Array.isArray(title)) {
            return title.find((t: any) => t._key === locale)?.value || title[0]?.value || 'Untitled'
        }
        return 'Untitled'
    }

    const getRoute = (type: string, slug: string) => {
        switch (type) {
            case 'post': return `/channel/${slug}`
            case 'program': return `/education/${slug}`
            case 'artist': return `/artists/${slug}`
            case 'exhibition': return `/exhibitions/${slug}`
            case 'event': return `/events/${slug}`
            default: return `/${slug}`
        }
    }

    const filteredResults = activeCategory === 'all'
        ? results
        : results.filter(r => r._type === activeCategory)

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Popup
                    ref={containerRef}
                    className="fixed inset-0 z-[100] flex flex-col bg-background-dark text-white outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out duration-300"
                >
                    {/* Header */}
                    <div className="border-b border-white/10">
                        <div className="container mx-auto px-6 py-10 flex items-center justify-between">
                            <div className="flex-1 max-w-4xl relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={t('placeholder')}
                                    className="w-full bg-transparent text-4xl md:text-6xl font-bold tracking-tighter text-white outline-none placeholder:text-white/20"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                />
                                {isLoading && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <Dialog.Close
                                className="ml-8 text-white/90 hover:text-white flex flex-col items-center gap-1 group shrink-0"
                            >
                                <span className="text-[10px] capitalize tracking-widest font-bold">{t('close')}</span>
                                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                            </Dialog.Close>
                        </div>

                        {/* Category Filters */}
                        <div className="container mx-auto px-6 pb-6">
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setActiveCategory(cat)
                                            trackEvent({
                                                action: 'search_filter_change',
                                                category: 'discovery',
                                                label: cat
                                            })
                                            setTimeout(animateResults, 10)
                                        }}
                                        className={cn(
                                            "px-4 py-1.5 text-[10px] capitalize tracking-[0.2em] font-bold border transition-all duration-300",
                                            activeCategory === cat
                                                ? "bg-white text-background-dark border-white"
                                                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                                        )}
                                    >
                                        {t(`filter${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto pt-10 pb-20">
                        <div className="container mx-auto px-6 max-w-4xl">
                            {query.trim().length >= 2 && filteredResults.length === 0 && !isLoading && (
                                <div className="py-20 text-center text-white/40 italic text-xl">
                                    {t('noResults')} "{query}"
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-8">
                                {filteredResults.map((result) => (
                                    <Link
                                        key={result._id}
                                        href={getRoute(result._type, result.slug)}
                                        onClick={() => {
                                            trackEvent({
                                                action: 'search_result_click',
                                                category: 'discovery',
                                                label: `${result._type}: ${result.slug}`
                                            })
                                            onClose()
                                        }}
                                        className="search-result-item group flex items-center gap-6 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="w-20 h-20 relative bg-white/5 overflow-hidden shrink-0">
                                            {result.image ? (
                                                <Image
                                                    src={urlFor(result.image).width(160).height(160).url()}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20 capitalize font-bold tracking-widest">
                                                    {result._type}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] capitalize tracking-widest text-ochre font-bold mb-1">
                                                {result._type}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-ochre transition-colors">
                                                {getLocalizedTitle(result.title)}
                                            </h3>
                                            {result.date && (
                                                <span className="text-xs text-white/60 mt-1">
                                                    {new Date(result.date).toLocaleDateString(locale, { year: 'numeric', month: 'short' })}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
