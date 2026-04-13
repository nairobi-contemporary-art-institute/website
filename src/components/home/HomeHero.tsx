'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'

interface FeaturedCard {
    title: any
    subtitle: any
    image: any
    link: {
        reference?: {
            _type: string
            slug: string
            title?: any
            name?: any
        }
        externalUrl?: string
    }
}

interface HomeHeroProps {
    exhibition?: any
    featuredCards?: FeaturedCard[]
    locale: string
}

export function HomeHero({ exhibition, featuredCards, locale }: HomeHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Independent scroll effect for the right column
    // We want the right side to move faster (parallax)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])

    const getLinkHref = (card: FeaturedCard) => {
        if (card.link.externalUrl) return card.link.externalUrl
        if (card.link.reference) {
            const type = card.link.reference._type
            const slug = card.link.reference.slug
            if (type === 'exhibition') return `/${locale}/exhibitions/${slug}`
            if (type === 'post') return `/${locale}/channel/${slug}`
            if (type === 'program') return `/${locale}/education/${slug}`
            if (type === 'event') return `/${locale}/events/${slug}`
            if (type === 'artist') return `/${locale}/artists/${slug}`
        }
        return '#'
    }

    const exhibitionTitle = exhibition ? getLocalizedValue(exhibition.title, locale) : ''
    const exhibitionSlug = exhibition ? exhibition.slug : ''
    const displayImage = exhibition?.homepageImage || exhibition?.mainImage

    return (
        <section ref={containerRef} className="relative w-full bg-white flex flex-col lg:flex-row border-b border-rich-blue/20 overflow-hidden">
            {/* Left Column: Primary Exhibition */}
            <div className="w-full lg:w-3/5 flex flex-col px-6 pb-6 lg:px-12 lg:pb-12 border-r border-rich-blue/20">
                <Link
                    href={`/${locale}/exhibitions/${exhibitionSlug}`}
                    className="relative w-full overflow-hidden bg-charcoal/5 group mb-4 lg:mb-6"
                >
                    {displayImage?.asset && (
                        <Image
                            src={urlFor(displayImage).width(1600).url()}
                            alt={exhibitionTitle || 'Exhibition Image'}
                            width={displayImage.asset?.metadata?.dimensions?.width || 1600}
                            height={displayImage.asset?.metadata?.dimensions?.height || 1200}
                            className="w-full h-auto block"
                            priority
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            placeholder="blur"
                            blurDataURL={displayImage.asset?.metadata?.lqip}
                        />
                    )}
                </Link>

                <div className="flex flex-col">
                    <p className="text-[20px] font-black tracking-tighter capitalize mb-0.5 text-charcoal/40 leading-[0.85]">
                        {exhibition && new Date(exhibition.startDate) > new Date() ? 'Upcoming Exhibition' : 'Current Exhibition'}
                    </p>
                    <Link href={`/${locale}/exhibitions/${exhibitionSlug}`} className="group inline-block">
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter mb-3 group-hover:text-umber transition-colors duration-500 capitalize"
                        >
                            {exhibitionTitle}
                        </h1>
                    </Link>

                    <div className="flex flex-col gap-1.5">
                        {exhibition?.startDate && (
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold tracking-[0.4em] capitalize text-charcoal/60 mb-0.5">Opens</span>
                                <span className="text-2xl md:text-3xl lg:text-[32px] font-black tracking-tighter leading-none text-charcoal">
                                    {new Date(exhibition.startDate).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    <span className="ml-4 text-charcoal/30 text-xl md:text-2xl lg:text-[24px]">
                                        {new Date(exhibition.startDate).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                </span>
                            </div>
                        )}

                        {exhibition?.endDate && (
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold tracking-[0.4em] capitalize text-charcoal/60">Through</span>
                                <span
                                    className="text-[20px] font-black tracking-tighter leading-none capitalize text-charcoal"
                                >
                                    {new Date(exhibition.endDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' }).replace('.', '')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Divider at the bottom of the content */}
                    <div className="mt-5 border-b-[3px] border-charcoal w-full" />
                </div>
            </div>

            {/* Right Column: Featured Cards (Faster Scrolling Wrapper) */}
            <div className="w-full lg:w-2/5 relative bg-white border-r border-rich-blue/20 lg:border-r-0">
                <motion.div
                    style={{ y: rightY }}
                    className="flex flex-col px-6 pb-6 lg:px-12 lg:pb-12 space-y-10 lg:space-y-20"
                >
                    {featuredCards?.map((card, index) => {
                        const cardTitle = getLocalizedValue(card.title, locale)
                        const cardSubtitle = getLocalizedValue(card.subtitle, locale)
                        const href = getLinkHref(card)
                        const imageDimensions = card.image?.asset?.metadata?.dimensions

                        return (
                            <Link key={index} href={href} className="group block">
                                <div className="relative w-full overflow-hidden bg-charcoal/5 mb-4">
                                    {card.image?.asset && (
                                        <Image
                                            src={urlFor(card.image).width(800).url()}
                                            alt={cardTitle || 'Featured Card'}
                                            width={imageDimensions?.width || 800}
                                            height={imageDimensions?.height || 600}
                                            className="w-full h-auto object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3
                                        style={{ textTransform: 'capitalize' }}
                                        className="text-3xl lg:text-5xl font-black leading-[0.85] tracking-tighter text-charcoal group-hover:text-umber transition-colors duration-500"
                                    >
                                        {cardTitle}
                                    </h3>
                                    <p className="text-[10px] font-bold tracking-[0.2em] capitalize text-charcoal/40 group-hover:text-charcoal transition-colors">
                                        {cardSubtitle}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Filler space to ensure scroll range */}
                    <div className="h-48 lg:h-96" />
                </motion.div>
            </div>
        </section>
    )
}
