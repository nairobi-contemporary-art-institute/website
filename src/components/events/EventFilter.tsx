"use client"

import { useState, useMemo } from "react"
import { EventCard } from "./EventCard"
import { CalendarView } from "./CalendarView"
import { cn } from "@/lib/utils"
import { LayoutGrid, Calendar } from "lucide-react"

interface EventFilterProps {
    events: any[]
    locale: string
}

export function EventFilter({ events, locale }: EventFilterProps) {
    const [view, setView] = useState<'grid' | 'calendar'>('grid')

    // Derive unique categories dynamically
    const categories = useMemo(() => {
        const unique = Array.from(new Set(events.map(e => e.eventType))).filter(Boolean).sort()
        return ['All', ...unique]
    }, [events])

    const [filter, setFilter] = useState('All')

    const filteredEvents = useMemo(() => {
        return filter === 'All'
            ? events
            : events.filter(e => e.eventType === filter)
    }, [events, filter])

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
            <div className="flex flex-col sm:flex-row gap-6 border-b border-rich-blue/10 pb-8 sticky top-20 bg-background/95 backdrop-blur z-20 transition-all">
                <div className="flex flex-wrap gap-3 flex-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={cn(
                                "px-5 py-2 text-[10px] font-bold capitalize tracking-[0.2em] transition-all border",
                                filter === cat
                                    ? "bg-charcoal text-off-white border-charcoal shadow-sm"
                                    : "bg-transparent text-charcoal/50 hover:text-charcoal border-charcoal/10 hover:border-charcoal/30"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 self-start sm:self-center">
                    <button
                        onClick={() => setView('grid')}
                        className={cn(
                            "p-2 transition-all",
                            view === 'grid' ? "bg-white text-charcoal shadow-sm" : "text-charcoal/40 hover:text-charcoal"
                        )}
                        aria-label="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={cn(
                            "p-2 transition-all",
                            view === 'calendar' ? "bg-white text-charcoal shadow-sm" : "text-charcoal/40 hover:text-charcoal"
                        )}
                        aria-label="Calendar View"
                    >
                        <Calendar className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {view === 'calendar' ? (
                <div className="animate-in fade-in duration-700">
                    <CalendarView events={filteredEvents} locale={locale} />
                </div>
            ) : (
                <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Upcoming Section */}
                    <section>
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-light tracking-tight">Upcoming</h2>
                            <span className="font-mono text-sm text-umber/40">({upcoming.length})</span>
                        </div>

                        {upcoming.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                                {upcoming.map(event => (
                                    <EventCard key={event._id} event={event} locale={locale} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center border border-dashed border-charcoal/10 bg-stone-50/50">
                                <p className="text-charcoal/30 font-mono capitalize tracking-[0.3em] text-[10px]">No upcoming events found</p>
                            </div>
                        )}
                    </section>

                    {/* Past Section */}
                    {past.length > 0 && (
                        <section className="pt-24 border-t border-rich-blue/10">
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-2xl font-light text-charcoal/40">Past Events</h2>
                                <div className="h-px flex-1 bg-rich-blue/10" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
                                {past.map(event => (
                                    <EventCard key={event._id} event={event} locale={locale} variant="compact" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}
