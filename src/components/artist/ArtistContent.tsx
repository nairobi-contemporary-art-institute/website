'use client'

import { useState } from 'react'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { WorkCarousel } from './WorkCarousel'
import { WorksGridOverlay } from './WorksGridOverlay'
import { WorkLightbox } from './WorkLightbox'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ArtCaption } from '@/components/ui/ArtCaption'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface ArtistContentProps {
    artist: any
    locale: string
}

export function ArtistContent({ artist, locale }: ArtistContentProps) {
    const t = useTranslations('Pages.artists')
    const [isGridOpen, setIsGridOpen] = useState(false)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0) // Track selected work for lightbox

    const name = getLocalizedValueAsString(artist.name, locale) || ''
    const bio = getLocalizedValue(artist.bio, locale)

    const handleWorkClick = (index: number) => {
        setIsGridOpen(false)
        setSelectedWorkIndex(index)
        setIsLightboxOpen(true)
    }
    
    // Combine manually selected (featured) and automatically referenced exhibitions
    const featuredExhibitions = artist.featuredExhibitions || []
    const referencedExhibitions = artist.exhibitions || []
    const allExhibitions = Array.from(
        new Map([...featuredExhibitions, ...referencedExhibitions].map(item => [item._id, item])).values()
    )

    return (
        <div className="space-y-24">
            {/* Top Section: Split Layout */}
            <header className="border-b border-charcoal/5 pb-8 mb-16">
                <h1 className="text-[39px] leading-[46px] font-bold text-charcoal tracking-tight">
                    {name}
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
                {/* Left Side: Bio (5 columns) */}
                <div className="md:col-span-5 space-y-12">
                    {bio && (
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40 border-b border-charcoal/5 pb-2">
                                Brief Bio
                            </h2>
                            <div className="text-base leading-[20px] font-normal text-charcoal/80">
                                <PortableText value={bio} locale={locale} />
                            </div>
                        </div>
                    )}

                    {/* Artist Profile Image */}
                    {artist.image?.asset && (
                        <div className="pt-12 max-w-md">
                            <div className="aspect-[3/4] relative bg-charcoal/5 overflow-hidden">
                                <Image
                                    src={urlFor(artist.image).width(1200).url()}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    {...(artist.image.asset?.metadata?.lqip && {
                                        placeholder: 'blur',
                                        blurDataURL: artist.image.asset.metadata.lqip
                                    })}
                                />
                            </div>
                            {artist.image.caption && (
                                <div className="text-[10px] text-charcoal/50 mt-4 leading-relaxed border-l border-rich-blue/20 pl-3 italic">
                                    <ArtCaption content={getLocalizedValue(artist.image.caption, locale)} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Long Bio and CV Section */}
                    {(() => {
                        const localizedLongBio = getLocalizedValue(artist.longBio, locale)
                        if (!localizedLongBio || (Array.isArray(localizedLongBio) && localizedLongBio.length === 0)) return null
                        
                        return (
                            <div className="pt-16 max-w-none">
                                <h2 className="text-[26px] leading-[31px] font-bold text-charcoal mb-8 tracking-tight border-b border-charcoal/5 pb-4">
                                    More on {name}
                                </h2>
                                <div className="text-base leading-[20px] font-normal text-charcoal/80">
                                    <PortableText value={localizedLongBio} locale={locale} />
                                </div>
                            </div>
                        )
                    })()}

                    {/* Tags */}
                    {artist.tags && artist.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {artist.tags.map((tag: any) => {
                                const tagTitle = getLocalizedValueAsString(tag.title, locale)
                                return (
                                    <span
                                        key={tag._id}
                                        className="inline-flex items-center px-2 py-1 bg-charcoal/5 text-charcoal/60 text-xs tracking-wider font-medium"
                                    >
                                        {tagTitle}
                                    </span>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Right Side: Gallery (7 columns) */}
                <div className="md:col-span-7 sticky top-32">
                    <WorkCarousel
                        works={artist.works}
                        locale={locale}
                        artistName={name}
                        onOpenGrid={() => setIsGridOpen(true)}
                    />
                </div>
            </div>

            {/* Section: Forthcoming Projects */}
            {artist.forthcomingProjects && artist.forthcomingProjects.length > 0 && (
                <section className="space-y-8 pt-24 border-t border-rich-blue/20">
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">{t('projectsTitle')}</h2>
                    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artist.forthcomingProjects.map((project: any, i: number) => {
                            const pTitle = getLocalizedValueAsString(project.title, locale)
                            const pVenue = getLocalizedValueAsString(project.venue, locale)
                            
                            return (
                                <li key={i} className="group flex flex-col gap-1">
                                    <h3 className="text-sm font-bold text-charcoal">
                                        {pTitle}
                                    </h3>
                                    <p className="text-xs text-charcoal/60">
                                        {pVenue}{project.date ? `, ${project.date}` : ''}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            )}

            {/* NCAI Exhibitions Section */}
            {allExhibitions.length > 0 && (
                <section className={cn("space-y-12", !artist.forthcomingProjects && "pt-24 border-t border-rich-blue/20")}>
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">{t('ncaiExhibitionsTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allExhibitions.map((exhibition: any) => {
                            const exTitle = getLocalizedValueAsString(exhibition.title, locale)
                            return (
                                <a
                                    key={exhibition._id}
                                    href={`/${locale}/exhibitions/${exhibition.slug || ''}`}
                                    className="group space-y-4"
                                >
                                    <div className="aspect-[4/3] relative bg-charcoal/5 overflow-hidden">
                                        {exhibition.mainImage?.asset ? (
                                            <Image
                                                src={urlFor(exhibition.mainImage).width(800).height(600).url()}
                                                alt={exTitle || t('exhibition')}
                                                fill
                                                className="object-cover group-hover:scale-102 transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                {...(exhibition.mainImage.asset.metadata?.lqip && {
                                                    placeholder: 'blur',
                                                    blurDataURL: exhibition.mainImage.asset.metadata.lqip
                                                })}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-umber/20">{t('noImage')}</div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-charcoal leading-snug group-hover:underline italic transition-all decoration-charcoal/20">{exTitle}</h3>
                                        {exhibition.startDate && (
                                            <p className="text-[10px] tracking-widest text-charcoal/60 mt-2 font-medium">
                                                {new Date(exhibition.startDate).getFullYear()}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Artist Posts Section (Channel Content) */}
            {artist.artistPosts && artist.artistPosts.length > 0 && (
                <section className="space-y-12 border-t border-rich-blue/10 pt-24">
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">From the Channel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {artist.artistPosts.map((post: any) => {
                            const postTitle = getLocalizedValueAsString(post.title, locale)
                            return (
                                <Link
                                    key={post._id}
                                    href={`/${locale}/channel/${post.slug || ''}`}
                                    className="group flex flex-col md:flex-row gap-6 bg-charcoal/[0.02] hover:bg-charcoal/[0.04] p-6 transition-colors border-l-2 border-transparent hover:border-ochre shadow-sm"
                                >
                                    <div className="w-full md:w-1/3 aspect-[4/3] relative overflow-hidden bg-charcoal/5 flex-none">
                                        {post.mainImage?.asset && (
                                            <Image
                                                src={urlFor(post.mainImage).width(400).height(300).url()}
                                                alt={postTitle || 'Channel post'}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] uppercase tracking-widest text-ochre font-bold">
                                                {post.mediaType === 'video' ? 'VIDEO' : 'STORY'}
                                            </span>
                                            {post.publishedAt && (
                                                <span className="text-[10px] text-charcoal/40 uppercase tracking-widest">
                                                    {new Date(post.publishedAt).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-charcoal leading-tight group-hover:text-ochre transition-colors">
                                            {postTitle}
                                        </h3>
                                        {post.excerpt && (() => {
                                            const excerptText = getLocalizedValueAsString(post.excerpt, locale)
                                            return excerptText ? (
                                                <p className="text-sm text-charcoal/60 line-clamp-2 italic font-serif">
                                                    {excerptText}
                                                </p>
                                            ) : null
                                        })()}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Bottom Section: Museum Exhibitions */}
            {artist.museumExhibitions && artist.museumExhibitions.length > 0 && (
                <section className="space-y-12">
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">{t('museumExhibitionsTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artist.museumExhibitions.map((exh: any, i: number) => {
                            const caption = getLocalizedValueAsString(exh.image?.caption, locale)
                            const exTitle = getLocalizedValueAsString(exh.title, locale)
                            const exVenue = getLocalizedValueAsString(exh.venue, locale)
                            const exLocation = getLocalizedValueAsString(exh.location, locale)
                            
                            return (
                                <div key={i} className="group space-y-4">
                                    <div className="space-y-3">
                                        <div className="aspect-[4/3] relative bg-charcoal/5 overflow-hidden">
                                            {exh.image?.asset && (
                                                <Image
                                                    src={urlFor(exh.image).width(800).height(600).url()}
                                                    alt={exTitle}
                                                    fill
                                                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    placeholder="blur"
                                                    blurDataURL={exh.image.asset?.metadata?.lqip}
                                                />
                                            )}
                                        </div>
                                        {caption && (
                                            <div className="text-[10px] text-charcoal/50 leading-relaxed border-l border-rich-blue/20 pl-3">
                                                <ArtCaption content={caption} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-charcoal leading-snug">{exTitle}</h3>
                                        <p className="text-xs text-charcoal/60">{exVenue}, {exLocation}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Related Artists Section */}
            {artist.relatedArtists && artist.relatedArtists.length > 0 && (
                <section className="space-y-12">
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">{t('relatedTitle')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {artist.relatedArtists.map((related: any) => {
                            const relName = getLocalizedValueAsString(related.name, locale)
                            return (
                                <Link
                                    key={related._id}
                                    href={`/${locale}/artists/${related.slug || ''}`}
                                    className="group space-y-3"
                                >
                                    <div className="aspect-[3/4] relative bg-charcoal/5 overflow-hidden">
                                        {related.image?.asset ? (
                                            <Image
                                                src={urlFor(related.image).width(400).height(600).url()}
                                                alt={relName || t('artistLabel')}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                                {...(related.image.asset.metadata?.lqip && {
                                                    placeholder: 'blur',
                                                    blurDataURL: related.image.asset.metadata.lqip
                                                })}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-charcoal/20 text-2xl font-bold">
                                                {typeof relName === 'string' ? relName[0]?.toUpperCase() : ''}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xs font-bold text-charcoal leading-tight group-hover:underline decoration-charcoal/20 transition-all capitalize tracking-tight">
                                        {relName}
                                    </h3>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Section: News / Links (Moved to bottom) */}
            {(artist.news && artist.news.length > 0) && (
                <section className="space-y-12 pt-12 border-t border-rich-blue/10">
                    <h2 className="text-[26px] leading-[31px] font-bold text-charcoal tracking-tight">{t('newsTitle')}</h2>
                    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {artist.news.map((item: any, i: number) => (
                            <li key={i} className="group">
                                <a 
                                    href={item.link} 
                                    className="block group-hover:underline decoration-charcoal/20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <h3 className="font-bold text-charcoal leading-snug">{getLocalizedValueAsString(item.title, locale)}</h3>
                                    {item.date && (
                                        <p className="text-[10px] tracking-widest text-charcoal/40 mt-3 font-bold uppercase">{new Date(item.date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</p>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Overlays */}
            <WorksGridOverlay
                isOpen={isGridOpen}
                onClose={() => setIsGridOpen(false)}
                onWorkClick={handleWorkClick}
                works={artist.works}
                locale={locale}
                artistName={name || t('artistLabel')}
            />

            <WorkLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                works={artist.works}
                initialIndex={selectedWorkIndex}
                locale={locale}
                artistName={name}
            />
        </div>
    )
}
