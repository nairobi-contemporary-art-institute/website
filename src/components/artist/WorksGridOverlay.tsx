'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

interface Work {
    _id: string
    title: any
    year?: string
    medium?: any
    dimensions?: string
    image: any
}

interface WorksGridOverlayProps {
    isOpen: boolean
    onClose: () => void
    onWorkClick: (index: number) => void
    works: Work[]
    locale: string
    artistName: string
}

export function WorksGridOverlay({ isOpen, onClose, onWorkClick, works, locale, artistName }: WorksGridOverlayProps) {
    const t = useTranslations('Pages.artists')

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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] bg-white overflow-y-auto pt-32">
            <div className="container pb-24">
                <header className="flex justify-between items-end mb-16 border-b border-rich-blue/10 pb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-charcoal tracking-tighter">{artistName}</h2>
                        <p className="text-xs text-charcoal/40 font-bold uppercase tracking-[0.2em] mt-2">{t('worksArchive')}</p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
                    >
                        <X className="w-8 h-8 text-charcoal" strokeWidth={1} />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal/40 group-hover:text-charcoal transition-colors">Close</span>
                    </button>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {works.map((work, index) => {
                        const title = getLocalizedValueAsString(work.title, locale)
                        return (
                            <button 
                                key={work._id} 
                                className="group space-y-4 text-left focus:outline-none"
                                onClick={() => onWorkClick?.(index)}
                            >
                                <div className="aspect-square relative bg-charcoal/5 overflow-hidden">
                                    <Image
                                        src={urlFor(work.image).width(600).height(600).url()}
                                        alt={title || t('artworkLabel')}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        {...(work.image?.asset?.metadata?.lqip && {
                                            placeholder: 'blur',
                                            blurDataURL: work.image.asset.metadata.lqip
                                        })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm text-charcoal group-hover:underline decoration-charcoal/20 transition-all">{title}</p>
                                    <p className="text-xs text-charcoal/60">{getLocalizedValueAsString(work.year, locale)}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
