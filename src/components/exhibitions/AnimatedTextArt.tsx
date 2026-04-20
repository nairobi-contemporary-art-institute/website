'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

interface AnimatedTextArtProps {
    text: string
    style?: 'static' | 'marquee' | 'vertical' | 'diagonal' | 'pulsing'
    opacity?: number
    color?: string
    className?: string
}

export function AnimatedTextArt({
    text,
    style = 'static',
    opacity = 0.1,
    color = 'currentColor',
    className
}: AnimatedTextArtProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!containerRef.current || !textRef.current || style === 'static') return

        const ctx = gsap.context(() => {
            if (style === 'marquee') {
                gsap.to('.marquee-inner', {
                    xPercent: -50,
                    repeat: -1,
                    duration: 20,
                    ease: 'none'
                })
            }

            if (style === 'vertical') {
                gsap.to('.vertical-inner', {
                    yPercent: -50,
                    repeat: -1,
                    duration: 15,
                    ease: 'none'
                })
            }

            if (style === 'diagonal') {
                gsap.to('.diagonal-inner', {
                    xPercent: -20,
                    yPercent: -20,
                    repeat: -1,
                    duration: 25,
                    ease: 'none',
                    modifiers: {
                        xPercent: gsap.utils.unitize(x => parseFloat(x) % 50),
                        yPercent: gsap.utils.unitize(y => parseFloat(y) % 50)
                    }
                })
            }

            if (style === 'pulsing') {
                // Independent pulsing for each row to ensure they stay out of sync
                const rows = containerRef.current?.querySelectorAll('.pulsing-item');
                rows?.forEach((row, i) => {
                    gsap.fromTo(row, 
                        { opacity: 0.1 },
                        {
                            opacity: 1,
                            duration: 5 + (i * 1.5), // Different durations: 5s, 6.5s, 8s
                            delay: i * 1.2,          // Staggered start
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        }
                    )
                })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [style])

    const renderStatic = () => (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="text-4xl md:text-6xl font-black uppercase tracking-tighter whitespace-nowrap opacity-20">
                    {Array.from({ length: 5 }).map(() => text).join(' ')}
                </div>
            ))}
        </div>
    )

    const renderMarquee = () => (
        <div className="marquee-container overflow-hidden w-full h-full flex items-center">
            <div className="marquee-inner flex whitespace-nowrap">
                {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="text-6xl md:text-[10rem] font-black uppercase tracking-[unset] leading-none px-8">
                        {text}
                    </span>
                ))}
            </div>
        </div>
    )

    const renderVertical = () => (
        <div className="vertical-container overflow-hidden w-full h-full">
            <div className="vertical-inner flex flex-col items-center">
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
                        {text}
                    </span>
                ))}
            </div>
        </div>
    )

    const renderPulsing = () => (
        <div className="pulsing-container w-full h-full flex flex-col items-start justify-center gap-y-8 md:gap-y-16 px-[5vw]">
            {Array.from({ length: 3 }).map((_, i) => (
                <span 
                    key={i} 
                    className="pulsing-item text-3xl md:text-[8vw] font-black uppercase tracking-tighter flex-shrink-0 leading-[0.9] max-w-[90vw] break-words md:break-normal"
                    style={{ opacity: 0.1 }}
                >
                    {text}
                </span>
            ))}
        </div>
    )

    return (
        <div 
            ref={containerRef}
            className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden", className)}
            style={{ opacity, color }}
        >
            <div ref={textRef} className="w-full h-full">
                {style === 'static' && renderStatic()}
                {style === 'marquee' && renderMarquee()}
                {style === 'vertical' && renderVertical()}
                {style === 'pulsing' && renderPulsing()}
                {style === 'diagonal' && (
                    <div className="diagonal-inner w-[200%] h-[200%] flex flex-wrap content-start">
                         {Array.from({ length: 100 }).map((_, i) => (
                            <span key={i} className="text-4xl md:text-6xl font-black uppercase tracking-tighter p-4">
                                {text}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
