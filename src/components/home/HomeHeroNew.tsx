'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { cn } from '@/lib/utils'
import { ArtTooltip } from '@/components/ui/ArtTooltip'
import { ArtCaption } from '@/components/ui/ArtCaption'
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

// Slide-left swipe: image leaves first, text follows a beat later; both ease back in.
const SWIPE_EASE_IN = [0.4, 0, 1, 1] as const
const SWIPE_EASE_OUT = [0, 0, 0.2, 1] as const
const imageVariants: Variants = {
    enter: { x: '30%', opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.7, ease: SWIPE_EASE_OUT } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.5, ease: SWIPE_EASE_IN } },
}
// Text container: only the exit lives here (groups below own their entrance), so the whole
// block still leaves together in 0.48s. Entrance is staggered, all ending by 0.82s, the same
// instant the old single 0.12s + 0.7s entrance ended, so the slide change is no longer.
const textVariants: Variants = {
    enter: {},
    center: {},
    exit: { x: -96, opacity: 0, transition: { duration: 0.4, delay: 0.08, ease: SWIPE_EASE_IN } },
}
const ENTRANCE = { a: 0.1, b: 0.22, c: 0.32 } // eyebrow+title, then date+location, then central info
const groupVariants = (delay: number): Variants => ({
    enter: { x: 48, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.5, delay, ease: SWIPE_EASE_OUT } },
})
const groupFadeVariants = (delay: number): Variants => ({
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.3, delay } },
})
const textFadeVariants: Variants = {
    enter: {},
    center: {},
    exit: { opacity: 0, transition: { duration: 0.3 } },
}
const fadeVariants: Variants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
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

    // Text colour follows the background's luminance (light bg -> black, dark bg -> white);
    // forceBlackText stays as an editor override.
    const baseColor = slide.forceBlackText || isLight(bgColor) ? '#000000' : '#FFFFFF'

    const textStyle = { color: baseColor }
    const reduce = useReducedMotion()
    const gv = (delay: number) => (reduce ? groupFadeVariants(delay) : groupVariants(delay))
    const mutedTextStyle = { color: baseColor, opacity: 0.85 }
    const isCentered = slide.layout === 'centered' || slide.contentPosition === 'center'
    const textAlignClass = isCentered ? 'text-center' : 'text-start'

    return (
        <div className="flex flex-col justify-center max-md:justify-end py-10 md:py-16 pointer-events-none h-full w-full">
            <div className={cn(
                "pointer-events-auto w-full transition-all duration-700",
                textAlignClass
            )}>
                {/* Heading and content share one left edge (docs/DESIGN_PRINCIPLES.md) */}
                <motion.div variants={gv(ENTRANCE.a)} className="mb-4 md:mb-6">
                    {preHeading && (
                        <p 
                            className="text-sm font-bold mb-4"
                            style={mutedTextStyle}
                        >
                            {preHeading}
                        </p>
                    )}
                    {title && (
                        <h1 
                            className="text-[clamp(2rem,6vw,4.5rem)] font-bold tracking-tighter leading-display break-words mb-4 md:mb-6 transition-all duration-700"
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
                </motion.div>

                <div className="flex flex-col gap-y-4 transition-all duration-700">
                    {(subtitle || slide.description) && (
                        <motion.div variants={gv(ENTRANCE.c)} className="flex flex-col gap-y-4">
                            {subtitle && (
                                <p 
                                    className="text-base md:text-lg max-w-xl font-medium tracking-tight leading-relaxed"
                                    style={mutedTextStyle}
                                >
                                    {subtitle}
                                </p>
                            )}
                            {slide.description && (
                                <div className="text-sm md:text-base max-w-xl leading-relaxed" style={{ color: baseColor, opacity: 0.9 }}>
                                    <PortableText value={getLocalizedValue(slide.description, locale)} locale={locale} noProse={true} />
                                </div>
                            )}
                        </motion.div>
                    )}
                    <motion.div variants={gv(ENTRANCE.b)} className="flex flex-col gap-y-2 mt-2">
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
                                className="text-sm font-bold"
                                style={mutedTextStyle}
                            >
                                {location}
                            </span>
                        )}
                    </motion.div>
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
    const reduceMotion = useReducedMotion()
    const imgV = reduceMotion ? fadeVariants : imageVariants
    const txtV = reduceMotion ? textFadeVariants : textVariants
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
            className="relative flex w-full flex-col overflow-hidden flex-1 min-h-[600px] max-md:min-h-dvh transition-colors duration-500"
            style={{ backgroundColor: displaySlides[currentSlide]?.gradientColor?.hex || displaySlides[0]?.gradientColor?.hex || '#1A1A1A' }}
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
                        <div className="relative flex w-full flex-1 flex-col">
                            <motion.div variants={imgV} className="relative overflow-hidden max-md:mt-36 max-md:h-[28dvh] md:absolute md:inset-y-0 md:start-0 md:w-1/2">
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
                            </motion.div>
                            <motion.div variants={txtV} className="relative z-20 flex flex-1 flex-col">
                                {/* md: clear the fixed header (~132px incl. status bar) so text centres in the visible hero */}
                                <div className="page-container flex-1 md:grid md:grid-cols-2 md:pt-[132px]">
                                    <div className="max-md:pt-5 max-md:pb-24 md:flex md:items-center md:col-start-2 md:ps-12">
                                        <SlideContent slide={slide} locale={locale} textOnRight />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )

                    const content = splitContent || (
                        <div className="relative flex w-full flex-1 flex-col">
                            {/* Image layer (z-0) */}
                            <motion.div variants={imgV} className="absolute inset-0 z-0">
                                {imageElement}
                                {captionTooltip}
                            </motion.div>

                            {/* Text content layer (z-20) */}
                            <motion.div variants={txtV} className="relative z-20 flex flex-1 flex-col">
                                <div className={`page-container flex flex-1 ${justifyClass}`}>
                                    {/* Phones: image fills the top, text sits below it at full width */}
                                    <div
                                        className="flex items-center max-md:!w-full max-md:items-end max-md:pb-12"
                                        style={{ width: `${contentWidth}%` }}
                                    >
                                        <SlideContent slide={slide} locale={locale} textOnRight={textOnRight} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )

                    return (
                        <motion.div
                            key={index}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="relative flex flex-1 flex-col"
                        >
                            {href !== '#' ? (
                                <Link href={href} className="flex w-full flex-1 flex-col">
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
