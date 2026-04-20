'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { urlFor } from '@/sanity/lib/image'

interface AnnouncementCard {
  title?: any
  description?: any
  buttonText?: any
  url?: string
  style?: 'primary' | 'secondary'
  state?: 'active' | 'comingSoon'
}

interface AnnouncementBannerProps {
  data: {
    enabled?: boolean
    preHeading?: any
    heading?: any
    briefText?: any
    ctaLabel?: any
    ctaUrl?: string
    logo?: {
      asset?: {
        url: string
        metadata?: {
          lqip?: string
          dimensions?: { width: number; height: number }
        }
      }
    }
    backgroundImage?: {
      asset?: {
        _id: string
        url: string
        metadata?: {
          lqip?: string
          dimensions?: { width: number; height: number }
        }
      }
      hotspot?: { x: number; y: number }
    }
    exploreMore?: {
      title?: any
      cards?: AnnouncementCard[]
      secondaryCta?: {
        text?: any
        url?: string
      }
    }
    pressRelease?: any
    accordionLabel?: any
  }
  locale: string
}

export function AnnouncementBanner({ data, locale }: AnnouncementBannerProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!data?.enabled) return null

  const preHeading = getLocalizedValue(data.preHeading, locale)
  const heading = getLocalizedValue(data.heading, locale)
  const briefText = getLocalizedValue(data.briefText, locale)
  const ctaLabel = getLocalizedValue(data.ctaLabel, locale)
  const pressRelease = getLocalizedValue(data.pressRelease, locale)
  const accordionLabel = getLocalizedValue(data.accordionLabel, locale) || 'Read Full Press Release'
  
  const logoUrl = data.logo?.asset?.url
  const logoDims = data.logo?.asset?.metadata?.dimensions
  const bgImg = data.backgroundImage

  const exploreMore = data.exploreMore
  const exploreTitle = getLocalizedValue(exploreMore?.title, locale) || 'Explore More'
  const secondaryCta = exploreMore?.secondaryCta
  const secondaryText = getLocalizedValue(secondaryCta?.text, locale)

  return (
    <section className="relative bg-[#0A0A0A] border-t border-white/5 py-16 md:py-24 overflow-hidden">
      {/* Background Image Layer */}
      {bgImg?.asset && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(bgImg).width(1920).quality(90).url()}
              alt="Announcement background"
              fill
              className="object-cover transition-opacity duration-700 opacity-40"
              style={{
                objectPosition: bgImg.hotspot 
                  ? `${bgImg.hotspot.x * 100}% ${bgImg.hotspot.y * 100}%` 
                  : 'center'
              }}
              placeholder={bgImg.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={bgImg.asset.metadata?.lqip}
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/70 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/45 lg:to-black/60" />
        </>
      )}

      <div className="container relative z-20 mx-auto px-6 md:px-12">
        {/* Top Section: Title & Brief Text (Persistent) */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-start justify-between gap-8 mb-8">
            <div className="flex-1">
              {preHeading && (
                <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-white/50 mb-6">
                  {preHeading}
                </p>
              )}

              {heading && (
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                  {heading}
                </h2>
              )}
            </div>

            {/* Logo visibility logic */}
            {logoUrl && (
              <div className="hidden lg:block shrink-0 pt-2 px-4">
                <div className="relative h-12 lg:h-14" style={{ aspectRatio: logoDims ? `${logoDims.width} / ${logoDims.height}` : '1 / 1' }}>
                  <Image src={logoUrl} alt="Partner logo" fill className="object-contain brightness-0 invert" sizes="120px" />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Logo */}
          {logoUrl && (
            <div className="lg:hidden mb-8">
              <div className="relative h-10 w-fit" style={{ aspectRatio: logoDims ? `${logoDims.width} / ${logoDims.height}` : '1 / 1' }}>
                <Image src={logoUrl} alt="Partner logo" fill className="object-contain brightness-0 invert" sizes="80px" />
              </div>
            </div>
          )}

          {/* Brief info */}
          {briefText && (
            <div className="text-lg md:text-xl text-white/90 leading-relaxed font-normal prose prose-invert prose-p:text-white/90 prose-a:text-white prose-a:underline drop-shadow-sm mb-10">
              <PortableText value={briefText} locale={locale} />
            </div>
          )}

          {/* Announcement Call to Action (External/Main) */}
          {ctaLabel && data.ctaUrl && (
            <div>
              <a
                href={data.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white"
              >
                <span className="border-b border-white/20 group-hover:border-white transition-colors pb-1">
                  {ctaLabel}
                </span>
                <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
              </a>
            </div>
          )}
        </div>

        {/* Accordion Logic — Contains Full Press Release AND Explore More Section */}
        {pressRelease && (
          <div className="border-t border-white/10 pt-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group flex items-center gap-4 w-full text-left cursor-pointer transition-colors"
              aria-expanded={isOpen}
            >
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-6 h-6 border border-white/10 rounded-full text-white/40 group-hover:text-white group-hover:border-white/30"
              >
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">
                {accordionLabel}
              </span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 pt-12 lg:pt-20">
                    
                    {/* Left Side: Long-form Press Release */}
                    <div className="lg:col-span-6 flex flex-col">
                      <div className="text-base text-white/70 leading-relaxed font-light prose prose-invert prose-p:text-white/70 prose-strong:text-white/90">
                        <PortableText value={pressRelease} locale={locale} />
                      </div>
                    </div>

                    {/* Right Side: Explore More Grid */}
                    <div className="lg:col-span-6 flex flex-col">
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase mb-12 lg:mb-16">
                        {exploreTitle}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-8 mb-16">
                        {exploreMore?.cards?.map((card, idx) => {
                          const title = getLocalizedValue(card.title, locale)
                          const desc = getLocalizedValue(card.description, locale)
                          const btn = getLocalizedValue(card.buttonText, locale)
                          const isComingSoon = card.state === 'comingSoon'

                          return (
                            <div 
                              key={idx} 
                              className={`flex flex-col gap-6 ${isComingSoon ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                            >
                              <div className="h-[1px] w-full bg-white/10" />
                              <div className="flex flex-col gap-4 flex-1">
                                <h4 className="text-base font-bold text-white uppercase tracking-wider leading-tight">
                                  {title}
                                </h4>
                                <p className="text-sm text-white/60 leading-relaxed font-light">
                                  {desc}
                                </p>
                              </div>

                              {!isComingSoon ? (
                                <a 
                                  href={card.url || '#'} 
                                  target={card.url?.startsWith('http') ? '_blank' : '_self'}
                                  className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white"
                                >
                                  <span className="border-b border-white/10 group-hover:border-white transition-colors pb-1">
                                    {btn || 'Explore'}
                                  </span>
                                  <div className="w-6 h-[1px] bg-white/10 group-hover:w-10 group-hover:bg-white transition-all duration-300" />
                                </a>
                              ) : (
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 italic">
                                  {btn || 'Coming Soon'}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Secondary CTA */}
                      {secondaryText && (
                        <div className="mt-auto flex justify-start lg:justify-end border-t border-white/5 pt-10">
                          <a 
                            href={secondaryCta?.url || '#'} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-start lg:items-end gap-2"
                          >
                            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                              {secondaryText}
                            </span>
                            <div className="h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-500" />
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
