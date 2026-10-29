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
import { getComplimentaryColor } from '@/lib/colors'
import { PortableText } from '@/components/ui/PortableText'

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
    description?: any
    layout?: 'auto' | 'split-left' | 'split-right' | 'centered'
    durationSeconds?: number
    contentPosition?: 'left' | 'center' | 'right'
    contentWidth?: number
    imageAlignment?: 'left' | 'center' | 'right'
    intelligentContrast?: boolean
    forceBlackText?: boolean
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

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
            <path d="M15 5l-7 7 7 7" />
        </svg>
    )
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

    // Intelligent Contrast & Force Black logic
    const bgColor = slide.gradientColor?.hex || '#1A1A1A'
    const complColor = slide.intelligentContrast ? getComplimentaryColor(bgColor) : null
    
    // Determine base color
    let baseColor = '#FFFFFF' // Default
    if (slide.forceBlackText) {
        baseColor = '#000000'
    } else if (slide.intelligentContrast && complColor) {
        baseColor = complColor
    }

    const textStyle = { color: baseColor }
    const mutedTextStyle = { color: baseColor, opacity: 0.6 }
    const isCentered = slide.layout === 'centered' || slide.contentPosition === 'center'
    const textAlignClass = isCentered ? 'text-center' : 'text-start'

    return (
        <div className="flex flex-col justify-center max-md:justify-end py-10 md:py-16 pointer-events-none h-full w-full">
            <div className={cn(
                "pointer-events-auto w-full transition-all duration-700",
                textAlignClass
            )}>
                {/* Heading and content share one left edge (docs/DESIGN_PRINCIPLES.md) */}
                <div className="mb-4 md:mb-6 transition-all duration-700">
                    {preHeading && (
                        <p 
                            className="text-xs md:text-xs uppercase tracking-widest font-bold mb-4 md:mb-4 opacity-60"
                            style={textStyle}
                        >
                            {preHeading}
                        </p>
                    )}
                    {title && (
                        <h1 
                            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-display mb-4 md:mb-6 capitalize transition-all duration-700"
                            style={textStyle}
                        >
                            {title.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <br />}
                                    {line}
                                </React.Fragment>
                            ))}
                        </h1>
                    )}
                </div>

                <div className="flex flex-col gap-y-4 transition-all duration-700">
                    {subtitle && (
                        <p 
                            className="text-base md:text-lg max-w-xl font-medium tracking-tight leading-relaxed"
                            style={mutedTextStyle}
                        >
                            {subtitle}
                        </p>
                    )}
                    {slide.description && (
                        <div className="text-sm md:text-base max-w-xl leading-relaxed opacity-80" style={{ color: baseColor }}>
                            <PortableText value={getLocalizedValue(slide.description, locale)} locale={locale} noProse={true} />
                        </div>
                    )}
                    <div className="flex flex-col gap-y-2 mt-2">
                        {dateLabel && (
                            <span 
                                className="text-sm md:text-base font-bold"
                                style={mutedTextStyle}
                            >
                                {dateLabel}
                            </span>
                        )}
                        {location && (
                            <span 
                                className="text-xs md:text-sm font-bold uppercase tracking-wider"
                                style={mutedTextStyle}
                            >
                                {location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function HomeHeroNew({ heroData, locale }: HomeHeroNewProps) {
    const slides = heroData.slides || []
    const isCarousel = heroData.mode === 'carousel' && slides.length > 1
    const defaultAdvance = heroData.autoAdvanceSeconds ?? 6
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index)
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides.length])

    // Auto-advance carousel (per-slide timing, hero default as fallback)
    const slideDuration = slides[currentSlide]?.durationSeconds ?? defaultAdvance
    useEffect(() => {
        if (!isCarousel || isPaused || slides.length <= 1) return
        const timer = setTimeout(nextSlide, Math.max(slideDuration, 1) * 1000)
        return () => clearTimeout(timer)
    }, [isCarousel, isPaused, slideDuration, nextSlide, slides.length])

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
                    // `??` rather than destructuring defaults: GROQ returns null for unset fields.
                    const layout = slide.layout ?? 'auto'
                    const contentPosition = slide.contentPosition ?? 'left'
                    const contentWidth = slide.contentWidth ?? 50
                    const imageAlignment = slide.imageAlignment ?? 'center'

                    const imageCaption = getLocalizedValue(slide.image?.caption, locale)
                    const bgColor = slide.gradientColor?.hex || '#1A1A1A'

                    // Image positioning
                    const hotspot = slide.image?.hotspot || { x: 0.5, y: 0.5 }
                    const imgWidthPercent = slide.imageSize?.widthPercent ?? 50
                    
                    const assetDims = slide.image?.asset?.metadata?.dimensions
                    const aspectRatio = assetDims?.aspectRatio || 16/9

                    let finalImgLeft = (hotspot.x * 100) - (imgWidthPercent / 2)
                    if (layout !== 'auto') {
                        if (imageAlignment === 'left') finalImgLeft = 5 // some margin
                        else if (imageAlignment === 'right') finalImgLeft = 95 - imgWidthPercent
                        else if (imageAlignment === 'center') finalImgLeft = 50 - (imgWidthPercent / 2)
                    }
                    // Box takes the image's own proportions (height from width), centred on the
                    // hotspot's y and capped so tall images never overflow the hero.
                    const imageElement = slide.image?.asset && (
                        <div
                            className="absolute overflow-hidden -translate-y-1/2 max-md:!left-0 max-md:!top-36 max-md:!w-full max-md:!max-h-[35%] max-md:!translate-y-0"
                            style={{
                                width: `${imgWidthPercent}%`,
                                aspectRatio: `${aspectRatio}`,
                                maxHeight: '70%',
                                left: `${finalImgLeft}%`,
                                top: `${hotspot.y * 100}%`,
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

                    // Derived layout properties
                    const textOnRight = layout === 'auto' ? hotspot.x <= 0.5 : layout === 'split-right'
                    
                    // Flex alignment for the content layer
                    let justifyClass = 'justify-center'
                    if (layout === 'split-left' || contentPosition === 'left') justifyClass = 'justify-start'
                    if (layout === 'split-right' || contentPosition === 'right') justifyClass = 'justify-end'
                    if (contentPosition === 'center') justifyClass = 'justify-center'

                    // Split (image left / text right): artwork fills its half edge to edge, text sits
                    // in the container's right column. `start`/`ps` flip automatically in RTL.
                    const splitContent = layout === 'split-right' && (
                        <div className="relative w-full h-full flex flex-col md:block">
                            <div className="relative overflow-hidden max-md:mt-36 max-md:h-[28%] md:absolute md:inset-y-0 md:start-0 md:w-1/2">
                                {slide.image?.asset && (
                                    <Image
                                        src={urlFor(slide.image).width(1920).quality(85).url()}
                                        alt={getLocalizedValue(slide.title, locale) || 'Hero image'}
                                        fill
                                        className="object-cover"
                                        style={{ objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }}
                                        priority={index === 0}
                                        placeholder={slide.image.asset.metadata?.lqip ? 'blur' : 'empty'}
                                        blurDataURL={slide.image.asset.metadata?.lqip}
                                        sizes="(min-width: 768px) 50vw, 100vw"
                                    />
                                )}
                                {captionTooltip}
                            </div>
                            <div className="flex-1 min-h-0 md:absolute md:inset-0 md:z-20">
                                <div className="page-container h-full md:grid md:grid-cols-2">
                                    <div className="max-md:pt-5 max-md:pb-24 md:h-full md:flex md:items-center md:col-start-2 md:ps-12">
                                        <SlideContent slide={slide} locale={locale} textOnRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                    const content = splitContent || (
                        <div className="relative w-full h-full">
                            {/* Image layer (z-0) */}
                            <div className="absolute inset-0 z-0">
                                {imageElement}
                                {captionTooltip}
                            </div>

                            {/* Text content layer (z-20) */}
                            <div className="absolute inset-0 z-20">
                                <div className={`page-container h-full flex ${justifyClass}`}>
                                    {/* Phones: image fills the top, text sits below it at full width */}
                                    <div
                                        className="h-full flex items-center max-md:!w-full max-md:items-end max-md:pb-12"
                                        style={{ width: `${contentWidth}%` }}
                                    >
                                        <SlideContent slide={slide} locale={locale} textOnRight={textOnRight} />
                                    </div>
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
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full bg-black/40 px-1 backdrop-blur-sm"
                    onKeyDown={(e) => {
                        const rtl = document.documentElement.dir === 'rtl'
                        if (e.key === 'ArrowLeft') (rtl ? nextSlide : prevSlide)()
                        if (e.key === 'ArrowRight') (rtl ? prevSlide : nextSlide)()
                    }}
                >
                    <button
                        onClick={prevSlide}
                        className="flex h-11 w-11 items-center justify-center text-white/80 hover:text-white transition-colors"
                        aria-label="Previous slide"
                    >
                        <ChevronIcon className="rtl:-scale-x-100" />
                    </button>
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
                    <button
                        onClick={nextSlide}
                        className="flex h-11 w-11 items-center justify-center text-white/80 hover:text-white transition-colors"
                        aria-label="Next slide"
                    >
                        <ChevronIcon className="rotate-180 rtl:rotate-0" />
                    </button>
                </div>
            )}
        </section>
    )
}
