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
    priority?: boolean;
}

/**
 * No text over artwork. With an image, the image stays clean; on hover a milky
 * panel fades in and reveals the text. On touch devices (no hover) the caption
 * sits below the image instead. Without an image the card is a solid colour
 * block and text sits on it.
 */
export function MuseumCard({ data, className, aspectRatio = "aspect-square", priority = false }: MuseumCardProps) {
    const { href, label, title, subtitle, date, image, backgroundColor } = data;
    const hasImage = !!image?.asset;

    // Default fallback color if no image and no bg color is specified
    const bgColor = backgroundColor || 'var(--color-background-dark)';

    const text = (
        <>
            <div className="flex justify-between items-start gap-4 text-xs font-bold">
                <span>{label}</span>
                {date && <span>{date}</span>}
            </div>
            <div className="mt-auto">
                <h3 className="tracking-tight">
                    <span className="block text-2xl lg:text-3xl font-bold leading-tight">{title}</span>
                    {subtitle && (
                        <span className="block text-lg leading-tight font-normal mt-2">{subtitle}</span>
                    )}
                </h3>
            </div>
        </>
    );

    return (
        <Link
            href={href}
            className={cn("group block w-full", className)}
        >
            <div
                className={cn("relative overflow-hidden w-full", aspectRatio, hasImage ? "text-charcoal" : "text-white")}
                style={{ backgroundColor: hasImage ? undefined : bgColor }}
            >
                {hasImage && (
                    <>
                        <Image
                            src={urlFor(image!).url()}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={priority}
                        />
                        {/* Hover reveal: milky panel + text (hover-capable devices only) */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 bg-white/90 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:hidden"
                        >
                            {text}
                        </div>
                    </>
                )}
                {!hasImage && (
                    <div className="flex flex-col justify-between h-full p-6 md:p-8">{text}</div>
                )}
            </div>
            {/* Touch fallback: caption below the image */}
            {hasImage && (
                <div className="hidden [@media(hover:none)]:block pt-3 text-charcoal">
                    <p className="text-xs font-bold">{label}{date ? ` · ${date}` : ''}</p>
                    <p className="text-lg font-bold leading-tight mt-1">{title}</p>
                    {subtitle && <p className="text-sm font-normal mt-1">{subtitle}</p>}
                </div>
            )}
        </Link>
    )
}
