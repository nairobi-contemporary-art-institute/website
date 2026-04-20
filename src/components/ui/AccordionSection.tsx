'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LucidePlus, LucideMinus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionSectionProps {
    id?: string
    title: string
    children: React.ReactNode
    className?: string
    defaultOpen?: boolean
}

export function AccordionSection({ 
    id,
    title, 
    children, 
    className, 
    defaultOpen = false 
}: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    useEffect(() => {
        if (!id) return

        const handleOpen = (e: any) => {
            if (e.detail === id) {
                setIsOpen(true)
            }
        }

        window.addEventListener('ncai-open-accordion' as any, handleOpen)
        return () => window.removeEventListener('ncai-open-accordion' as any, handleOpen)
    }, [id])

    return (
        <div id={id} className={cn("border-b border-charcoal/10 scroll-mt-32", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 md:py-8 flex items-center justify-between text-left group"
                aria-expanded={isOpen}
            >
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-charcoal group-hover:text-amber-900 transition-colors">
                    {title}
                </h3>
                <div className="flex-shrink-0 ml-4">
                    <div className="relative w-6 h-6">
                        <motion.div
                            animate={{ rotate: isOpen ? 0 : 90, opacity: isOpen ? 0 : 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <LucidePlus className="w-6 h-6 text-charcoal/40" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <LucideMinus className="w-6 h-6 text-charcoal/40" />
                        </motion.div>
                    </div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-10 space-y-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
