"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { MediaPlayer } from '@/components/channel/MediaPlayer'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface Work {
    _id: string
    title: any
    year?: string
    medium?: any
    dimensions?: string
    edition?: string
    image: any
    mediaType?: 'image' | 'video'
    videoUrl?: string
}

interface WorkLightboxProps {
    isOpen: boolean
    onClose: () => void
    works: Work[]
    initialIndex: number
    locale: string
    artistName: string
}

export function WorkLightbox({ isOpen, onClose, works, initialIndex, locale, artistName }: WorkLightboxProps) {
    const t = useTranslations('Pages.artists')
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        setCurrentIndex(initialIndex)
    }, [initialIndex])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    if (!isOpen || !works || works.length === 0) return null

    const currentWork = works[currentIndex]
    const title = getLocalizedValueAsString(currentWork.title, locale)
    const medium = getLocalizedValueAsString(currentWork.medium, locale)
    const isVideo = currentWork.mediaType === 'video' && currentWork.videoUrl

    const next = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % works.length)
    }
    const prev = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + works.length) % works.length)
    }

    const swipeConfidenceThreshold = 5000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0
        })
    }

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            {/* Top Navigation Bar */}
            <div className="flex justify-end p-8 md:p-12">
                <button
                    onClick={onClose}
                    className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
                >
                    <X className="w-8 h-8 text-charcoal" strokeWidth={1} />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal/40 group-hover:text-charcoal transition-colors">Close</span>
                </button>
            </div>

            {/* Main Content Area - Increased top space */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
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
                        className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-12"
                    >
                        <div className="w-full max-w-5xl flex flex-col items-center">
                            {/* Media Container - Flexible max-height to ensure space for metadata */}
                            <div className="relative w-full h-[50vh] md:h-[60vh]">
                                {isVideo ? (
                                    <MediaPlayer 
                                        type="video" 
                                        url={currentWork.videoUrl} 
                                        thumbnail={currentWork.image?.asset ? urlFor(currentWork.image).width(1600).url() : ''}
                                    />
                                ) : (
                                    currentWork.image?.asset ? (
                                        <Image
                                            src={urlFor(currentWork.image).width(1600).url()}
                                            alt={title || 'Artwork'}
                                            fill
                                            className="object-contain"
                                            sizes="95vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                            No image available
                                        </div>
                                    )
                                )}
                            </div>

                        {/* Metadata Stack - Left aligned and in-line with Enquiry */}
                        <div className="mt-12 w-full max-w-2xl px-4 flex flex-col md:flex-row justify-between items-end gap-8 mx-auto">
                            <div className="space-y-0.5 text-xs md:text-sm text-charcoal leading-snug text-left border-l border-charcoal/10 pl-4">
                                <p className="font-normal">{artistName}</p>
                                <p className="italic font-normal">{title}</p>
                                <p className="block">{getLocalizedValueAsString(currentWork.year, locale)}</p>
                                <p className="block max-w-[75ch]">{medium}</p>
                                <p className="block">{getLocalizedValueAsString(currentWork.dimensions, locale)}</p>
                                {currentWork.edition && (
                                    <p className="text-[11px] text-charcoal/60 pt-2">{getLocalizedValueAsString(currentWork.edition, locale)}</p>
                                )}
                            </div>

                            <div className="shrink-0">
                                <a
                                    href={`mailto:info@ncai254.com?subject=Enquiry: ${artistName} - ${title}`}
                                    className="inline-block px-12 py-3 border border-charcoal text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-charcoal hover:text-white transition-all duration-300"
                                >
                                    Enquire
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {works.length > 1 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-8">
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="pointer-events-auto p-2 hover:translate-x-[-4px] transition-transform hidden md:block z-[110]"
                        >
                            <ChevronLeft className="w-10 h-10 text-charcoal/30 hover:text-charcoal" strokeWidth={1} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="pointer-events-auto p-2 hover:translate-x-[4px] transition-transform hidden md:block z-[110]"
                        >
                            <ChevronRight className="w-10 h-10 text-charcoal/30 hover:text-charcoal" strokeWidth={1} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
