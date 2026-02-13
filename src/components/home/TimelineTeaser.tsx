'use client'

import React, { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface TimelineEvent {
    _id: string
    year: number | string
    title: any
    description: any
    media: any
}

interface TimelineTeaserProps {
    events: TimelineEvent[]
    locale: string
    headline?: string
}

export function TimelineTeaser({ events, locale, headline }: TimelineTeaserProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const items = gsap.utils.toArray('.teaser-item')

        gsap.fromTo(items,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        )
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="bg-charcoal text-ivory py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500 mb-6 block">Our Legacy</span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                            {headline || (
                                <>TRACING THE EVOLUTION <br /> OF PRACTICE</>
                            )}
                        </h2>
                    </div>
                    <Link
                        href="/timeline"
                        className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] border-b border-ivory/20 pb-2 hover:border-amber-500 transition-all"
                    >
                        Explore Full Timeline
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/10">
                    {events.slice(0, 3).map((event, idx) => (
                        <div key={event._id} className="teaser-item group relative aspect-[4/5] bg-charcoal overflow-hidden p-8 flex flex-col justify-end">
                            {/* Background Image (Grayscale by default) */}
                            {event.media && (
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                    <Image
                                        src={urlFor(event.media).width(800).height(1000).url()}
                                        alt={getLocalizedValue(event.title, locale) || String(event.year)}
                                        fill
                                        className="object-cover grayscale"
                                    />
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-80" />

                            <div className="relative z-10 space-y-4">
                                <span className="text-5xl font-bold tracking-tighter text-amber-500/50 group-hover:text-amber-500 transition-colors">
                                    {event.year}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                                    {getLocalizedValue(event.title, locale)}
                                </h3>
                                <div className="w-0 group-hover:w-full h-px bg-amber-500 transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
