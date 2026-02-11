'use client'

import { useAccessibility } from '@/contexts/AccessibilityContext'

export function AccessibilityToggles() {
    const { isDarkMode, isReducedMotion, toggleDarkMode, toggleReducedMotion } = useAccessibility()

    return (
        <div className="flex items-center gap-6 text-sm">
            <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 cursor-pointer group hover:text-ochre transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center p-0.5`}>
                    {isDarkMode && <div className="w-full h-full bg-current rounded-full" />}
                </div>
                <span>Dark</span>
            </button>
            <button
                onClick={toggleReducedMotion}
                className="flex items-center gap-2 cursor-pointer group hover:text-ochre transition-colors"
                aria-label={isReducedMotion ? 'Enable motion' : 'Reduce motion'}
            >
                <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center p-0.5`}>
                    {isReducedMotion && <div className="w-full h-full bg-current rounded-full" />}
                </div>
                <span>Reduced motion</span>
            </button>
        </div>
    )
}
