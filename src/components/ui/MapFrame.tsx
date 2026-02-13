'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MapFrameProps {
    className?: string
    address?: string
}

export function MapFrame({ className, address = 'Nairobi Contemporary Art Institute, Kuona Artists Collective, Likoni Ln, Nairobi, Kenya' }: MapFrameProps) {
    const encodedAddress = encodeURIComponent(address)
    // Using a grayscale filter for a premium look
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodedAddress}`

    return (
        <div className={cn("relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-sm grayscale contrast-[1.1] brightness-[1.05]", className)}>
            <iframe
                title="Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
            />
            {/* Overlay to catch clicks and provide a consistent feel if needed */}
            <div className="absolute inset-0 pointer-events-none border border-black/5 ring-1 ring-inset ring-white/10" />
        </div>
    )
}
