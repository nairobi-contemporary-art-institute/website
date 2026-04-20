'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
    id: string
    label: string
}

interface InPageNavProps {
    items: NavItem[]
    className?: string
}

export function InPageNav({ items, className }: InPageNavProps) {
    const [activeId, setActiveId] = useState<string>('')

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200

            for (const item of items) {
                const element = document.getElementById(item.id)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveId(item.id)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [items])

    const scrollTo = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const rect = element.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const targetY = rect.top + scrollTop - 144 // Adjusted offset for compressed sticky nav (header + nav)

            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            })
            // Dispatch event to open accordion if needed
            window.dispatchEvent(new CustomEvent('ncai-open-accordion', { detail: id }))
        }
    }

    return (
        <nav 
            className={cn(
                "sticky z-40 bg-white/80 backdrop-blur-md border-b border-charcoal/5 px-6 md:px-12 transition-all duration-500 ease-in-out",
                className
            )}
            style={{ top: 'var(--header-offset, 96px)' }}
        >
            <div className="flex items-center gap-8 h-16 overflow-x-auto no-scrollbar">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-b-2 py-5",
                            activeId === item.id 
                                ? "border-charcoal text-charcoal" 
                                : "border-transparent text-charcoal/40 hover:text-charcoal"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    )
}
