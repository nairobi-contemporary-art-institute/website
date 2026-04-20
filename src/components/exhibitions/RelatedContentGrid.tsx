'use client'

import React from 'react'
import { ExhibitionCard } from './ExhibitionCard'
import { EventCard } from '@/components/events/EventCard'
import { GridRoot as Grid } from '@/components/ui/Grid/Grid'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'

import { ChannelCard } from '@/components/channel/ChannelCard'

interface RelatedContentGridProps {
    items: any[]
    locale: string
    title?: string
    className?: string
}

export function RelatedContentGrid({ items, locale, title = "Related Content", className }: RelatedContentGridProps) {
    if (!items || items.length === 0) return null

    return (
        <section className={cn("py-32", className)}>
            <div className="flex flex-col gap-4 mb-16">
                <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-umber/40">
                    Explore More
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-charcoal">
                    {title}
                </h2>
            </div>
            
            <Grid columns={{ sm: 1, md: 2, lg: 4 }} gap={8}>
                {items.map((item) => {
                    const type = item._type
                    
                    if (type === 'exhibition') {
                        return (
                            <div key={item._id}>
                                <ExhibitionCard exhibition={item} locale={locale} />
                            </div>
                        )
                    }
                    
                    if (type === 'event') {
                        return (
                            <div key={item._id}>
                                <EventCard event={item} locale={locale} />
                            </div>
                        )
                    }

                    if (type === 'post') {
                        return (
                            <div key={item._id}>
                                <ChannelCard post={item} locale={locale} />
                            </div>
                        )
                    }

                    // Fallback for other types
                    return (
                        <div key={item._id} className="group block space-y-4">
                            <div className="aspect-[4/3] bg-charcoal/5" />
                             <h3 className="font-bold text-charcoal">
                                 {typeof (item.title || item.name) === 'string' 
                                    ? (item.title || item.name) 
                                    : getLocalizedValue(item.title || item.name, locale)}
                             </h3>
                            <p className="text-xs uppercase tracking-widest text-umber/50">{type}</p>
                        </div>
                    )
                })}
            </Grid>
        </section>
    )
}
