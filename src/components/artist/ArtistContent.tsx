'use client'

import { useState } from 'react'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { WorkCarousel } from './WorkCarousel'
import { WorksGridOverlay } from './WorksGridOverlay'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ArtCaption } from '@/components/ui/ArtCaption'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface ArtistContentProps {
    artist: any
    locale: string
}

export function ArtistContent({ artist, locale }: ArtistContentProps) {
    const t = useTranslations('Pages.artists')
    const [isGridOpen, setIsGridOpen] = useState(false)

    const name = getLocalizedValue(artist.name, locale)
    const bio = getLocalizedValue(artist.bio, locale)

    return (
        <div className="space-y-24">
            {/* Top Section: Split Layout */}
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                {/* Left: Bio */}
                <div className="space-y-12">
                    <header>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-charcoal">
                            {name}
                        </h1>
                    </header>

                    {bio && (
                        <div className="prose prose-lg max-w-none prose-charcoal leading-relaxed">
                            <PortableText value={bio} locale={locale} />
                        </div>
                    )}

                    {/* Links list if needed (CV, Press etc - can be added later) */}

                    {/* Tags */}
                    {artist.tags && artist.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {artist.tags.map((tag: any) => {
                                const tagTitle = getLocalizedValue(tag.title, locale)
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

                {/* Right: Media Column */}
                <div className="sticky top-32">
                    <WorkCarousel
                        works={artist.works}
                        locale={locale}
                        onOpenGrid={() => setIsGridOpen(true)}
                    />
                </div>
            </div>

            {/* Middle Section: Projects & News */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 pt-24 border-t border-rich-blue/20">
                {/* Projects */}
                {artist.forthcomingProjects && artist.forthcomingProjects.length > 0 && (
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-charcoal tracking-tight">{t('projectsTitle')}</h2>
                        <ul className="space-y-6">
                            {artist.forthcomingProjects.map((project: any, i: number) => (
                                <li key={i} className="group flex flex-col gap-1">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold text-charcoal hover:underline decoration-charcoal/20"
                                    >
                                        {project.title}
                                    </a>
                                    <p className="text-xs text-charcoal/60">
                                        {project.venue}{project.date ? `, ${project.date}` : ''}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* News / Links */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold text-charcoal tracking-tight">{t('newsTitle')}</h2>
                    <ul className="space-y-4">
                        {artist.news?.map((item: any, i: number) => (
                            <li key={i}>
                                <a href={item.link} className="text-sm font-bold border-b border-charcoal/20 hover:border-charcoal transition-colors">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                        {/* Static placeholders from benchmark for now just to match if desired, but better to keep dynamic */}
                        {!artist.news && (
                            <li className="text-xs text-charcoal/40 italic">{t('noNews')}</li>
                        )}
                    </ul>
                </section>
            </div>

            {/* Bottom Section: Museum Exhibitions */}
            {artist.museumExhibitions && artist.museumExhibitions.length > 0 && (
                <section className="space-y-12">
                    <h2 className="text-3xl font-bold text-charcoal tracking-tight">{t('museumExhibitionsTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artist.museumExhibitions.map((exh: any, i: number) => {
                            const caption = getLocalizedValue(exh.image?.caption, locale)
                            return (
                                <div key={i} className="group space-y-4">
                                    <div className="space-y-3">
                                        <div className="aspect-[4/3] relative bg-charcoal/5 overflow-hidden">
                                            {exh.image?.asset && (
                                                <Image
                                                    src={urlFor(exh.image).width(800).height(600).url()}
                                                    alt={exh.title}
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
                                        <h3 className="font-bold text-charcoal leading-snug">{exh.title}</h3>
                                        <p className="text-xs text-charcoal/60">{exh.venue}, {exh.location}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* NCAI Exhibitions Section */}
            {artist.exhibitions && artist.exhibitions.length > 0 && (
                <section className="space-y-12">
                    <h2 className="text-3xl font-bold text-charcoal tracking-tight">{t('ncaiExhibitionsTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artist.exhibitions.map((exhibition: any) => {
                            const exTitle = getLocalizedValue(exhibition.title, locale)
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

            {/* Related Artists Section */}
            {artist.relatedArtists && artist.relatedArtists.length > 0 && (
                <section className="space-y-12">
                    <h2 className="text-3xl font-bold text-charcoal tracking-tight">{t('relatedTitle')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {artist.relatedArtists.map((related: any) => {
                            const relName = getLocalizedValue(related.name, locale)
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
                                                {relName?.[0]}
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

            {/* Overlays */}
            <WorksGridOverlay
                isOpen={isGridOpen}
                onClose={() => setIsGridOpen(false)}
                works={artist.works}
                locale={locale}
                artistName={name || t('artistLabel')}
            />
        </div>
    )
}
