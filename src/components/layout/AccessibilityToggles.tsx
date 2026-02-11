'use client'

import { useEffect, useState } from 'react'

export function AccessibilityToggles() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isReducedMotion, setIsReducedMotion] = useState(false)

    // Initialize from system preferences
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            setIsDarkMode(prefersDark)
            setIsReducedMotion(prefersReducedMotion)
        }
    }, [])

    // Handle dark mode toggle
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    // Handle reduced motion toggle
    useEffect(() => {
        if (isReducedMotion) {
            document.documentElement.style.setProperty('--motion-duration', '0s')
        } else {
            document.documentElement.style.removeProperty('--motion-duration')
        }
    }, [isReducedMotion])

    return (
        <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="w-4 h-4 accent-ochre"
                />
                <span>Dark</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isReducedMotion}
                    onChange={(e) => setIsReducedMotion(e.target.checked)}
                    className="w-4 h-4 accent-ochre"
                />
                <span>Reduced motion</span>
            </label>
        </div>
    )
}
