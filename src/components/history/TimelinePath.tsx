'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/contexts/AccessibilityContext'

interface TimelinePathProps {
    className?: string
}

export function TimelinePath({ className }: TimelinePathProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const isReducedMotion = useReducedMotion()

    useGSAP(() => {
        if (isReducedMotion || !pathRef.current || !containerRef.current) return

        const length = pathRef.current.getTotalLength()

        // Set initial state: path hidden
        gsap.set(pathRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
        })

        // Draw path based on scroll
        gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 20%',
                end: 'bottom 80%',
                scrub: 0.5,
            },
        })
    }, { scope: containerRef, dependencies: [isReducedMotion] })

    return (
        <div ref={containerRef} className={className} style={{ position: 'absolute', top: 0, bottom: 0, width: '40px' }}>
            <svg
                width="40"
                height="100%"
                viewBox="0 0 40 1000" // Viewbox height is arbitrary, we'll use preserveAspectRatio
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Background Shadow Path */}
                <path
                    d="M20 0 C 40 250, 0 500, 20 750 T 20 1000"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                    vectorEffect="non-scaling-stroke"
                />
                {/* Active Drawing Path */}
                <path
                    ref={pathRef}
                    d="M20 0 C 40 250, 0 500, 20 750 T 20 1000"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    )
}
