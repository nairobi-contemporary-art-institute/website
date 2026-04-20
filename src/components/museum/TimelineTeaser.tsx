'use client'

import React, { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from "@/sanity/lib/utils";
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
    const teaserRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const items = gsap.utils.toArray('.teaser-item')
        if (items.length === 0) return

        // Reveal animation
        gsap.fromTo(items,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "expo.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        )

        // Mouse follow motion for years
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const xPos = (clientX / window.innerWidth - 0.5) * 40
            const yPos = (clientY / window.innerHeight - 0.5) * 40

            gsap.to('.teaser-year-bg', {
                x: xPos,
                y: yPos,
                duration: 2,
                ease: "power2.out",
                stagger: 0.05
            })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, { scope: containerRef, dependencies: [events] })

    return (
        <section ref={containerRef} className="bg-charcoal text-ivory py-32 md:py-48 overflow-hidden relative">
            {/* Subtle background grain or texture could go here */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-px bg-ochre/50" />
                            <span className="text-[10px] capitalize tracking-[0.5em] font-bold text-ochre">The Institutional Journey</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] capitalize italic sm:not-italic">
                            {headline || (
                                <>A Legacy of <br /><span className="text-ochre">Transcendence</span></>
                            )}
                        </h2>
                    </div>
                    <Link
                        href="/timeline"
                        className="group flex items-center gap-6 text-[10px] font-bold capitalize tracking-[0.3em] py-4 px-8 border border-ivory/20 hover:border-ochre hover:bg-ochre hover:text-charcoal transition-all duration-500 rounded-full"
                    >
                        Enter Archive
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 min-h-[600px] items-start">
                    {events.slice(0, 4).map((event, idx) => {
                        const description = getLocalizedValue(event.description, locale);
                        return (
                            <div
                                key={event._id}
                                className={`teaser-item group relative aspect-[3/4] overflow-hidden flex flex-col justify-end p-8 transition-transform duration-700
                                    ${idx % 2 === 1 ? 'lg:mt-24' : 'lg:mt-0'}
                                `}
                            >
                                {/* Huge Background Year */}
                                <div className="teaser-year-bg absolute -top-10 -left-10 text-[10rem] font-black text-ivory/[0.03] select-none z-0">
                                    {event.year}
                                </div>

                                {/* Background Image with sophisticated blend */}
                                {event.media && (
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute inset-0 bg-charcoal mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
                                        <Image
                                            src={(() => {
                                                try {
                                                    // Handle mock data or malformed refs gracefully
                                                    if (typeof event.media === 'string' && event.media.startsWith('http')) return event.media;
                                                    
                                                    const ref = event.media?.asset?._ref || '';
                                                    if (ref.includes('image-t') || ref.includes('00000000000000000000000')) {
                                                        const placeholders = [
                                                            '1549490349-8643362247b5', // Abstract
                                                            '1523891708897-40030044813f', // Architecture
                                                            '1501862700950-18382cd41497', // Texture
                                                            '1550684848-fac1c5b4e853'  // Modern
                                                        ];
                                                        const index = parseInt(ref.replace(/\D/g, '') || '0') % placeholders.length;
                                                        return `https://images.unsplash.com/photo-${placeholders[index]}?w=800&q=80`;
                                                    }
                                                    return urlFor(event.media).width(800).height(1000).url();
                                                } catch (e) {
                                                    return `https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80`;
                                                }
                                            })()}
                                            alt={getLocalizedValue(event.title, locale) || String(event.year)}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>
                                )}

                                {/* Border overlay */}
                                <div className="absolute inset-0 border border-ivory/5 group-hover:border-ochre/30 transition-colors duration-700 z-10" />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity z-10" />

                                <div className="relative z-20 space-y-6">
                                    <span className="text-xs font-bold tracking-[0.3em] text-ochre block transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {event.year}
                                    </span>
                                    <h3 className="text-2xl font-bold tracking-tight leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        {getLocalizedValueAsString(event.title, locale)}
                                    </h3>

                                    <p className="text-sm text-ivory/60 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                        {description ? (typeof description === 'string' ? description : portableTextToPlainText(description)) : ''}
                                    </p>

                                    <div className="pt-4 overflow-hidden">
                                        <div className="h-px bg-ochre w-0 group-hover:w-full transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ambient Curvilinear Element (Decorative) */}
            <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-10">
                <svg viewBox="0 0 500 1000" className="w-full h-full text-ochre" fill="none" stroke="currentColor">
                    <path d="M500,0 C400,300 100,700 0,1000" strokeWidth="0.5" />
                    <path d="M500,100 C410,350 110,750 0,1100" strokeWidth="0.2" strokeDasharray="10 20" />
                </svg>
            </div>
        </section>
    )
}
