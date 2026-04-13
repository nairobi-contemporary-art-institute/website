'use client'

import React, { useRef, useState, useMemo } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { PortableTextComponent } from '@/components/ui/PortableText'
import { useAnalytics } from '@/lib/analytics'

interface TimelineEvent {
    _id: string
    year: string
    title: any
    description: any
    media: any
    variant?: string
}

interface ImmersiveTimelineProps {
    events: TimelineEvent[]
    locale: string
}

const ERA_COLORS = {
    early: 'bg-charcoal',
    mid: 'bg-[#1a1a1a]',
    modern: 'bg-[#0f1113]',
    future: 'bg-black'
}

export function ImmersiveTimeline({ events, locale }: ImmersiveTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const scrollContentRef = useRef<HTMLDivElement>(null)
    const { isReducedMotion } = useAccessibility()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
    const { trackEvent } = useAnalytics()

    // Group events by decade for the navigator
    const decades = useMemo(() => {
        const d: { [key: string]: number } = {}
        events.forEach((e, idx) => {
            const decade = e.year.substring(0, 3) + '0s'
            if (!(decade in d)) d[decade] = idx
        })
        return Object.entries(d).map(([label, index]) => ({ label, index }))
    }, [events])

    useGSAP(() => {
        if (isReducedMotion || events.length === 0) return

        const sections = gsap.utils.toArray('.timeline-event')
        const bgYears = gsap.utils.toArray('.bg-year-parallax')

        // Main horizontal scroll orchestration
        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: pinRef.current,
                pin: true,
                scrub: 1.5, // Meatier scrub for premium feel
                snap: {
                    snapTo: 1 / (events.length - 1),
                    duration: { min: 0.1, max: 0.3 },
                    delay: 0.1,
                    ease: "power2.inOut"
                },
                end: () => `+=${events.length * 100}%`,
                onUpdate: (self) => {
                    const idx = Math.round(self.progress * (events.length - 1))
                    if (idx !== currentIndex) setCurrentIndex(idx)

                    // Update progress bar width
                    gsap.to('.progress-active', {
                        width: `${self.progress * 100}%`,
                        duration: 0.1,
                        overwrite: true
                    })
                }
            }
        })

        // Animations for each section
        mainTl.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none"
        })

        // Parallax for background years (moving at different speed)
        bgYears.forEach((bgYear: any, i) => {
            gsap.to(bgYear, {
                x: -200, // Move slower than content
                ease: "none",
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            })
        })

        // Entrance animation
        gsap.from('.timeline-header', {
            y: -50,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.5
        })

    }, { scope: containerRef, dependencies: [events, isReducedMotion] })

    const scrollToEvent = (index: number) => {
        const totalScroll = events.length * window.innerHeight // Assuming end is events.length * 100%
        window.scrollTo({
            top: (index / (events.length - 1)) * totalScroll,
            behavior: 'smooth'
        })
    }

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-charcoal text-ivory">
                <p className="text-ivory font-mono tracking-widest animate-pulse capitalize">Entering Digital Wing...</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="bg-charcoal text-ivory selection:bg-ochre selection:text-charcoal relative">
            {/* Immersive Header */}
            <div className="timeline-header fixed top-0 left-0 right-0 p-6 md:px-12 md:py-12 flex justify-between items-start z-50 pointer-events-none">
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <h1>
                        <Link href="/" className="text-3xl font-black tracking-tighter hover:text-ochre transition-all duration-500">NCAI / WING</Link>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-ochre/40" />
                        <span className="text-[9px] capitalize tracking-[0.5em] text-ivory/40 font-bold">Spatial History Repository</span>
                    </div>
                </div>

                <div className="flex items-center gap-16 pointer-events-auto">
                    {/* Decade Scrubber */}
                    <nav className="hidden xl:flex items-center gap-8">
                        {decades.map((d) => (
                            <button
                                key={d.label}
                                onClick={() => {
                                    scrollToEvent(d.index)
                                    trackEvent({
                                        action: 'timeline_decade_click',
                                        category: 'engagement',
                                        label: d.label
                                    })
                                }}
                                aria-label={`Jump to ${d.label}`}
                                className={cn(
                                    "text-[10px] font-bold tracking-[0.4em] capitalize transition-all duration-500 hover:text-ochre relative py-2",
                                    events[currentIndex].year.startsWith(d.label.substring(0, 3))
                                        ? "text-ochre scale-110"
                                        : "text-ivory/20"
                                )}
                            >
                                {d.label}
                                {events[currentIndex].year.startsWith(d.label.substring(0, 3)) && (
                                    <div className="absolute -bottom-1 left-0 w-full h-px bg-ochre" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <Link
                        href="/"
                        className="group flex items-center gap-4 bg-ivory/5 hover:bg-ochre px-8 py-4 border border-ivory/10 hover:border-ochre transition-all duration-500 rounded-full"
                        onClick={() => trackEvent({ action: 'timeline_exit', category: 'engagement', label: 'header' })}
                    >
                        <span className="text-[10px] font-bold capitalize tracking-[0.4em] group-hover:text-charcoal transition-colors">Exit Wing</span>
                        <X className="w-5 h-5 group-hover:rotate-90 group-hover:text-charcoal transition-all duration-500" />
                    </Link>
                </div>
            </div>

            {/* Horizontal Repository */}
            <div ref={pinRef} className="h-screen overflow-hidden bg-[#0a0a0a]">
                {/* Global Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
                    {/* Decorative Curvilinear Path - Mirrored from Teaser */}
                    <svg className="absolute -bottom-24 left-0 w-full h-[600px] opacity-[0.03] text-ivory" viewBox="0 0 1440 600" fill="none">
                        <path d="M-100 450C200 450 400 150 720 150C1040 150 1240 450 1540 450" stroke="currentColor" strokeWidth="2" />
                        <path d="M-100 480C200 480 400 180 720 180C1040 180 1240 480 1540 480" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>

                <div className="flex h-full w-[1000%]">
                    {events.map((event, i) => {
                        const title = getLocalizedValue(event.title, locale)
                        const description = getLocalizedValue(event.description, locale)
                        const isLightVariant = event.variant === 'primary'

                        return (
                            <section
                                key={event._id}
                                className="timeline-event w-screen h-full flex items-center justify-center px-6 md:px-24 py-32 shrink-0 relative overflow-hidden"
                            >
                                {/* Giant Ghost Year - More subtle and integrated */}
                                <div className="bg-year-parallax absolute top-1/2 left-1/4 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[35vw] font-black tracking-tighter leading-none italic select-none">
                                    {event.year}
                                </div>

                                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center relative z-10">
                                    {/* Left: Media & Exploration */}
                                    <div className="relative order-2 lg:order-1">
                                        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-charcoal">
                                            {event.media?.asset ? (
                                                <Image
                                                    src={urlFor(event.media).width(1600).url()}
                                                    alt={title || 'Timeline Event'}
                                                    fill
                                                    className="object-cover transition-transform duration-[2s] scale-110 group-hover:scale-100"
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    priority={i < 2}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                    <LogoIcon className="w-48 h-48" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                            {/* Media Action */}
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event)
                                                    trackEvent({
                                                        action: 'timeline_event_view',
                                                        category: 'engagement',
                                                        label: `${event.year}: ${getLocalizedValueAsString(event.title, locale)}`
                                                    })
                                                }}
                                                aria-label="View event details"
                                                className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-ivory text-charcoal flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 hover:scale-110 active:scale-95"
                                            >
                                                <Maximize2 className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Captions / Meta info floating below media */}
                                        <div className="mt-8 flex gap-12">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold capitalize tracking-widest text-ochre">Collection Ref</span>
                                                <span className="text-xs font-mono opacity-40 capitalize tracking-tighter">ARCH-00{i + 1}-EP{event.year}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold capitalize tracking-widest text-ochre">Location</span>
                                                <span className="text-xs font-mono opacity-40 capitalize tracking-tighter">Nairobi, KE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="order-1 lg:order-2 space-y-14 lg:pl-12 border-l border-white/5">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-px bg-ochre" />
                                                <span className="text-2xl font-black text-ochre tracking-tight font-mono">{event.year}</span>
                                            </div>
                                            <h2 className="text-6xl md:text-[8rem] font-black leading-[0.8] tracking-tighter capitalize break-words">
                                                {getLocalizedValueAsString(event.title, locale)}
                                            </h2>
                                        </div>

                                        <div className="text-xl md:text-2xl text-ivory/50 leading-relaxed font-light max-w-lg">
                                            {description ? (
                                                typeof description === 'string' ? description : portableTextToPlainText(description)
                                            ) : "A pivotal moment in the artistic development of the region, defining the framework for generations of spatial and conceptual practice."}
                                        </div>

                                        <button
                                            onClick={() => setSelectedEvent(event)}
                                            className="inline-flex items-center gap-4 text-xs font-bold capitalize tracking-[0.3em] group"
                                        >
                                            <span className="group-hover:text-ochre transition-colors">View Details</span>
                                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-ochre group-hover:bg-ochre group-hover:text-charcoal transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>

            {/* Global Controls & Floor */}
            <div className="fixed bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col gap-8 pointer-events-none z-50">
                <div className="flex justify-between items-end">
                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pointer-events-auto">
                        <button
                            onClick={() => scrollToEvent(Math.max(0, currentIndex - 1))}
                            aria-label="Previous historical event"
                            className="w-14 h-14 border border-ivory/20 flex items-center justify-center hover:bg-ochre hover:border-ochre hover:text-charcoal transition-all disabled:opacity-20"
                            disabled={currentIndex === 0}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scrollToEvent(Math.min(events.length - 1, currentIndex + 1))}
                            aria-label="Next historical event"
                            className="w-14 h-14 border border-ivory/20 flex items-center justify-center hover:bg-ochre hover:border-ochre hover:text-charcoal transition-all disabled:opacity-20"
                            disabled={currentIndex === events.length - 1}
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-right">
                        <div className="flex items-baseline gap-4">
                            <span className="text-[10vw] font-black opacity-[0.05] leading-none select-none">
                                {((currentIndex + 1) / events.length * 100).toFixed(0)}%
                            </span>
                            <span className="text-6xl font-black text-ochre/20 tracking-tighter tabular-nums leading-none">
                                {events[currentIndex].year}
                            </span>
                        </div>
                        <div className="text-[10px] font-bold capitalize tracking-[0.5em] text-ochre pl-2">
                            Phase {currentIndex + 1} / {events.length}
                        </div>
                    </div>
                </div>

                {/* Progress Bar Line */}
                <div
                    className="w-full h-px bg-white/10 relative pointer-events-auto cursor-pointer group"
                    role="scrollbar"
                    aria-label="Timeline progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(((currentIndex + 1) / events.length) * 100)}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const pct = x / rect.width
                        const idx = Math.round(pct * (events.length - 1))
                        scrollToEvent(idx)
                    }}>
                    <div className="progress-active absolute top-0 left-0 h-1 bg-ochre transition-all duration-300" style={{ width: '0%' }} />
                    <div className="absolute -top-1 right-0 text-[8px] font-mono opacity-30">END ARCHIVE</div>
                </div>
            </div>

            {/* Event Detail Modal (Deep Dive) */}
            {
                selectedEvent && (
                    <div className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            aria-label="Close event details"
                            className="fixed top-10 right-10 w-16 h-16 flex items-center justify-center text-ivory hover:text-ochre transition-colors z-[110]"
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 animate-in fade-in zoom-in duration-500">
                            <div className="relative aspect-square md:aspect-[3/4] bg-black/40 border border-white/10">
                                {selectedEvent.media?.asset && (
                                    <Image
                                        src={urlFor(selectedEvent.media).width(1200).url()}
                                        alt="Detail"
                                        fill
                                        className="object-contain p-8"
                                        sizes="(max-width: 1024px) 100vw, 80vw"
                                    />
                                )}
                            </div>
                            <div className="space-y-8 py-12">
                                <div className="space-y-2">
                                    <span className="text-ochre font-black text-2xl tracking-tighter">{selectedEvent.year}</span>
                                    <h3 className="text-4xl md:text-6xl font-black capitalize tracking-tight leading-none">
                                        {getLocalizedValueAsString(selectedEvent.title, locale)}
                                    </h3>
                                </div>
                                <div className="prose prose-invert prose-lg">
                                    <div className="text-ivory/70 leading-relaxed italic border-l-2 border-ochre pl-6">
                                        <PortableTextComponent value={getLocalizedValue(selectedEvent.description, locale)} />
                                        {!getLocalizedValue(selectedEvent.description, locale) &&
                                            "Full archival records for this period are currently being digitized and categorized as part of the NCAI spatial history initiative."
                                        }
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4">
                                    <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] capitalize tracking-widest font-bold">Post-Independence</span>
                                    <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] capitalize tracking-widest font-bold">Nairobi Modernism</span>
                                    <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] capitalize tracking-widest font-bold">Archival Item</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

function LogoIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5L95 50L50 95L5 50L50 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M50 25L75 50L50 75L25 50L50 25Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </svg>
    )
}
