'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'

interface GalleryImage {
    asset: any
    caption?: any
}

interface HorizontalGalleryProps {
    images: GalleryImage[]
    locale: string
    title?: string
    className?: string
}

export function HorizontalGallery({ images, locale, title, className }: HorizontalGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    
    const validImages = images?.filter(img => img?.asset) || []
    if (validImages.length === 0) return null

    return (
        <section className={cn("w-full py-20 bg-sun-bleached-paper/30", className)}>
            {title && (
                <div className="px-6 md:px-12 mb-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/40 border-b border-charcoal/5 pb-4">
                        {title}
                    </h3>
                </div>
            )}

            <div className="px-6 md:px-12">
                <div className="flex gap-1 md:gap-2 h-[500px] md:h-[700px] w-full overflow-hidden">
                    {validImages.map((image, i) => {
                        const isActive = activeIndex === i
                        const imageUrl = urlFor(image.asset).width(isActive ? 2000 : 800).url()
                        const localizedCaption = getLocalizedValue(image.caption, locale)

                        return (
                            <motion.div
                                key={i}
                                layout
                                onClick={() => setActiveIndex(i)}
                                transition={{
                                    layout: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
                                }}
                                className={cn(
                                    "relative h-full cursor-pointer transition-all duration-300",
                                    isActive ? "flex-[10] md:flex-[12]" : "flex-1 hover:flex-[1.2]",
                                    "overflow-hidden bg-[#1C1C1C]"
                                )}
                            >
                                <motion.div layout="position" className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <img
                                        src={imageUrl}
                                        alt={localizedCaption || `Gallery image ${i + 1}`}
                                        className={cn(
                                            "transition-transform duration-700 block",
                                            isActive 
                                                ? "h-full w-auto max-w-none" 
                                                : "h-full w-full object-cover"
                                        )}
                                    />
                                    
                                    {/* Overlay for inactive images to create depth */}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[1px] hover:bg-transparent transition-all duration-500" />
                                    )}

                                    {/* Caption for active image */}
                                    <AnimatePresence>
                                        {isActive && localizedCaption && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white"
                                            >
                                                <p className="text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                                                    {localizedCaption}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
