'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'

interface Work {
    _id: string
    title: any
    year?: string
    medium?: any
    dimensions?: string
    edition?: string
    image: any
    tags?: any[]
}

interface WorkCarouselProps {
    works: Work[]
    locale: string
    onOpenGrid: () => void
}

export function WorkCarousel({ works, locale, onOpenGrid }: WorkCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    if (!works || works.length === 0) return null

    const currentWork = works[currentIndex]
    const title = getLocalizedValue(currentWork.title, locale)
    const medium = getLocalizedValue(currentWork.medium, locale)

    const next = () => setCurrentIndex((prev) => (prev + 1) % works.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + works.length) % works.length)

    return (
        <div className="space-y-6">
            {/* Main Image View */}
            <div className="relative group">
                <div
                    className="aspect-square relative bg-charcoal/5 overflow-hidden rounded-sm cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <Image
                        src={urlFor(currentWork.image).width(1200).height(1200).url()}
                        alt={title || 'Artwork'}
                        fill
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-102"
                        priority
                    />
                </div>

                {/* Navigation Arrows */}
                {works.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-6 h-6 text-charcoal" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-6 h-6 text-charcoal" />
                        </button>
                    </>
                )}
            </div>

            {/* Controls and Metadata */}
            <div className="flex justify-between items-start gap-8">
                <div className="space-y-1">
                    <button
                        onClick={onOpenGrid}
                        className="p-1 hover:bg-charcoal/5 rounded-sm transition-colors mb-2"
                        title="View all works"
                    >
                        <Grid className="w-5 h-5 text-charcoal/60" />
                    </button>
                    <div className="text-sm space-y-0.5">
                        <p className="font-bold text-charcoal italic">{title}</p>
                        <p className="text-charcoal/80">{currentWork.year}</p>
                        <p className="text-charcoal/60 text-xs">{medium}</p>
                        <p className="text-charcoal/60 text-xs">{currentWork.dimensions}</p>
                        {currentWork.edition && <p className="text-charcoal/40 text-[10px] uppercase tracking-tighter mt-1">{currentWork.edition}</p>}

                        {currentWork.tags && currentWork.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 pt-1">
                                {currentWork.tags.map((tag: any) => (
                                    <span key={tag._id} className="text-[10px] text-charcoal/40 bg-charcoal/5 px-1.5 rounded-sm">
                                        {getLocalizedValue(tag.title, locale)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        className="px-6 py-2 border border-charcoal text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-charcoal hover:text-white transition-all duration-300"
                    >
                        Enquire
                    </button>
                </div>
            </div>

            {/* Simple Lightbox Overlay */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={urlFor(currentWork.image).url()}
                            alt={title || 'Artwork'}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <button
                        className="absolute top-8 right-8 text-charcoal hover:scale-110 transition-transform"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <span className="text-xs uppercase tracking-widest font-bold">Close</span>
                    </button>
                </div>
            )}
        </div>
    )
}
