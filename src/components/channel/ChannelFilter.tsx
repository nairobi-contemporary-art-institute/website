"use client"

import { useState } from "react"
import { ChannelCard } from "./ChannelCard"
import { cn } from "@/lib/utils"

interface ChannelFilterProps {
    posts: any[]
    locale: string
}

const MEDIA_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Watch (Video)', value: 'video' },
    { label: 'Listen (Audio)', value: 'audio' },
    { label: 'Read (Articles)', value: 'article' },
]

export function ChannelFilter({ posts, locale }: ChannelFilterProps) {
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all'
        ? posts
        : posts.filter(p => p.mediaType === filter || (filter === 'article' && !p.mediaType)) // Default to article if no mediaType

    // Featured logic? For now, just first item if unfiltered, or maybe a dedicated featured flag in schema in future
    // Let's just list them all for now

    return (
        <div className="space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-rich-blue/20 pb-4 sticky top-20 bg-background/95 backdrop-blur z-10">
                {MEDIA_FILTERS.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={cn(
                            "px-4 py-2 text-sm font-mono uppercase tracking-widest transition-all",
                            filter === f.value
                                ? "bg-umber/10 text-umber font-bold border-b-2 border-umber"
                                : "text-charcoal/60 hover:text-charcoal hover:bg-stone-50"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
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
                    <p className="text-charcoal/40 font-mono uppercase tracking-widest text-sm">No content found</p>
                </div>
            )}
        </div>
    )
}
