"use client"

import { useState } from "react"
import { EducationCard } from "./EducationCard"
import { cn } from "@/lib/utils"

interface EducationFilterProps {
    programs: any[]
    locale: string
}

const AUDIENCE_FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Schools & Youth', value: 'youth' }, // Combining 'youth' and 'schools' if applicable? Schema has 'youth'
    { label: 'Families', value: 'children' },
    { label: 'Adults', value: 'adults' },
    { label: 'Professional', value: 'professionals' },
]

export function EducationFilter({ programs, locale }: EducationFilterProps) {
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all'
        ? programs
        : programs.filter(p => p.audience === filter || (filter === 'youth' && (p.audience === 'youth')))

    // Separate upcoming and past
    const now = new Date()
    const upcoming = filtered.filter(p => !p.endDate || new Date(p.endDate) >= now).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    const past = filtered.filter(p => p.endDate && new Date(p.endDate) < now).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())

    return (
        <div className="space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-4 sticky top-20 bg-background/95 backdrop-blur z-10">
                {AUDIENCE_FILTERS.map(f => (
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

            {/* Upcoming / Current */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-light tracking-tight">Current & Upcoming</h2>
                    <span className="font-mono text-sm text-umber">({upcoming.length})</span>
                </div>

                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {upcoming.map(prog => (
                            <EducationCard key={prog._id} program={prog} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-charcoal/20 bg-stone-50/50">
                        <p className="text-charcoal/40 font-mono uppercase tracking-widest text-sm">No current programs found</p>
                    </div>
                )}
            </section>

            {/* Archive */}
            {past.length > 0 && (
                <section className="pt-20 border-t border-charcoal/10">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-light text-charcoal/60">Archive</h2>
                        <div className="h-px flex-1 bg-charcoal/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-80 hover:opacity-100 transition-opacity">
                        {past.map(prog => (
                            <EducationCard key={prog._id} program={prog} locale={locale} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
