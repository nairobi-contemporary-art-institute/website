'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/contexts/AccessibilityContext'

interface ResponsiveDividerProps {
    variant?: 'straight' | 'curved'
    weight?: 'thin' | 'medium' | 'bold'
    className?: string
}

export function ResponsiveDivider({
    variant = 'straight',
    weight = 'thin',
    className,
}: ResponsiveDividerProps) {
    const pathRef = useRef<SVGPathElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)

    const strokeWidth = {
        thin: 1,
        medium: 2,
        bold: 3,
    }[weight]

    const isReducedMotion = useReducedMotion()

    useGSAP(() => {
        if (isReducedMotion) return

        if (variant === 'curved' && pathRef.current) {
            const length = pathRef.current.getTotalLength()

            // Initial state
            gsap.set(pathRef.current, {
                strokeDasharray: length,
                strokeDashoffset: length
            })

            // Animation
            gsap.to(pathRef.current, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: pathRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            })
        }

        if (variant === 'straight' && lineRef.current) {
            gsap.from(lineRef.current, {
                scaleX: 0,
                duration: 1.2,
                ease: 'power2.out',
                transformOrigin: 'left center',
                scrollTrigger: {
                    trigger: lineRef.current,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            })
        }
    }, [])

    if (variant === 'curved') {
        return (
            <svg
                className={cn('w-full h-8', className)}
                viewBox="0 0 1200 32"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    ref={pathRef}
                    d="M0 16 Q 300 0, 600 16 T 1200 16"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        )
    }

    // Straight variant
    return (
        <div
            ref={lineRef}
            className={cn('w-full', className)}
            style={{ height: `${strokeWidth}px`, backgroundColor: 'currentColor' }}
            aria-hidden="true"
        />
    )
}
