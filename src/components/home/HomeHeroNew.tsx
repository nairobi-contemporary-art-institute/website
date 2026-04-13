'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import { ArtTooltip } from '@/components/ui/ArtTooltip'
import { ArtCaption } from '@/components/ui/ArtCaption'

interface HeroSlide {
    image?: {
        asset?: {
            metadata?: {
                lqip?: string
                dimensions?: { width: number; height: number; aspectRatio: number }
            }
        }
        hotspot?: { x: number; y: number }
        caption?: any
    }
    imageSize?: { widthPercent?: number; heightPercent?: number }
    gradientColor?: { hex?: string; alpha?: number }
    gradientOpacity?: number
    preHeading?: any
    title?: any
    subtitle?: any
    date?: { startDate?: string; endDate?: string }
    location?: any
    link?: {
        reference?: {
            _type: string
            slug: string
            title?: any
            name?: any
        }
        externalUrl?: string
    }
}

interface HomeHeroNewProps {
    heroData: {
        enabled?: boolean
        mode?: 'static' | 'carousel'
        autoAdvanceSeconds?: number
        slides?: HeroSlide[]
    }
    locale: string
}

function getSlideLink(slide: HeroSlide): string {
    if (slide.link?.externalUrl) return slide.link.externalUrl
    if (slide.link?.reference) {
        const type = slide.link.reference._type
        const slug = slide.link.reference.slug
        if (type === 'exhibition') return `/exhibitions/${slug}`
        if (type === 'post') return `/channel/${slug}`
        if (type === 'program') return `/education/${slug}`
        if (type === 'event') return `/events/${slug}`
        if (type === 'artist') return `/artists/${slug}`
    }
    return '#'
}

function SlideContent({ slide, locale, textOnRight = true }: { slide: HeroSlide; locale: string; textOnRight?: boolean }) {
    const preHeading = getLocalizedValue(slide.preHeading, locale)
    const title = getLocalizedValue(slide.title, locale)
    const subtitle = getLocalizedValue(slide.subtitle, locale)
    const location = getLocalizedValue(slide.location, locale)

    const formatDate = (iso: string) => {
        const d = new Date(iso + 'T00:00:00')
        return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
    }

    const dateLabel = slide.date?.startDate
        ? slide.date.endDate
            ? `${formatDate(slide.date.startDate)} – ${formatDate(slide.date.endDate)}`
            : formatDate(slide.date.startDate)
        : null

    return (
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-10 md:py-16 pointer-events-none h-full">
            <div className={`pointer-events-auto max-w-2xl ${textOnRight ? '' : 'ml-0'}`}>
                {preHeading && (
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/60 mb-3 md:mb-4">
                        {preHeading}
                    </p>
                )}
                {title && (
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4 md:mb-6 capitalize">
                        {title.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </h1>
                )}
                {subtitle && (
                    <p className="text-base md:text-lg text-white/80 max-w-xl mb-4 leading-relaxed">
                        {subtitle}
                    </p>
                )}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {dateLabel && (
                        <span className="text-sm md:text-base font-bold text-white/80">
                            {dateLabel}
                        </span>
                    )}
                    {location && (
                        <span className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-wider">
                            {location}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export function HomeHeroNew({ heroData, locale }: HomeHeroNewProps) {
    const slides = heroData.slides || []
    const isCarousel = heroData.mode === 'carousel' && slides.length > 1
    const autoAdvance = heroData.autoAdvanceSeconds ?? 6
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    // Auto-advance carousel
    useEffect(() => {
        if (!isCarousel || isPaused || slides.length <= 1) return
        const timer = setInterval(nextSlide, autoAdvance * 1000)
        return () => clearInterval(timer)
    }, [isCarousel, isPaused, autoAdvance, nextSlide, slides.length])

    if (slides.length === 0) return null

    const displaySlides = heroData.mode === 'static' ? [slides[0]] : slides

    return (
        <section
            className="relative w-full overflow-hidden h-dvh"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                {displaySlides.map((slide, index) => {
                    if (isCarousel && index !== currentSlide) return null

                    const href = getSlideLink(slide)
                    const imageCaption = getLocalizedValue(slide.image?.caption, locale)
                    const bgColor = slide.gradientColor?.hex || '#1A1A1A'

                    // Image positioning based on hotspot + width
                    const hotspot = slide.image?.hotspot || { x: 0.5, y: 0.5 }
                    const imgWidthPercent = slide.imageSize?.widthPercent ?? 50
                    
                    // Calculate height to maintain original aspect ratio
                    const assetDims = slide.image?.asset?.metadata?.dimensions
                    const aspectRatio = assetDims?.aspectRatio || 16/9
                    const imgHeightPercent = imgWidthPercent / aspectRatio

                    const imgLeft = (hotspot.x * 100) - (imgWidthPercent / 2)
                    const imgTop = (hotspot.y * 100) - (imgHeightPercent / 2)

                    const imageElement = slide.image?.asset && (
                        <div
                            className="absolute overflow-hidden"
                            style={{
                                width: `${imgWidthPercent}%`,
                                height: `${imgHeightPercent}%`,
                                left: `${imgLeft}%`,
                                top: `${imgTop}%`,
                            }}
                        >
                            <Image
                                src={urlFor(slide.image).width(Math.round(1920 * (imgWidthPercent / 100))).quality(90).url()}
                                alt={getLocalizedValue(slide.title, locale) || 'Hero image'}
                                fill
                                className="object-contain"
                                priority={index === 0}
                                placeholder={slide.image.asset.metadata?.lqip ? 'blur' : 'empty'}
                                blurDataURL={slide.image.asset.metadata?.lqip}
                                sizes={`${imgWidthPercent}vw`}
                            />
                        </div>
                    )

                    const captionTooltip = imageCaption && (
                        <div className="absolute bottom-4 left-4 z-30 pointer-events-auto">
                            <ArtTooltip
                                content={<ArtCaption content={imageCaption} className="text-charcoal" />}
                                align="left"
                            />
                        </div>
                    )

                    // Flip text to opposite side of image hotspot
                    const textOnRight = hotspot.x <= 0.5

                    const content = (
                        <div className="relative w-full h-full">
                            {/* Image layer (z-0) */}
                            <div className="absolute inset-0 z-0">
                                {imageElement}
                                {captionTooltip}
                            </div>

                            {/* Text content layer (z-20) - flips based on image position */}
                            <div className={`absolute inset-0 z-20 flex ${textOnRight ? 'justify-end' : 'justify-start'}`}>
                                <div className="w-full md:w-1/2 h-full flex items-center">
                                    <SlideContent slide={slide} locale={locale} textOnRight={textOnRight} />
                                </div>
                            </div>
                        </div>
                    )

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{ backgroundColor: bgColor }}
                        >
                            {href !== '#' ? (
                                <Link href={href} className="block w-full h-full">
                                    {content}
                                </Link>
                            ) : content}
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            {/* Carousel dot navigation */}
            {isCarousel && slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                'w-2 h-2 rounded-full transition-all duration-300',
                                currentSlide === index
                                    ? 'bg-white w-6'
                                    : 'bg-white/40 hover:bg-white/60'
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
