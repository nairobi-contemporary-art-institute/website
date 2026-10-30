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
                palette?: { dominant?: { background?: string } }
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

// WCAG relative luminance; above ~0.18 black reads better than white.
function isLight(hex?: string): boolean {
    const m = hex?.match(/^#?([0-9a-f]{6})$/i)
    if (!m) return false
    const [r, g, b] = [0, 2, 4].map((i) => {
        const c = parseInt(m[1].slice(i, i + 2), 16) / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18
}

// Arrow paths from imma.ie icon_arrow_left/right.svg (30×30), white or black
function ArrowIcon({ direction, dark }: { direction: 'left' | 'right'; dark?: boolean }) {
    const points = direction === 'right'
        ? '0.896,15.91 26.113,15.91 17.035,24.926 18.323,26.205 29.605,15 18.323,3.795 17.035,5.074 26.113,14.09 0.396,14.09 0.396,15.41 0.396,15.91'
        : '29.104,14.09 3.887,14.09 12.965,5.074 11.677,3.795 0.395,15 11.677,26.205 12.965,24.926 3.887,15.91 29.604,15.91 29.604,14.59 29.604,14.09'
    return (
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <polygon fill={dark ? '#000000' : '#FFFFFF'} points={points} className="transition-colors duration-[600ms]" />
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
    const isRtl = locale === 'ar'
    const [sampledLight, setSampledLight] = useState<boolean | null>(null)

    // Brightness of the image strip behind the arrow, sampled from the tiny blur placeholder.
    const activeImage = slides[currentSlide]?.image
    const lqip = activeImage?.asset?.metadata?.lqip
    const aspect = activeImage?.asset?.metadata?.dimensions?.aspectRatio
    const hotspotX = activeImage?.hotspot?.x ?? 0.5
    useEffect(() => {
        setSampledLight(null)
        if (!lqip) return
        const img = new window.Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            ctx.drawImage(img, 0, 0)
            // Half-width panel (~0.94 aspect) shows a centred slice of wider images; arrow sits near its left edge.
            const visible = Math.min(1, 0.94 / (aspect || 1.78))
            const start = (1 - visible) * hotspotX
            const sx = Math.floor((start + visible * 0.01) * img.width)
            const sw = Math.max(1, Math.ceil(visible * 0.1 * img.width))
            const sy = Math.floor(img.height * 0.4)
            const sh = Math.max(1, Math.ceil(img.height * 0.2))
            try {
                const d = ctx.getImageData(sx, sy, sw, sh).data
                let r = 0, g = 0, b = 0
                const n = d.length / 4
                for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2] }
                setSampledLight(isLight('#' + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('')))
            } catch { /* fall back to palette */ }
        }
        img.src = lqip
    }, [lqip, aspect, hotspotX])

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

    // Split-right: left arrow sits over the image, right arrow over the colour panel.
    const active = slides[currentSlide] ?? slides[0]
    const darkOnImage = sampledLight ?? isLight(active.image?.asset?.metadata?.palette?.dominant?.background)
    const darkOnPanel = isLight(active.gradientColor?.hex || '#1A1A1A')

    const displaySlides = heroData.mode === 'static' ? [slides[0]] : slides

    return (
        <section
            className="relative w-full overflow-hidden flex-1 min-h-[600px] max-md:min-h-dvh"
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
                                {/* md: clear the fixed header (~132px incl. status bar) so text centres in the visible hero */}
                                <div className="page-container h-full md:grid md:grid-cols-2 md:pt-[132px]">
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

            {/* Carousel arrows (left/right edges, dull until hovered) */}
            {isCarousel && slides.length > 1 && (
                <div
                    className="pointer-events-none absolute inset-x-0 z-30 top-1/2 md:top-[calc(50%+66px)] max-md:top-[calc(9rem+14%)]"
                    onKeyDown={(e) => {
                        const rtl = document.documentElement.dir === 'rtl'
                        if (e.key === 'ArrowLeft') (rtl ? nextSlide : prevSlide)()
                        if (e.key === 'ArrowRight') (rtl ? prevSlide : nextSlide)()
                    }}
                >
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => (isRtl ? nextSlide : prevSlide)()}
                            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 left-6 flex h-[30px] w-[30px] items-center justify-center opacity-35 transition-opacity duration-[600ms] ease-in-out hover:opacity-100 focus-visible:opacity-100 after:absolute after:-inset-3 after:content-['']"
                            aria-label={isRtl ? 'Next slide' : 'Previous slide'}
                        >
                            <ArrowIcon direction="left" dark={isRtl ? darkOnPanel : darkOnImage} />
                        </button>
                        <button
                            type="button"
                            onClick={() => (isRtl ? prevSlide : nextSlide)()}
                            className="pointer-events-auto absolute top-1/2 -translate-y-1/2 right-6 flex h-[30px] w-[30px] items-center justify-center opacity-35 transition-opacity duration-[600ms] ease-in-out hover:opacity-100 focus-visible:opacity-100 after:absolute after:-inset-3 after:content-['']"
                            aria-label={isRtl ? 'Previous slide' : 'Next slide'}
                        >
                            <ArrowIcon direction="right" dark={isRtl ? darkOnImage : darkOnPanel} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
