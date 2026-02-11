'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { usePathname } from 'next/navigation'
import { useAccessibility } from '@/contexts/AccessibilityContext'

/**
 * A simple page entrance animation component using GSAP.
 * Respects the Reduced Motion setting.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const { isReducedMotion } = useAccessibility()

    useGSAP(() => {
        if (isReducedMotion) return

        // Simple fade and slight slide up
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 10 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                clearProps: 'all' // Clean up styles after animation
            }
        )
    }, { scope: containerRef, dependencies: [pathname, isReducedMotion] })

    return (
        <div ref={containerRef} className="flex-1 flex flex-col">
            {children}
        </div>
    )
}
