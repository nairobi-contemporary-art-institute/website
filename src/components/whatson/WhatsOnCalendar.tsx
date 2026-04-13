"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface WhatsOnCalendarProps {
    eventDates: Set<string> // Set of date strings in YYYY-MM-DD format
    selectedDate: string | null // YYYY-MM-DD
    onDateSelect: (dateStr: string) => void
    onMonthChange?: (baseDate: Date) => void
    locale?: string
}

// Helper: formats a JS Date to "YYYY-MM-DD" local time safely
function toDateString(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export function WhatsOnCalendar({
    eventDates,
    selectedDate,
    onDateSelect,
    onMonthChange,
    locale = 'en-US'
}: WhatsOnCalendarProps) {
    // Start with the current month as the first of the 3 months
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date()
        d.setDate(1) // lock to 1st of month to avoid overflow issues
        return d
    })

    const handlePrev = () => {
        setBaseDate(prev => {
            const next = new Date(prev)
            next.setMonth(next.getMonth() - 1)
            onMonthChange?.(next)
            return next
        })
    }

    const handleNext = () => {
        setBaseDate(prev => {
            const next = new Date(prev)
            next.setMonth(next.getMonth() + 1)
            onMonthChange?.(next)
            return next
        })
    }

    // Generate arrays for the 3 months
    const months = useMemo(() => {
        const generated = []
        for (let m = 0; m < 3; m++) {
            const currentMonthDate = new Date(baseDate)
            currentMonthDate.setMonth(currentMonthDate.getMonth() + m)
            
            const monthIndex = currentMonthDate.getMonth()
            const yearIndex = currentMonthDate.getFullYear()

            const monthName = currentMonthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
            
            // Generate grid
            const firstDay = new Date(yearIndex, monthIndex, 1)
            const lastDay = new Date(yearIndex, monthIndex + 1, 0)
            
            const startingDayOfWeek = firstDay.getDay() // 0 is Sunday, 1 is Monday...
            // Shift to Make Monday = 0
            const shiftedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

            const daysArray = []
            // Pad empty slots before start
            for (let i = 0; i < shiftedStart; i++) {
                daysArray.push(null)
            }
            // Add actual days
            for (let i = 1; i <= lastDay.getDate(); i++) {
                daysArray.push(new Date(yearIndex, monthIndex, i))
            }
            generated.push({
                name: monthName,
                days: daysArray
            })
        }
        return generated
    }, [baseDate, locale])

    const isToday = (dStr: string) => dStr === toDateString(new Date())

    const isTodayMonth = useMemo(() => {
        const now = new Date()
        return baseDate.getMonth() === now.getMonth() && baseDate.getFullYear() === now.getFullYear()
    }, [baseDate])

    return (
        <div className="bg-black text-white w-full border-t border-[#333] pb-12 overflow-x-auto relative">
            {/* Absolute navigation arrows on the right (for desktop view matching the screenshot) */}
            <div className="absolute top-8 right-8 hidden lg:flex gap-4">
                <button 
                    onClick={handlePrev}
                    disabled={isTodayMonth}
                    className={cn(
                        "p-1 transition-colors",
                        isTodayMonth ? "text-[#333] cursor-not-allowed" : "text-[#666] hover:text-white"
                    )}
                >
                    <ArrowLeft className="w-8 h-8 font-light" strokeWidth={1} />
                </button>
                <button 
                    onClick={handleNext}
                    className="p-1 text-[#666] hover:text-white transition-colors"
                >
                    <ArrowRight className="w-8 h-8 font-light" strokeWidth={1} />
                </button>
            </div>

            <div className="container pt-8">
                
                {/* Mobile Navigation */}
                <div className="flex lg:hidden justify-end gap-4 mb-4">
                    <button 
                        onClick={handlePrev} 
                        disabled={isTodayMonth}
                        className={cn(
                            "p-1 transition-colors",
                            isTodayMonth ? "text-[#333] cursor-not-allowed" : "text-[#666] hover:text-white"
                        )}
                    >
                        <ArrowLeft className="w-6 h-6" strokeWidth={1} />
                    </button>
                    <button onClick={handleNext} className="p-1 text-[#666] hover:text-white transition-colors">
                        <ArrowRight className="w-6 h-6" strokeWidth={1} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
                    {months.map((monthData, idx) => (
                        <div key={idx} className="flex-1 min-w-[280px]">
                            {/* Month Header */}
                            <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide">
                                {monthData.name}
                            </h3>
                            
                            {/* Days Header */}
                            <div className="grid grid-cols-7 mb-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="text-center text-[#666] text-xs font-medium">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-y-4">
                                {monthData.days.map((dateObj, i) => {
                                    if (!dateObj) {
                                        return <div key={`empty-${i}`} />
                                    }
                                    const dateStr = toDateString(dateObj)
                                    const hasEvent = eventDates.has(dateStr)
                                    const isSelected = selectedDate === dateStr
                                    const isCurrentToday = isToday(dateStr)
                                    
                                    return (
                                        <div key={dateStr} className="flex items-center justify-center">
                                            <button
                                                onClick={() => onDateSelect(dateStr)}
                                                className={cn(
                                                    "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm md:text-base font-mono transition-all",
                                                    (isSelected || isCurrentToday) 
                                                        ? "bg-white text-black font-bold" 
                                                        : hasEvent
                                                            ? "bg-transparent border border-white text-white font-bold"
                                                            : "bg-transparent text-[#666] hover:text-white"
                                                )}
                                            >
                                                {dateObj.getDate()}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
