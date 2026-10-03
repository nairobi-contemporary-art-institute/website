"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@/i18n"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { WhatsOnFilter } from "./WhatsOnFilter"
import { WhatsOnCalendar } from "./WhatsOnCalendar"
import { MuseumGrid } from "@/components/ui/MuseumGrid"
import { MuseumResultRow } from "@/components/ui/MuseumResultRow"
import { MuseumCardData } from "@/lib/types/museum-card"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { cn } from "@/lib/utils"

const ARCHIVE_PAGE = 12

interface WhatsOnClientProps {
    items: MuseumCardData[]
    categories?: string[]
    locale: string
    showYearNav?: boolean
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

export function WhatsOnClient({ items, locale, noticeBarSettings, showYearNav = false, categories = ["All", "Exhibitions", "Performances", "Screenings", "Events", "Talks", "Tours", "Workshops", "Members"] }: WhatsOnClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>("")
    const [activeTags, setActiveTags] = useState<string[]>([])
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string | null>(null) // YYYY-MM-DD
    const [visibleArchiveCount, setVisibleArchiveCount] = useState(ARCHIVE_PAGE)
    const [activeYear, setActiveYear] = useState<number | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)
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
            const passesMonth = true;
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

    // Derive the year an archived item belongs to (prefer end date, fall back to start).
    const yearOf = (item: MuseumCardData): number | null => {
        const d = item.rawEndDate || item.rawStartDate
        return d ? new Date(d).getFullYear() : null
    }

    // All distinct archive years, newest first — powers the year jump rail.
    const archiveYears = useMemo(() => {
        const set = new Set<number>()
        archiveItems.forEach(item => {
            const y = yearOf(item)
            if (y) set.add(y)
        })
        return Array.from(set).sort((a, b) => b - a)
    }, [archiveItems])

    const visibleArchive = useMemo(
        () => archiveItems.slice(0, visibleArchiveCount),
        [archiveItems, visibleArchiveCount]
    )

    // Split the currently-visible archive slice into consecutive year groups.
    const archiveGroups = useMemo(() => {
        const groups: { year: number | null; items: MuseumCardData[] }[] = []
        visibleArchive.forEach(item => {
            const y = yearOf(item)
            const last = groups[groups.length - 1]
            if (last && last.year === y) last.items.push(item)
            else groups.push({ year: y, items: [item] })
        })
        return groups
    }, [visibleArchive])

    // Infinite scroll: auto-load the next page when the sentinel enters view.
    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleArchiveCount(prev => Math.min(prev + ARCHIVE_PAGE, archiveItems.length))
                }
            },
            { rootMargin: '600px 0px' }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [archiveItems.length, visibleArchiveCount])

    // Reset pagination when the filtered set changes.
    useEffect(() => {
        setVisibleArchiveCount(ARCHIVE_PAGE)
    }, [activeCategory, activeTags, selectedDate])

    // Highlight the year currently in view in the rail.
    useEffect(() => {
        if (!showYearNav) return
        const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-year-header]'))
        if (headers.length === 0) return
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveYear(Number((entry.target as HTMLElement).dataset.yearHeader))
                    }
                })
            },
            { rootMargin: '-15% 0px -75% 0px' }
        )
        headers.forEach(h => obs.observe(h))
        return () => obs.disconnect()
    }, [showYearNav, archiveGroups])

    // Jump to a year: ensure its items are loaded, then scroll to the anchor.
    const jumpToYear = (year: number) => {
        let lastIdx = -1
        for (let i = 0; i < archiveItems.length; i++) {
            if (yearOf(archiveItems[i]) === year) lastIdx = i
        }
        if (lastIdx + 1 > visibleArchiveCount) {
            setVisibleArchiveCount(lastIdx + 1)
        }
        setActiveYear(year)
        requestAnimationFrame(() => {
            setTimeout(() => {
                document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 60)
        })
    }

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
                                        <>See <Link href="/visit" className="underline underline-offset-4">opening hours</Link> for more information.</>
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
                            <div className={cn(showYearNav && "flex gap-8 lg:gap-12 items-start")}>
                                {showYearNav && archiveYears.length > 0 && (
                                    <nav aria-label="Jump to year" className="hidden md:block sticky top-28 shrink-0 w-16 lg:w-20 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                        <ul className="space-y-3">
                                            {archiveYears.map(y => (
                                                <li key={y}>
                                                    <button
                                                        onClick={() => jumpToYear(y)}
                                                        className={cn(
                                                            "text-sm font-bold tracking-widest transition-colors",
                                                            activeYear === y ? "text-[#1a1a1a] underline underline-offset-4" : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                                                        )}
                                                    >
                                                        {y}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                )}

                                <div className="flex-1 min-w-0">
                                    {showYearNav && archiveYears.length > 0 && (
                                        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 mb-6 border-b border-[#1a1a1a]/10">
                                            {archiveYears.map(y => (
                                                <button
                                                    key={y}
                                                    onClick={() => jumpToYear(y)}
                                                    className={cn(
                                                        "shrink-0 text-sm font-bold tracking-widest transition-colors",
                                                        activeYear === y ? "text-[#1a1a1a] underline underline-offset-4" : "text-[#1a1a1a]/40"
                                                    )}
                                                >
                                                    {y}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {showYearNav ? (
                                        <div className="space-y-16">
                                            {archiveGroups.map(group => (
                                                <div key={group.year ?? 'undated'} id={group.year ? `year-${group.year}` : undefined}>
                                                    {group.year && (
                                                        <h3
                                                            data-year-header={group.year}
                                                            className="scroll-mt-28 text-3xl md:text-5xl font-black tracking-tighter text-[#1a1a1a] mb-6"
                                                        >
                                                            {group.year}
                                                        </h3>
                                                    )}
                                                    <MuseumGrid
                                                        items={group.items}
                                                        showFilters={false}
                                                        gridColumns="grid-cols-1 min-[501px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1291px]:grid-cols-4"
                                                        cardAspectRatio="aspect-[3/4]"
                                                        gridGap="gap-4"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <MuseumGrid
                                            items={visibleArchive}
                                            showFilters={false}
                                            gridColumns="grid-cols-1 min-[501px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1291px]:grid-cols-4"
                                            cardAspectRatio="aspect-[3/4]"
                                            gridGap="gap-4"
                                        />
                                    )}

                                    {visibleArchiveCount < archiveItems.length && (
                                        <div ref={sentinelRef} className="mt-12 flex justify-center">
                                            <span className="text-xs uppercase tracking-widest text-[#1a1a1a]/40 animate-pulse">
                                                Loading more…
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}
