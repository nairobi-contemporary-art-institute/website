'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@/i18n'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

interface SearchResult {
    _id: string
    _type: string
    title: any // Localized title/name
    slug: string
    image?: any
    date?: string
}

const CATEGORIES = ['all', 'exhibition', 'artist', 'post', 'program'] as const
type Category = typeof CATEGORIES[number]

export function SearchModal({ isOpen, onClose, locale }: { isOpen: boolean; onClose: () => void; locale: string }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [activeCategory, setActiveCategory] = useState<Category>('all')
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const t = useTranslations('Search')

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

    // Focus input when modal opens and handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)

            // Entrance animation for modal
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            )
        } else {
            document.body.style.overflow = ''
            setQuery('')
            setResults([])
            setActiveCategory('all')
        }
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

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
                setResults(data.results || [])
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

    if (!isOpen) return null

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
            default: return `/${slug}`
        }
    }

    const filteredResults = activeCategory === 'all'
        ? results
        : results.filter(r => r._type === activeCategory)

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col bg-ivory"
            role="dialog"
            aria-modal="true"
            aria-label={t('modalLabel')}
        >
            {/* Header */}
            <div className="border-b border-umber/10">
                <div className="container mx-auto px-6 py-10 flex items-center justify-between">
                    <div className="flex-1 max-w-4xl relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-4xl md:text-6xl font-bold tracking-tighter text-umber outline-none placeholder:text-umber/20"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {isLoading && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                <div className="w-8 h-8 border-2 border-umber/20 border-t-umber rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-8 text-umber/90 hover:text-umber flex flex-col items-center gap-1 group shrink-0"
                    >
                        <span className="text-[10px] uppercase tracking-widest font-bold">{t('close')}</span>
                        <div className="w-10 h-10 rounded-full border border-umber/20 flex items-center justify-center group-hover:border-umber transition-colors">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Category Filters */}
                <div className="container mx-auto px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat)
                                    setTimeout(animateResults, 10)
                                }}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all duration-300",
                                    activeCategory === cat
                                        ? "bg-umber text-ivory border-umber"
                                        : "bg-transparent text-umber/60 border-umber/10 hover:border-umber/30 hover:text-umber"
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
                        <div className="py-20 text-center text-umber/40 italic text-xl">
                            {t('noResults')} "{query}"
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-8">
                        {filteredResults.map((result) => (
                            <Link
                                key={result._id}
                                href={getRoute(result._type, result.slug)}
                                onClick={onClose}
                                className="search-result-item group flex items-center gap-6 p-4 rounded-sm hover:bg-umber/5 transition-colors border-b border-umber/5 last:border-0"
                            >
                                <div className="w-20 h-20 relative bg-charcoal/5 overflow-hidden shrink-0">
                                    {result.image ? (
                                        <Image
                                            src={urlFor(result.image).width(160).height(160).url()}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-umber/20 uppercase font-bold tracking-widest">
                                            {result._type}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold mb-1">
                                        {result._type}
                                    </span>
                                    <h3 className="text-2xl font-bold text-charcoal leading-tight group-hover:text-amber-900 transition-colors">
                                        {getLocalizedTitle(result.title)}
                                    </h3>
                                    {result.date && (
                                        <span className="text-xs text-umber/90 mt-1">
                                            {new Date(result.date).toLocaleDateString(locale, { year: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
