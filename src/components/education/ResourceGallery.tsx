'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { PDFViewerModal } from '../ui/PDFViewerModal'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { FileText, Eye, Download } from 'lucide-react'

interface Resource {
    _id: string
    title: any
    type: string
    fileUrl: string
    fileSize: number
    coverImage: any
    audience: string
    ageRange?: any
    exhibition?: { title: any }
    exhibitionFallback?: any
    featured?: boolean
}

interface ResourceGalleryProps {
    resources: Resource[]
    locale: string
}

export function ResourceGallery({ resources, locale }: ResourceGalleryProps) {
    const t = useTranslations('Pages.education.resources')
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <section id="resources" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col mb-16">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-ochre font-bold mb-4">
                        {t('subtitle')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight text-charcoal mb-6">
                        {t('title')}
                    </h2>
                    <p className="max-w-2xl text-stone-500 leading-relaxed italic">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {resources.map((resource) => {
                        const title = getLocalizedValueAsString(resource.title, locale)
                        const ageRange = getLocalizedValueAsString(resource.ageRange, locale)
                        const exhTitle = resource.exhibition 
                            ? getLocalizedValueAsString(resource.exhibition.title, locale)
                            : getLocalizedValueAsString(resource.exhibitionFallback, locale)

                        return (
                            <div key={resource._id} className="group flex flex-col h-full">
                                {/* External Left-Aligned Title - Fixed height to align images */}
                                <div className="mb-3 min-h-[75px] flex flex-col justify-between">
                                    <h3 className="text-lg font-bold tracking-tight text-charcoal group-hover:text-ochre transition-colors duration-300">
                                        {title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                                            {t(`types.${resource.type}`)}
                                            {ageRange && ` — ${ageRange}`}
                                        </span>
                                        {exhTitle && (
                                            <>
                                                <span className="text-[10px] text-stone-300">•</span>
                                                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium italic">
                                                    {exhTitle}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Square Card with Hover Reveals */}
                                <div 
                                    className="relative aspect-square bg-stone-100 overflow-hidden cursor-pointer group/card"
                                    onClick={() => setSelectedResource(resource)}
                                >
                                    {resource.coverImage && (
                                        <Image
                                            src={urlFor(resource.coverImage).width(800).height(800).url() || ''}
                                            alt={title}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover/card:scale-105"
                                        />
                                    )}

                                    {/* Glassmorphism Overlay on Hover */}
                                    <div className="absolute inset-0 bg-charcoal/0 group-hover/card:bg-charcoal/40 transition-all duration-500 backdrop-blur-0 group-hover/card:backdrop-blur-sm flex items-center justify-center">
                                        <div className="flex flex-col items-center scale-90 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-500">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
                                                <Eye className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">
                                                {t('viewResource')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Size Badge */}
                                    <div className="absolute bottom-6 left-6 flex items-center space-x-2 translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-100">
                                        <FileText className="w-4 h-4 text-white/60" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">
                                            {formatFileSize(resource.fileSize)}
                                        </span>
                                    </div>
                                    
                                    {/* Audience Tag */}
                                    <div className="absolute top-6 right-6">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest font-black text-white">
                                            {t(`audiences.${resource.audience}`)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {selectedResource && (
                <PDFViewerModal
                    isOpen={!!selectedResource}
                    onClose={() => setSelectedResource(null)}
                    fileUrl={selectedResource.fileUrl}
                    title={getLocalizedValueAsString(selectedResource.title, locale)}
                />
            )}
        </section>
    )
}
