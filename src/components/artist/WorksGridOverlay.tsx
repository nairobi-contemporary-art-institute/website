'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'

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
    works: Work[]
    locale: string
    artistName: string
}

export function WorksGridOverlay({ isOpen, onClose, works, locale, artistName }: WorksGridOverlayProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
            <div className="container mx-auto px-6 py-12">
                <header className="flex justify-between items-center mb-16 sticky top-0 bg-white/90 backdrop-blur-sm py-4 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-charcoal">{artistName}</h2>
                        <p className="text-sm text-charcoal/60 uppercase tracking-widest">Works Archive</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8 text-charcoal" />
                    </button>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {works.map((work) => {
                        const title = getLocalizedValue(work.title, locale)
                        return (
                            <div key={work._id} className="group space-y-4">
                                <div className="aspect-square relative bg-charcoal/5 overflow-hidden">
                                    <Image
                                        src={urlFor(work.image).width(600).height(600).url()}
                                        alt={title || 'Artwork'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm text-charcoal">{title}</p>
                                    <p className="text-xs text-charcoal/60">{work.year}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
