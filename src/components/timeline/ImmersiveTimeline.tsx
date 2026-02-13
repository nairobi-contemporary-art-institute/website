'use client'

import React, { useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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

const MOCK_EVENTS: TimelineEvent[] = [
    {
        _id: 'mock-1',
        year: '1960',
        title: { en: 'The Independence Era', ar: 'عصر الاستقلال' },
        description: 'Emergence of modern art movements in post-colonial East Africa.',
        media: null,
    },
    {
        _id: 'mock-2',
        year: '1980',
        title: { en: 'The Paa Ya Paa Years', ar: 'سنوات با يا با' },
        description: 'A pivotal moment for community-led art spaces in Nairobi.',
        media: null,
    },
    {
        _id: 'mock-3',
        year: '2000',
        title: { en: 'Digital Convergence', ar: 'التقارب الرقمي' },
        description: 'New media and experimental practices take root.',
        media: null,
    },
    {
        _id: 'mock-4',
        year: '2020',
        title: { en: 'NCAI Foundation', ar: 'تأسيس NCAI' },
        description: 'Establishment of the Nairobi Contemporary Art Institute.',
        media: null,
    }
]

export function ImmersiveTimeline({ events: initialEvents, locale }: ImmersiveTimelineProps) {
    const events = initialEvents.length > 0 ? initialEvents : MOCK_EVENTS
    const containerRef = useRef<HTMLDivElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const { isReducedMotion } = useAccessibility()
    const [currentIndex, setCurrentIndex] = useState(0)

    useGSAP(() => {
        if (isReducedMotion || events.length === 0) return

        const sections = gsap.utils.toArray('.timeline-event')

        // Main horizontal scroll animation
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: pinRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => `+=${pinRef.current?.offsetWidth || 0 * sections.length}`,
                onUpdate: (self) => {
                    const progress = self.progress
                    const index = Math.round(progress * (sections.length - 1))
                    setCurrentIndex(index)
                }
            }
        })

        // Background parallax or floating elements can be added here
    }, { scope: containerRef, dependencies: [events, isReducedMotion] })

    if (events.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-charcoal text-ivory">
                <p className="text-ivory font-mono tracking-widest animate-pulse">Initializing Digital Wing...</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="bg-charcoal text-ivory overflow-x-hidden">
            {/* Minimal Header */}
            <div className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 mix-blend-difference">
                <Link href="/" className="text-2xl font-bold tracking-tighter">NCAI / WING</Link>
                <div className="flex gap-4 items-center">
                    {!isReducedMotion && (
                        <span className="text-xs font-mono opacity-50">
                            {currentIndex + 1} / {events.length}
                        </span>
                    )}
                    <Link href="/history" className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-ivory/20 hover:bg-ivory hover:text-charcoal transition-all">
                        Exit Wing
                    </Link>
                </div>
            </div>

            <div
                ref={pinRef}
                className={cn(
                    "flex flex-col md:flex-row items-center",
                    !isReducedMotion ? "h-screen w-[500%] overflow-hidden" : "w-full"
                )}
                style={!isReducedMotion ? { width: `${events.length * 100}%` } : {}}
            >
                {events.map((event, i) => (
                    <section
                        key={event._id}
                        className="timeline-event w-screen h-full flex items-center justify-center p-12 md:p-24 shrink-0"
                    >
                        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Year & Text Content */}
                            <div className="space-y-6">
                                <span className="text-[12vw] font-bold tracking-tighter text-ivory/10 leading-none block">
                                    {event.year}
                                </span>
                                <div className="space-y-4 -mt-12 md:-mt-24 relative z-10">
                                    <h2 className="text-4xl md:text-7xl font-bold tracking-tight">
                                        {typeof event.title === 'string' ? event.title : event.title?.[locale] || 'Untitled'}
                                    </h2>
                                    <p className="text-lg md:text-xl text-ivory/60 max-w-lg font-light leading-relaxed">
                                        Tracing the evolution of spatial and conceptual practice in the region.
                                    </p>
                                </div>
                            </div>

                            {/* Image Content */}
                            <div className="relative aspect-[3/4] md:aspect-square bg-white/5 border border-ivory/10 shadow-2xl overflow-hidden group">
                                {event.media?.asset ? (
                                    <Image
                                        src={urlFor(event.media).width(1200).height(1200).url()}
                                        alt={event.year}
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                                        priority={i === 0}
                                        placeholder="blur"
                                        blurDataURL={event.media?.asset?.metadata?.lqip}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                        <div className="w-1/2 h-px bg-ivory rotate-45" />
                                        <div className="w-1/2 h-px bg-ivory -rotate-45" />
                                        <span className="absolute bottom-12 text-[10px] uppercase tracking-widest">Archive Item {i + 1}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse">
                <span className="text-[10px] uppercase tracking-[0.4em]">
                    {isReducedMotion ? 'Scroll to Explore' : 'Scroll to Fly'}
                </span>
                <div className="w-px h-12 bg-ivory" />
            </div>
        </div>
    )
}
