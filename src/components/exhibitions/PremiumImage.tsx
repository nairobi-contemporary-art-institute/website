'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MarkdownText } from '@/components/ui/MarkdownText'

interface PremiumImageProps {
    src: string
    alt: string
    caption?: string
    className?: string
    priority?: boolean
    id?: string
}

/**
 * PremiumImage component inspired by high-fidelity exhibition galleries.
 * Features clinical-luxury typography and constrained aspect ratios.
 */
export function PremiumImage({ 
    src, 
    alt, 
    caption, 
    className, 
    priority = false,
    id = 'component'
}: PremiumImageProps) {
    return (
        <div className={cn("flex flex-col items-center gap-6", className)}>
            <div className="relative overflow-hidden group">
                <Image
                    id={id}
                    src={src}
                    alt={alt}
                    width={1200}
                    height={900}
                    priority={priority}
                    className="max-w-full h-auto object-contain vertical-top"
                    style={{ maxHeight: '700px' }}
                />
            </div>
            
            {caption && (
                <p className="premium-gallery-text text-center text-[17px] md:text-[21px] lg:text-[22px] max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {caption ? <MarkdownText text={caption} /> : null}
                </p>
            )}
        </div>
    )
}
