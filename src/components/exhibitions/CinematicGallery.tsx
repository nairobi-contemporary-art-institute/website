'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'
import { MarkdownText } from '@/components/ui/MarkdownText'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

interface GalleryImage {
    asset: any
    caption?: any
}

interface CinematicGalleryProps {
    images: GalleryImage[]
    locale: string
    title?: string
    className?: string
}

export function CinematicGallery({ images, locale, title, className }: CinematicGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [showCaption, setShowCaption] = useState(false)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    const containerRef = useRef<HTMLDivElement>(null)
    const stripRef = useRef<HTMLDivElement>(null)

    const validImages = images?.filter(img => img?.asset) || []
    const hasImages = validImages.length > 0

    // GSAP Horizontal Scrolljacking
    useGSAP(() => {
        if (!hasImages || !containerRef.current || !stripRef.current) return

        const strip = stripRef.current
        const container = containerRef.current
        
        // Calculate the distance to scroll horizontally
        const getScrollAmount = () => -(strip.scrollWidth - window.innerWidth)

        const tween = gsap.to(strip, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: () => `+=${strip.scrollWidth}`,
                pin: true,
                scrub: 1.5, // Increased for a smoother "lag" effect
                invalidateOnRefresh: true,
                anticipatePin: 1,
                // Add snapping to help the user "land" into the gallery
                snap: {
                    snapTo: [0, 1], // Snap to the very start or the very end
                    duration: { min: 0.4, max: 0.8 },
                    delay: 0.1,
                    ease: "power2.inOut"
                }
            }
        })

        return () => {
            tween.kill()
        }
    }, { scope: containerRef, dependencies: [hasImages] })

    // Sync scroll when navigating in lightbox
    useEffect(() => {
        if (!hasImages) return
        if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            })
        }
    }, [selectedIndex, hasImages])

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % validImages.length)
        }
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + validImages.length) % validImages.length)
        }
    }

    // Keyboard support
    useEffect(() => {
        if (!hasImages) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return
            if (e.key === 'ArrowRight') nextImage()
            if (e.key === 'ArrowLeft') prevImage()
            if (e.key === 'Escape') setSelectedIndex(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedIndex, hasImages])

    if (!hasImages) return null

    return (
        <section 
            ref={containerRef}
            className={cn("w-full h-screen bg-[#161616] overflow-hidden flex flex-col justify-center selection:bg-[#333] selection:text-white", className)}
        >
            {title && (
                <div className="px-6 md:px-12 mb-8">
                    <h3 className="premium-gallery-text text-[10px] tracking-[0.4em] text-white/40 border-b border-white/10 pb-4">
                        {title}
                    </h3>
                </div>
            )}

            {/* Horizontal Strip */}
            <div 
                ref={stripRef}
                className="flex gap-4 md:gap-12 min-w-max px-6 md:px-12 items-end whitespace-nowrap relative z-10 overflow-visible"
            >
                {validImages.map((image, i) => {
                    const imageUrl = urlFor(image.asset).height(1000).url()
                    const localizedCaption = getLocalizedValue(image.caption, locale)

                    return (
                        <div
                            key={i}
                            ref={el => { itemRefs.current[i] = el }}
                            className="relative flex-none flex-shrink-0 cursor-pointer group"
                            style={{ 
                                height: 'max(60vh, 450px)', 
                                maxHeight: '80vh',
                                width: 'auto',
                                minWidth: '100px' // Prevent total shrinkage before load
                            }}
                            onClick={() => setSelectedIndex(i)}
                        >
                            <motion.img
                                layoutId={`image-${i}`}
                                src={imageUrl}
                                alt={localizedCaption || `Gallery image ${i + 1}`}
                                className="h-full w-auto object-contain bg-black/5 transition-opacity duration-300"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                            
                            {/* Stylish Hover Tooltip Trigger */}
                            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                <div className="relative">
                                    <div className="bg-white rounded-full p-2 text-black hover:bg-white/90 transition-colors shadow-lg">
                                        <Info size={16} fill="currentColor" />
                                    </div>
                                    
                                    {/* Tooltip Content */}
                                    <div className="absolute bottom-full left-0 mb-4 w-64 p-4 bg-black border border-white/10 text-white pointer-events-none transform -translate-x-0 hidden group-hover:block z-50 whitespace-normal">
                                        <div className="premium-gallery-text text-[14px] lowercase leading-relaxed">
                                            {localizedCaption ? (
                                                <MarkdownText text={localizedCaption} />
                                            ) : (
                                                "No caption available"
                                            )}
                                        </div>
                                        <div className="absolute top-full left-4 border-l-8 border-r-8 border-t-8 border-transparent border-t-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#161616] flex items-center justify-center p-4 md:p-12 lg:p-24 selection:bg-[#333] selection:text-white"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Lightbox Controls */}
                        <div className="absolute top-8 right-8 z-[110] flex gap-4">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCaption(!showCaption);
                                }}
                                className={cn(
                                    "p-3 rounded-full transition-all duration-300",
                                    showCaption ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                                title="Image Info"
                            >
                                <Info size={24} fill={showCaption ? "currentColor" : "none"} />
                            </button>
                            <button 
                                onClick={() => setSelectedIndex(null)}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Arrows */}
                        <button 
                            onClick={prevImage}
                            className="absolute left-8 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-8 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors hidden md:block"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Main Image in Lightbox */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.img
                                key={selectedIndex}
                                layoutId={`image-${selectedIndex}`}
                                src={urlFor(validImages[selectedIndex].asset).width(2000).url()}
                                alt="Gallery View"
                                className="max-w-full max-h-full object-contain shadow-2xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x > 100) prevImage()
                                    else if (info.offset.x < -100) nextImage()
                                }}
                            />

                            {/* Caption Overlay */}
                            <AnimatePresence>
                                {showCaption && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent text-white"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="max-w-3xl mx-auto space-y-4">
                                            <div className="premium-gallery-text text-xs tracking-[0.3em] text-white/40">
                                                Information
                                            </div>
                                            <p className="premium-gallery-text text-xl md:text-2xl leading-relaxed normal-case">
                                                {(() => {
                                                    const cap = getLocalizedValue(validImages[selectedIndex].caption, locale);
                                                    return cap ? (
                                                        <MarkdownText text={cap} />
                                                    ) : (
                                                        "No description available."
                                                    );
                                                })()}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] premium-gallery-text tracking-[0.3em]">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
