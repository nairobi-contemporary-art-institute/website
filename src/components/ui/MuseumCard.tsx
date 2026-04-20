import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { MuseumCardData } from '@/lib/types/museum-card'
import { cn } from '@/lib/utils'

interface MuseumCardProps {
    data: MuseumCardData;
    className?: string;
    aspectRatio?: string;
}

export function MuseumCard({ data, className, aspectRatio = "aspect-square" }: MuseumCardProps) {
    const { href, label, title, subtitle, date, image, backgroundColor } = data;
    
    // Default fallback color if no image and no bg color is specified
    const bgColor = backgroundColor || '#1a1a1a';

    return (
        <Link 
            href={href} 
            className={cn(
                "group relative block overflow-hidden w-full text-white transition-opacity hover:opacity-100",
                aspectRatio,
                className
            )}
            style={{ backgroundColor: bgColor }}
        >
            {/* Background Image */}
            {image?.asset && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={urlFor(image).url()}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient Overlay for text readable contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-70" />
                </div>
            )}

            {/* Content Container - Overlay style */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8">
                {/* Top Section: Label & Date */}
                <div className="flex justify-between items-start gap-4">
                    <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/90">
                        {label}
                    </span>
                    
                    {date && (
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/100">
                            {date}
                        </span>
                    )}
                </div>

                {/* Bottom Section: Title & Subtitle */}
                <div className="mt-auto">
                    <h3 className="uppercase tracking-tighter">
                        <span className="block text-2xl lg:text-3xl xl:text-4xl leading-none font-black">{title}</span>
                        {subtitle && (
                            <span className="block text-lg lg:text-xl leading-tight font-normal mt-2 opacity-90">{subtitle}</span>
                        )}
                    </h3>
                </div>
            </div>
        </Link>
    )
}
