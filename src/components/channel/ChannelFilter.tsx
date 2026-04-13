"use client"

import { useState, useEffect } from "react"
import { ChannelCard } from "./ChannelCard"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface ChannelFilterProps {
    posts: any[]
    locale: string
}

export function ChannelFilter({ posts, locale }: ChannelFilterProps) {
    const t = useTranslations('Pages.channel')
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Get initial filter from URL or default to 'all'
    const initialType = searchParams.get('type') || 'all'
    const initialSeries = searchParams.get('series') || 'all'
    const [filter, setFilter] = useState(initialType)
    const [seriesFilter, setSeriesFilter] = useState(initialSeries)

    // Sync state if URL changes
    useEffect(() => {
        setFilter(searchParams.get('type') || 'all')
        setSeriesFilter(searchParams.get('series') || 'all')
    }, [searchParams])

    const handleFilterChange = (type: string, series: string = 'all') => {
        const params = new URLSearchParams(searchParams.toString())

        if (type === 'all') params.delete('type')
        else params.set('type', type)

        if (series === 'all') params.delete('series')
        else params.set('series', series)

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const MEDIA_FILTERS = [
        { label: t('filterAll'), value: 'all' },
        { label: t('filterWatch'), value: 'video' },
        { label: t('filterListen'), value: 'audio' },
        { label: t('filterRead'), value: 'article' },
    ]

    // Extract unique series from posts that have tags of type 'series'
    const availableSeries = Array.from(new Set(
        posts.flatMap(p => (p.tags || []))
            .filter(t => t.type === 'series')
            .map(t => JSON.stringify({ _id: t._id, slug: t.slug, title: t.title }))
    )).map(s => JSON.parse(s))

    const filtered = posts.filter(p => {
        const typeMatch = filter === 'all' || p.mediaType === filter || (filter === 'article' && !p.mediaType)
        const seriesMatch = seriesFilter === 'all' || (p.tags || []).some((t: any) => t.slug === seriesFilter)
        return typeMatch && seriesMatch
    })

    // Featured logic? For now, just first item if unfiltered, or maybe a dedicated featured flag in schema in future
    // Let's just list them all for now

    return (
        <div className="space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-col gap-6 border-b border-rich-blue/20 pb-4 sticky top-20 bg-background/95 backdrop-blur z-10">
                <div className="flex flex-wrap gap-2">
                    {MEDIA_FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => handleFilterChange(f.value, seriesFilter)}
                            className={cn(
                                "px-4 py-2 text-sm font-mono capitalize tracking-widest transition-all",
                                filter === f.value
                                    ? "bg-umber/10 text-umber font-bold border-b-2 border-umber"
                                    : "text-charcoal/60 hover:text-charcoal hover:bg-stone-50"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {availableSeries.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] capitalize tracking-widest text-charcoal/40 font-bold mr-2">Series:</span>
                        <button
                            onClick={() => handleFilterChange(filter, 'all')}
                            className={cn(
                                "px-3 py-1 text-[10px] capitalize tracking-widest font-bold border transition-all",
                                seriesFilter === 'all'
                                    ? "bg-charcoal text-white border-charcoal"
                                    : "text-charcoal/40 border-charcoal/10 hover:border-charcoal/30"
                            )}
                        >
                            All
                        </button>
                        {availableSeries.map((series: any) => (
                            <button
                                key={series._id}
                                onClick={() => handleFilterChange(filter, series.slug)}
                                className={cn(
                                    "px-3 py-1 text-[10px] capitalize tracking-widest font-bold border transition-all",
                                    seriesFilter === series.slug
                                        ? "bg-amber-800 text-white border-amber-800"
                                        : "text-charcoal/40 border-charcoal/10 hover:border-charcoal/30"
                                )}
                            >
                                {series.title ? (series.title.find((t: any) => t._key === locale)?.value || series.title[0]?.value) : 'Untitled'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filtered.map(post => (
                    <div key={post._id} className="group">
                        <ChannelCard post={post} locale={locale} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-32 text-center border border-dashed border-charcoal/20 bg-stone-50/50">
                    <p className="text-charcoal/40 font-mono capitalize tracking-widest text-sm">{t('noContent')}</p>
                </div>
            )}
        </div>
    )
}
