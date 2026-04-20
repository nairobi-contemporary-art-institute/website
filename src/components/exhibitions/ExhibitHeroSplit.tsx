'use client'

import React from 'react'
import { GridRoot as Grid, GridSystem, Cell as GridCell } from '@/components/ui/Grid/Grid'
import { AnimatedTextArt } from './AnimatedTextArt'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn, formatExhibitionDate } from '@/lib/utils'
import { PortableText } from '@/components/ui/PortableText'

interface ExhibitHeroSplitProps {
    title: any
    startDate: string
    endDate?: string
    intro?: any
    artistName?: string
    location?: string
    admission?: string
    bookingUrl?: string
    textArt?: {
        text?: any[]
        animationStyle?: 'static' | 'marquee' | 'vertical' | 'diagonal' | 'pulsing'
        textOpacity?: number
        placement?: 'full' | 'artwork'
    }
    themeColor?: string
    heroImage?: any
    locale: string
    enquiryModule?: {
        enabled: boolean
        label?: any
        url?: string
        openInNewTab?: boolean
    }
}


export function ExhibitHeroSplit({
    title,
    startDate,
    endDate,
    intro,
    artistName,
    location,
    admission,
    bookingUrl,
    textArt,
    themeColor = '#1A1A1A',
    heroImage,
    locale,
    enquiryModule
}: ExhibitHeroSplitProps) {
    const bgColor = themeColor
    const isDark = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return luma < 128
    }

    const textColor = isDark(bgColor) ? 'white' : 'charcoal'
    const mutedTextColor = isDark(bgColor) ? 'white/60' : 'charcoal/60'
    const subTextColor = isDark(bgColor) ? 'white/80' : 'charcoal/80'

    const localizedTitle = (typeof title === 'string' ? title : getLocalizedValue(title, locale)) || ''
    const displayArtText = getLocalizedValue(textArt?.text, locale) || localizedTitle

    return (
        <section 
            className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden pt-32"
            style={{ backgroundColor: bgColor, '--bg-color': bgColor } as React.CSSProperties}
        >
            {(!textArt?.placement || textArt.placement === 'full' || textArt.placement === 'artwork') && (
                <AnimatedTextArt
                    text={displayArtText}
                    style={textArt?.animationStyle || 'static'}
                    opacity={textArt?.textOpacity ?? 0.15}
                    color={textColor}
                    className={cn(
                        textArt?.placement === 'artwork' && "[mask-image:linear-gradient(to_right,black_60%,transparent_95%)]"
                    )}
                />
            )}

            <GridSystem unstable_useContainer={false} className="relative z-10 w-full px-6 md:px-12">
                <Grid columns={{ sm: 1, md: 12 }}>
                    <GridCell column={{ sm: 1, md: 6 }} className="hidden md:block relative bg-transparent">
                        {heroImage?.asset && (
                                <Image 
                                    src={urlFor(heroImage).url()} 
                                    fill 
                                    alt={localizedTitle || ""}
                                    className="object-contain relative z-10"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                        )}
                    </GridCell>

                    <GridCell column={{ sm: 1, md: 6 }} className="flex flex-col items-start justify-center">
                        <div className="space-y-6 max-w-2xl w-full">
                             {/* Heading Block: Moved right by 5vw (half of 10vw) */}
                            <div className="space-y-4 md:pl-[5vw]">
                                {artistName && (
                                    <h3 className={cn("text-[0.8rem] font-medium uppercase tracking-[0.2em] opacity-90", textColor === 'white' ? 'text-white' : 'text-charcoal')}>
                                        {artistName}
                                    </h3>
                                )}
                                <h1 className={cn("text-[3.5rem] font-black uppercase tracking-tighter leading-[0.85]", textColor === 'white' ? 'text-white' : 'text-charcoal')}>
                                    {localizedTitle}
                                </h1>
                            </div>

                            {/* Content Below: Translated right 10vw on desktop */}
                            <div className="md:pl-[10vw] space-y-6">
                                {intro && (
                                    <div className={cn("text-base md:text-lg leading-snug font-light max-w-xl transition-colors", textColor === 'white' ? 'text-white/90' : 'text-charcoal/80')}>
                                        <PortableText value={intro} locale={locale} noProse={true} />
                                    </div>
                                )}

                                <div className="pt-4 flex flex-col gap-1">
                                    <div className={cn("text-sm md:text-base font-bold tracking-tight", textColor === 'white' ? 'text-white' : 'text-charcoal')}>
                                        {formatExhibitionDate(startDate, endDate, locale)}
                                    </div>
                                    {(location || admission) && (
                                        <div className={cn("text-[0.65rem] md:text-[0.75rem] font-medium uppercase tracking-[0.15em] mt-1 flex flex-wrap gap-x-4", mutedTextColor === 'white/60' ? 'text-white/60' : 'text-charcoal/60')}>
                                            {location && <span>{location}</span>}
                                            {admission && <span className="opacity-70">{admission}</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 flex flex-wrap gap-4">
                                    {enquiryModule?.enabled && (
                                        <a 
                                            href={enquiryModule.url || `/${locale}/contact?subject=Enquiry: ${localizedTitle}`} 
                                            target={enquiryModule.openInNewTab ? "_blank" : "_self"} 
                                            rel={enquiryModule.openInNewTab ? "noopener noreferrer" : undefined}
                                            className={cn(
                                                "inline-flex items-center px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all",
                                                isDark(bgColor) ? "bg-white text-charcoal hover:bg-umber" : "bg-charcoal text-white hover:bg-umber"
                                            )}
                                        >
                                            {getLocalizedValue(enquiryModule.label, locale) || 'Enquire'}
                                        </a>
                                    )}
                                    {bookingUrl && (
                                        <a 
                                            href={bookingUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "inline-flex items-center px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all border",
                                                isDark(bgColor) 
                                                    ? "border-white/20 text-white hover:border-white hover:bg-white/10" 
                                                    : "border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5"
                                            )}
                                        >
                                            Book Tickets
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GridCell>
                </Grid>
            </GridSystem>
        </section>
    )
}
