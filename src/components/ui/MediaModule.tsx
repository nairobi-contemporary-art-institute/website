'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { LucidePlay, LucideArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MediaModuleProps {
    title: string
    label?: string
    url?: string
    bgImage?: any
    bgColor?: string
    className?: string
}

export function MediaModule({
    title,
    label = "Listen Now",
    url,
    bgImage,
    bgColor = '#E53935', // Default red from IMMA style
    className
}: MediaModuleProps) {
    const content = (
        <div 
            className={cn(
                "relative w-full aspect-[16/7] md:aspect-[21/6] flex items-center p-8 md:px-16 overflow-hidden group cursor-pointer transition-all duration-500",
                "hover:shadow-2xl hover:shadow-charcoal/20",
                className
            )}
            style={{ backgroundColor: bgColor }}
        >
            {/* Background Image Layer */}
            {bgImage && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={urlFor(bgImage).width(1920).url()}
                        alt={title}
                        fill
                        className="object-cover opacity-30 mix-blend-luminosity transition-all duration-1000 group-hover:scale-105 group-hover:opacity-50 group-hover:mix-blend-multiply"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            )}

            <div className="relative z-10 w-full flex items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.8] max-w-3xl transition-transform duration-500 group-hover:translate-x-2">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/70 font-bold uppercase tracking-[0.2em] text-[10px] mt-6 transition-all duration-300 group-hover:text-white group-hover:gap-5">
                        <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 transition-all" />
                        <span>{label}</span>
                        <LucideArrowRight className="w-3 h-3" />
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-charcoal group-hover:border-transparent">
                        <LucidePlay className="w-8 h-8 md:w-12 md:h-12 fill-current translate-x-1" />
                    </div>
                </div>
            </div>
        </div>
    )

    if (url) {
        const isExternal = url.startsWith('http')
        if (isExternal) {
            return <a href={url} target="_blank" rel="noopener noreferrer">{content}</a>
        }
        return <Link href={url}>{content}</Link>
    }

    return content
}
