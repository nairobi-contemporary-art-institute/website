'use client'

import React from 'react'
import Image from 'next/image'
import LightGallery from 'lightgallery/react'

// import styles
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

// import plugins if needed
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

import { urlFor } from '@/sanity/lib/image'
import { ArtCaption } from './ArtCaption'

// Custom style for lightbox captions handled in globals.css

interface GalleryImage {
    asset: any
    caption?: any
}

interface GalleryProps {
    images: GalleryImage[]
    locale: string
}

export function Gallery({ images, locale }: GalleryProps) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const validImages = React.useMemo(() => images?.filter(img => img?.asset) || [], [images])
    if (!validImages || validImages.length === 0) return null
    if (!mounted) return (
        <section className="my-24 border-t border-rich-blue/20 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                {validImages.map((image, i) => {
                    const imageUrl = urlFor(image).width(1200).url()
                    const localizedCaption = image.caption ? (
                        typeof image.caption === 'string'
                            ? image.caption
                            : (image.caption[locale] || image.caption['en'] || '')
                    ) : ''

                    return (
                        <div key={i} className="space-y-4 block">
                            <div className="relative bg-charcoal/5">
                                <Image
                                    src={imageUrl}
                                    alt={localizedCaption || `Gallery image ${i + 1}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto block"
                                />
                            </div>
                            {localizedCaption && (
                                <div className="max-w-md text-xs text-umber/50 leading-relaxed">
                                    <ArtCaption content={localizedCaption} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )

    return (
        <section className="my-24 border-t border-rich-blue/20 pt-20">
            <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20"
                mobileSettings={{
                    controls: false,
                    showCloseIcon: true,
                    download: false,
                }}
            >
                {validImages.map((image, i) => {
                    const imageUrl = urlFor(image).width(1200).url()
                    const fullImageUrl = urlFor(image).width(2400).url()

                    // Localize the caption for both the Lightbox and the on-page display
                    const localizedCaption = image.caption ? (
                        typeof image.caption === 'string'
                            ? image.caption
                            : (image.caption[locale] || image.caption['en'] || '')
                    ) : ''

                    return (
                        <a
                            key={i}
                            href={fullImageUrl}
                            className="space-y-4 block group cursor-zoom-in"
                            data-sub-html={localizedCaption ? `<div class="lg-caption">${localizedCaption}</div>` : undefined}
                        >
                            <div className="relative bg-charcoal/5">
                                <Image
                                    src={imageUrl}
                                    alt={localizedCaption || `Gallery image ${i + 1}`}
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto block transition-opacity duration-300 group-hover:opacity-90"
                                />
                            </div>
                            {localizedCaption && (
                                <div className="max-w-md text-xs text-umber/50 leading-relaxed">
                                    <ArtCaption content={localizedCaption} />
                                </div>
                            )}
                        </a>
                    )
                })}
            </LightGallery>
        </section>
    )
}
