'use client'

import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'

interface InstallationImage {
    asset: any
    caption?: any
}

interface InstallationCarouselProps {
    images: InstallationImage[]
    locale: string
    title?: string
    className?: string
}

/**
 * Side-scrolling carousel of installation views (the exhibition installed in
 * the gallery space). Rendered as the first section of an exhibition page on a
 * WHITE background to distinguish it from the dark works gallery (CinematicGallery).
 *
 * Deliberately lightweight: native overflow-x + scroll-snap, no GSAP scroll-jack.
 * Captions render BELOW each image — never overlaid (client directive).
 */
export function InstallationCarousel({ images, locale, title, className }: InstallationCarouselProps) {
    const validImages = images?.filter(img => img?.asset) || []
    if (validImages.length === 0) return null

    return (
        <section
            className={cn('w-full bg-white pb-12 md:pb-16', className)}
            aria-label={title || 'Installation views'}
        >
            {title && (
                <div className="px-6 md:px-12 mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/40 border-b border-charcoal/5 pb-4">
                        {title}
                    </h2>
                </div>
            )}

            <div className="carousel-scroll flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-6 md:scroll-pl-12 px-6 md:px-12 pb-4">
                {validImages.map((image, i) => {
                    const imageUrl = urlFor(image.asset).height(1200).url()
                    const caption = getLocalizedValue(image.caption, locale)

                    return (
                        <figure
                            key={image.asset?._id || i}
                            className="snap-start shrink-0 flex flex-col w-[78vw] sm:w-[46vw] md:w-[24vw]"
                        >
                            <div className="w-full aspect-[4/3] bg-white overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={caption || `Installation view ${i + 1}`}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                    className="w-full h-full object-cover block"
                                />
                            </div>
                            {caption && (
                                <figcaption className="mt-3 w-full text-xs text-charcoal/60 leading-relaxed">
                                    {caption}
                                </figcaption>
                            )}
                        </figure>
                    )
                })}
            </div>
        </section>
    )
}
