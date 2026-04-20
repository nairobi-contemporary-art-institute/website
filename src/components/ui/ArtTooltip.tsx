'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideInfo } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownText } from '@/components/ui/MarkdownText'

interface ArtTooltipProps {
    content: React.ReactNode
    children?: React.ReactNode
    className?: string
    align?: 'left' | 'right' | 'center'
}

export function ArtTooltip({ content, children, className, align = 'right' }: ArtTooltipProps) {
    const [isVisible, setIsVisible] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null)

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsVisible(false)
            }
        }
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isVisible])

    return (
        <div className={cn("relative inline-block", className)} ref={tooltipRef}>
            {children ? (
                <div
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsVisible(!isVisible)
                    }}
                >
                    {children}
                </div>
            ) : (
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsVisible(!isVisible)
                    }}
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-all focus:outline-none"
                    aria-label="View more information"
                >
                    <LucideInfo className="w-4 h-4" />
                </button>
            )}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                            "absolute bottom-full mb-3 z-50 w-64 p-4 bg-white text-charcoal shadow-2xl rounded-sm border border-black/5 whitespace-normal",
                            align === 'right' ? "right-0" : align === 'left' ? "left-0" : "left-1/2 -translate-x-1/2"
                        )}
                    >
                        <div className="text-[10px] leading-relaxed font-sans tracking-wide">
                            {typeof content === 'string' ? (
                                <MarkdownText text={content} />
                            ) : (
                                content
                            )}
                        </div>
                        {/* Little triangle arrow */}
                        <div className={cn(
                            "absolute top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white",
                            align === 'right' ? "right-2" : align === 'left' ? "left-2" : "left-1/2 -translate-x-1/2"
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
