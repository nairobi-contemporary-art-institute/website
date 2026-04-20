"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { MediaPlayer } from '@/components/channel/MediaPlayer'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface Work {
    _id: string
    title: any
    year?: string
    medium?: any
    dimensions?: string
    edition?: string
    image: any
    tags?: any[]
    mediaType?: 'image' | 'video'
    videoUrl?: string
    videoCaption?: any
}

interface WorkCarouselProps {
    works: Work[]
    locale: string
    artistName: string
    onOpenGrid: () => void
}

export function WorkCarousel({ works, locale, artistName, onOpenGrid }: WorkCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const next = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % works.length)
    }
    const prev = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + works.length) % works.length)
    }

    useEffect(() => {
        if (!works || works.length <= 1 || isPaused) return

        const timer = setInterval(() => {
            next()
        }, 4000)

        return () => clearInterval(timer)
    }, [currentIndex, isPaused, works])

    if (!works || works.length === 0) return null

    const currentWork = works[currentIndex]
    const title = getLocalizedValueAsString(currentWork.title, locale)
    const medium = getLocalizedValueAsString(currentWork.medium, locale)
    const isVideo = currentWork.mediaType === 'video' && currentWork.videoUrl

    const swipeConfidenceThreshold = 5000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    }

    return (
        <div className="space-y-4">
            {/* Main Media View - Constrained to 75vh and Draggable */}
            <div 
                className="relative group overflow-hidden bg-transparent" 
                style={{ height: '75vh', maxHeight: '75vh' }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                next()
                            } else if (swipe > swipeConfidenceThreshold) {
                                prev()
                            }
                        }}
                        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                    >
                        {isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                <MediaPlayer 
                                    type="video" 
                                    url={currentWork.videoUrl} 
                                    thumbnail={currentWork.image?.asset ? urlFor(currentWork.image).width(1200).url() : ''}
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full p-4 md:p-8">
                                {currentWork.image?.asset ? (
                                    <Image
                                        src={urlFor(currentWork.image).width(1200).url()}
                                        alt={title || 'Artwork'}
                                        fill
                                        className="object-contain pointer-events-none"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority
                                        {...(currentWork.image?.asset?.metadata?.lqip && {
                                            placeholder: 'blur',
                                            blurDataURL: currentWork.image.asset.metadata.lqip
                                        })}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                        No image available
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {works.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                            <ChevronLeft className="w-4 h-4 text-charcoal" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                            <ChevronRight className="w-4 h-4 text-charcoal" />
                        </button>
                    </>
                )}
            </div>

            {/* Metadata Section */}
            <div className="pt-4">
                <div className="flex flex-col items-start">
                    <button
                        onClick={onOpenGrid}
                        className="p-1 hover:bg-charcoal/5 transition-colors mb-2 block"
                        title="Grid"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-charcoal/60">
                            <rect width="4" height="4" fill="currentColor" />
                            <rect x="7" width="4" height="4" fill="currentColor" />
                            <rect x="14" width="4" height="4" fill="currentColor" />
                            <rect y="7" width="4" height="4" fill="currentColor" />
                            <rect x="7" y="7" width="4" height="4" fill="currentColor" />
                            <rect x="14" y="7" width="4" height="4" fill="currentColor" />
                            <rect y="14" width="4" height="4" fill="currentColor" />
                            <rect x="7" y="14" width="4" height="4" fill="currentColor" />
                            <rect x="14" y="14" width="4" height="4" fill="currentColor" />
                        </svg>
                    </button>

                    <div className="space-y-0.5 text-[11px] md:text-xs text-charcoal leading-snug">
                        <p className="font-normal">{artistName}</p>
                        <p className="italic font-normal">{title}</p>
                        <p className="block">{getLocalizedValueAsString(currentWork.year, locale)}</p>
                        <p className="block max-w-[75ch]">{medium}</p>
                        <p className="block">{getLocalizedValueAsString(currentWork.dimensions, locale)}</p>
                        {currentWork.edition && (
                            <p className="text-[10px] text-charcoal/60 pt-1 max-w-[75ch]">{getLocalizedValueAsString(currentWork.edition, locale)}</p>
                        )}
                    </div>

                    <div className="mt-8">
                        <a
                            href={`mailto:info@ncai254.com?subject=Enquiry: ${artistName} - ${title}`}
                            className="inline-block px-8 py-2.5 border border-charcoal text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-charcoal hover:text-white transition-all duration-300"
                        >
                            Enquire
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
