"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { getLocalizedValue } from "@/sanity/lib/utils"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarViewProps {
    events: any[]
    locale: string
}

export function CalendarView({ events, locale }: CalendarViewProps) {
    const [viewDate, setViewDate] = useState(new Date())

    const monthName = viewDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
    const month = viewDate.getMonth()
    const year = viewDate.getFullYear()

    // Generate days for the grid
    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay() // 0 is Sunday

        const daysArray = []

        // Pad start
        for (let i = 0; i < startingDayOfWeek; i++) {
            daysArray.push({ day: null, date: null })
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i)
            const dayEvents = events.filter(e => {
                const eventDate = new Date(e.startDate)
                return (
                    eventDate.getDate() === i &&
                    eventDate.getMonth() === month &&
                    eventDate.getFullYear() === year
                )
            })
            daysArray.push({ day: i, date, events: dayEvents })
        }

        return daysArray
    }, [month, year, events])

    const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
    const prevMonth = () => setViewDate(new Date(year, month - 1, 1))

    return (
        <div className="bg-white border text-charcoal shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-light tracking-tight capitalize">
                    {monthName}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-stone-50 transition-colors border rounded-none"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-stone-50 transition-colors border rounded-none"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewDate(new Date())}
                        className="px-4 py-2 text-xs capitalize tracking-widest border hover:bg-stone-50 transition-colors"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b bg-stone-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-3 text-center text-[10px] capitalize tracking-[0.2em] font-bold text-charcoal/40">
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border-collapse">
                {days.map((item, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "min-h-[140px] border-r border-b p-3 transition-colors",
                            !item.day ? "bg-stone-50/30" : "hover:bg-stone-50/50"
                        )}
                    >
                        {item.day && (
                            <div className="space-y-4">
                                <span className={cn(
                                    "text-sm font-mono",
                                    item.date?.toDateString() === new Date().toDateString()
                                        ? "w-8 h-8 flex items-center justify-center bg-charcoal text-off-white"
                                        : "text-charcoal/40"
                                )}>
                                    {item.day}
                                </span>

                                <div className="space-y-2">
                                    {item.events?.map((event: any) => {
                                        const eventTitle = getLocalizedValue(event.title, locale)
                                        return (
                                            <Link
                                                key={event._id}
                                                href={`/${locale}/events/${event.slug}`}
                                                className="block p-2 text-[10px] leading-tight bg-umber/5 border-l-2 border-umber text-charcoal hover:bg-umber/10 transition-all font-medium"
                                            >
                                                <div className="font-mono text-[8px] capitalize tracking-wider text-umber mb-1">
                                                    {new Date(event.startDate).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </div>
                                                <div className="line-clamp-2 capitalize tracking-wide">
                                                    {eventTitle}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
