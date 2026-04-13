"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { WhatsOnFilter } from "./WhatsOnFilter"
import { WhatsOnCalendar } from "./WhatsOnCalendar"
import { MuseumGrid } from "@/components/ui/MuseumGrid"
import { MuseumResultRow } from "@/components/ui/MuseumResultRow"
import { MuseumCardData } from "@/lib/types/museum-card"
import { getLocalizedValue } from "@/sanity/lib/utils"

interface WhatsOnClientProps {
    items: MuseumCardData[]
    categories?: string[]
    locale: string
    noticeBarSettings?: {
        enabled: boolean
        autoMondayClosing: boolean
        customStatus?: {
            label: any
            linkText: any
            linkUrl: string
        }
    }
}

export function WhatsOnClient({ items, locale, noticeBarSettings, categories = ["All", "Exhibitions", "Performances", "Screenings", "Events", "Talks", "Tours", "Workshops", "Members"] }: WhatsOnClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>("")
    const [activeTags, setActiveTags] = useState<string[]>([])
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | null>(null) // YYYY-MM-DD
    const [visibleArchiveCount, setVisibleArchiveCount] = useState(8)
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date()
        d.setDate(1)
        return d
    })

    // Extract unique categories and tags from items based ONLY on their taxonomy arrays
    const filterTags = ["Families", "Children", "Teens", "Groups", "Individuals", "Students", "Supported Access"]

    // Run once on mount to handle initial URL state
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const queryCat = params.get("category");
            if (queryCat) {
                // Find matching category (case-insensitive) from props
                const match = categories.find(c => c.toLowerCase() === queryCat.toLowerCase());
                if (match) setActiveCategory(match);
            }
        }
    }, [categories]);

    const handleTagChange = (tag: string, checked: boolean) => {
        setActiveTags(prev => 
            checked ? [...prev, tag] : prev.filter(t => t !== tag)
        )
    }

    // Prepare date lookup set for Calendar (what days have events/exh)
    const eventDates = useMemo(() => {
        const dates = new Set<string>()
        items.forEach(item => {
            if (item.rawStartDate) {
                const start = new Date(item.rawStartDate)
                // Just add start date for simplicity in calendar dots, 
                // but for exhibitions spanning months, should we add all days? 
                // That might be thousands of dates. For now, let's add start dates only, or current month spanning.
                const y = start.getFullYear()
                const m = String(start.getMonth() + 1).padStart(2, '0')
                const d = String(start.getDate()).padStart(2, '0')
                dates.add(`${y}-${m}-${d}`)
            }
        })
        return dates
    }, [items])

    // Filter items based on active states
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Category Match
            let passesCategory = true;
            if (activeCategory && activeCategory !== "All") {
                // simple substring check across label and tags
                const searchStr = `${item.label} ${item.tags.join(' ')}`.toLowerCase()
                passesCategory = searchStr.includes(activeCategory.toLowerCase())
            }

            // Tag Match
            let passesTags = true;
            if (activeTags.length > 0) {
                // Must have at least one matching tag, or all? Let's say all selected tags must match
                const searchStr = `${item.label} ${item.tags.join(' ')}`.toLowerCase()
                passesTags = activeTags.every(tag => searchStr.includes(tag.toLowerCase()))
            }

            // Month Range Match (DEPRECATED: We want the list to show everything by default even when calendar is open)
            let passesMonth = true;
            // Removed aggressive filtering to keep Current/Upcoming/Archive visible when browsing the calendar grid

            // Date Match (Specific day)
            let passesDate = true;
            if (selectedDate) {
                // active if selectedDate falls between start and end date
                const targetTime = new Date(selectedDate).getTime()
                const startTime = item.rawStartDate ? new Date(item.rawStartDate).getTime() : 0
                const endTime = item.rawEndDate ? new Date(item.rawEndDate).getTime() : startTime
                
                if (startTime > 0) {
                    passesDate = targetTime >= startTime && targetTime <= endTime
                }
            }

            return passesCategory && passesTags && passesMonth && passesDate
        })
    }, [items, activeCategory, activeTags, selectedDate, isCalendarOpen, baseDate])

    const nowTime = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return today.getTime()
    }, [])

    const currentItems = useMemo(() => {
        return filteredItems.filter(item => {
            const start = item.rawStartDate ? new Date(item.rawStartDate).getTime() : 0
            const end = item.rawEndDate ? new Date(item.rawEndDate).getTime() : start || nowTime + 1
            return start <= nowTime && end >= nowTime
        })
    }, [filteredItems, nowTime])

    const upcomingItems = useMemo(() => {
        return filteredItems.filter(item => {
            const start = item.rawStartDate ? new Date(item.rawStartDate).getTime() : 0
            return start > nowTime
        }).sort((a, b) => {
            const startA = a.rawStartDate ? new Date(a.rawStartDate).getTime() : 0
            const startB = b.rawStartDate ? new Date(b.rawStartDate).getTime() : 0
            return startA - startB
        })
    }, [filteredItems, nowTime])

    const archiveItems = useMemo(() => {
        return filteredItems.filter(item => {
            const start = item.rawStartDate ? new Date(item.rawStartDate).getTime() : 0
            const end = item.rawEndDate ? new Date(item.rawEndDate).getTime() : start
            return end > 0 && end < nowTime
        }).sort((a, b) => {
            const endA = a.rawEndDate ? new Date(a.rawEndDate).getTime() : (a.rawStartDate ? new Date(a.rawStartDate).getTime() : 0)
            const endB = b.rawEndDate ? new Date(b.rawEndDate).getTime() : (b.rawStartDate ? new Date(b.rawStartDate).getTime() : 0)
            return endB - endA 
        })
    }, [filteredItems, nowTime])

    const handlePrevDay = useMemo(() => () => {
        const d = selectedDate ? new Date(selectedDate) : new Date()
        d.setDate(d.getDate() - 1)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        setSelectedDate(`${y}-${m}-${day}`)
    }, [selectedDate])

    const handleNextDay = useMemo(() => () => {
        const d = selectedDate ? new Date(selectedDate) : new Date()
        d.setDate(d.getDate() + 1)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        setSelectedDate(`${y}-${m}-${day}`)
    }, [selectedDate])

    // Format Selected Date Display (Stepper & Notice)
    const dateDisplay = useMemo(() => {
        if (!selectedDate) return null;
        
        const d = new Date(selectedDate)
        const monthShort = d.toLocaleDateString(locale, { month: 'short' }).toUpperCase()
        const monthLong = d.toLocaleDateString(locale, { month: 'long' })
        const day = d.getDate()
        const weekday = d.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase()
        
        // Notice logic from Sanity Settings
        const config = noticeBarSettings || { enabled: true, autoMondayClosing: true }
        
        const isMonday = d.getDay() === 1
        const showAutoClosing = config.autoMondayClosing && isMonday
        const customLabel = config.customStatus?.label ? getLocalizedValue(config.customStatus.label, locale) : null
        const customLinkText = config.customStatus?.linkText ? getLocalizedValue(config.customStatus.linkText, locale) : null
        const customLinkUrl = config.customStatus?.linkUrl

        return (
            <div className="w-full mb-12 flex flex-col items-center bg-[#f9f9f9]">
                {/* Stepper Header */}
                <div className="w-full flex justify-between items-center py-6 border-b border-[#eee]">
                    <button onClick={handlePrevDay} className="p-2 text-black hover:text-[#666] transition-colors">
                        <ArrowLeft className="w-6 h-6 font-light" strokeWidth={1} />
                    </button>
                    <span className="font-bold text-sm tracking-[0.1em]">{monthShort} {day}</span>
                    <button onClick={handleNextDay} className="p-2 text-black hover:text-[#666] transition-colors">
                        <ArrowRight className="w-6 h-6 font-light" strokeWidth={1} />
                    </button>
                </div>
                
                {/* Notice Bar */}
                {config.enabled && (
                    <div className="w-full py-4 px-4 flex justify-between items-center text-sm md:text-base border-b border-[#eee]">
                        {showAutoClosing || customLabel ? (
                            <>
                                <span className="font-bold">
                                    {customLabel || `CLOSED ON ${weekday}`}
                                    <span className="font-normal text-[#666] ml-2">{monthLong} {day}</span>
                                </span>
                                <span className="text-[#666] text-xs md:text-sm">
                                    {customLabel ? (
                                        customLinkUrl && <a href={customLinkUrl} className="underline underline-offset-4">{customLinkText || 'Learn more'}</a>
                                    ) : (
                                        <>See <a href="/visit" className="underline underline-offset-4">opening hours</a> for more information.</>
                                    )}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="font-bold">{weekday}</span>
                                <span className="text-[#666]">{monthLong} {day}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        )
    }, [selectedDate, locale, noticeBarSettings, handleNextDay, handlePrevDay])


    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* The Filter Bar */}
            <div className="relative z-20 border-b border-[#1a1a1a]/10">
                <WhatsOnFilter 
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    tags={filterTags}
                    activeTags={activeTags}
                    onTagChange={handleTagChange}
                    isCalendarOpen={isCalendarOpen}
                    onCalendarToggle={() => setIsCalendarOpen(!isCalendarOpen)}
                />
            </div>

            {/* Results Section */}
            <div className="flex-1 bg-stone-50 transition-colors pt-8">
                {dateDisplay}
                
                {currentItems.length > 0 && (
                    <div id="current">
                        <MuseumResultRow 
                            title="Current" 
                            items={currentItems} 
                            className="py-8 border-b-0" 
                        />
                    </div>
                )}

                {upcomingItems.length > 0 && (
                    <div id="upcoming">
                        <MuseumResultRow 
                            title="Upcoming" 
                            items={upcomingItems} 
                            className="py-8 border-b-0 border-[#1a1a1a]/10" 
                        />
                    </div>
                )}

                {/* Expanding Calendar Section between Upcoming and Archive */}
                <AnimatePresence>
                    {isCalendarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="bg-black origin-top overflow-hidden"
                        >
                            <WhatsOnCalendar 
                                eventDates={eventDates}
                                selectedDate={selectedDate}
                                locale={locale}
                                onMonthChange={setBaseDate}
                                onDateSelect={(date) => {
                                    setSelectedDate(date === selectedDate ? null : date) // toggle
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {archiveItems.length > 0 && (
                    <div id="archive" className="w-full py-16 pb-24 md:pb-32 lg:pb-40">
                        <div className="container mb-8">
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#1a1a1a]/10 pb-4 gap-4">
                                <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#1a1a1a]">
                                    Archive
                                </h2>
                                <span className="text-sm md:text-base text-[#1a1a1a]/60 font-medium shrink-0">
                                    {archiveItems.length} {archiveItems.length === 1 ? 'result' : 'results'}
                                </span>
                            </div>
                        </div>

                        <div className="container">
                            <MuseumGrid 
                                items={archiveItems.slice(0, visibleArchiveCount)} 
                                showFilters={false}
                                gridColumns="grid-cols-1 min-[501px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1291px]:grid-cols-4"
                                cardAspectRatio="aspect-[3/4]"
                                gridGap="gap-4"
                            />
                            
                            {visibleArchiveCount < archiveItems.length && (
                                <div className="mt-12 flex justify-center">
                                    <button 
                                        onClick={() => setVisibleArchiveCount(prev => prev + 8)}
                                        className="border border-[#1a1a1a] text-[#1a1a1a] uppercase text-xs font-bold tracking-widest px-8 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}
