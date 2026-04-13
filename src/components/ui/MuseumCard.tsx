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
                <div className="absolute inset-0 z-0 transition-opacity duration-500 group-hover:opacity-0">
                    <Image
                        src={urlFor(image).url()}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient Overlay for text readable contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 opacity-80" />
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8">
                {/* Top Section: Label + Main Titles */}
                <div className="space-y-4">
                    <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/90">
                        {label}
                    </span>
                    
                    <h3 className="uppercase tracking-tighter">
                        <span className="block text-2xl leading-[1.5rem] font-bold">{title}</span>
                        {subtitle && (
                            <span className="block text-xl leading-[1.25rem] font-normal mt-2 opacity-90">{subtitle}</span>
                        )}
                    </h3>
                </div>

                {/* Bottom Section: Date/Meta */}
                {date && (
                    <div className="mt-auto">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/90">
                            {date}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    )
}
