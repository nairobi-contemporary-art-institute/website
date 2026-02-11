"use client"

import { useState, useMemo } from "react"
import { EventCard } from "./EventCard"
import { cn } from "@/lib/utils"

interface EventFilterProps {
    events: any[]
    locale: string
}

export function EventFilter({ events, locale }: EventFilterProps) {
    // Derive unique categories dynamically
    const categories = useMemo(() => {
        const unique = Array.from(new Set(events.map(e => e.eventType))).filter(Boolean).sort()
        return ['All', ...unique]
    }, [events])

    const [filter, setFilter] = useState('All')

    const filteredEvents = filter === 'All'
        ? events
        : events.filter(e => e.eventType === filter)

    // Separate future/past for display
    const { upcoming, past } = useMemo(() => {
        const now = new Date()
        return {
            upcoming: filteredEvents
                .filter(e => new Date(e.endDate || e.startDate) >= now)
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
            past: filteredEvents
                .filter(e => new Date(e.endDate || e.startDate) < now)
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        }
    }, [filteredEvents])

    return (
        <div className="space-y-12">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 border-b border-charcoal/10 pb-6 sticky top-20 bg-background/95 backdrop-blur z-10 transition-all">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm uppercase tracking-widest transition-all",
                            filter === cat
                                ? "bg-charcoal text-off-white shadow-sm"
                                : "bg-transparent text-charcoal/60 hover:text-charcoal border border-charcoal/20 hover:border-charcoal/40"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Upcoming Section */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-light tracking-tight">Upcoming</h2>
                    <span className="font-mono text-sm text-umber">({upcoming.length})</span>
                </div>

                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {upcoming.map(event => (
                            <EventCard key={event._id} event={event} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-charcoal/20 rounded-lg bg-stone-50/50">
                        <p className="text-charcoal/40 font-mono uppercase tracking-widest text-sm">No upcoming events found</p>
                    </div>
                )}
            </section>

            {/* Past Section */}
            {past.length > 0 && (
                <section className="pt-20 border-t border-charcoal/10">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-light text-charcoal/60">Past Events</h2>
                        <div className="h-px flex-1 bg-charcoal/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {past.map(event => (
                            <EventCard key={event._id} event={event} locale={locale} variant="compact" />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
