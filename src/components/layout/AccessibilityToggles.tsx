'use client'

import { useAccessibility } from '@/contexts/AccessibilityContext'

export function AccessibilityToggles() {
    const { isDarkMode, isReducedMotion, toggleDarkMode, toggleReducedMotion } = useAccessibility()

    return (
        <div className="flex items-center gap-6" role="group" aria-label="Accessibility settings">
            <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 cursor-pointer group hover:text-ochre transition-colors"
                aria-pressed={isDarkMode}
                aria-label={isDarkMode ? 'Disable dark mode' : 'Enable dark mode'}
            >
                <div className={`w-4 h-4 border border-current flex items-center justify-center p-0.5`}>
                    {isDarkMode && <div className="w-full h-full bg-current" />}
                </div>
                <span className="font-normal">Dark</span>
            </button>
            <button
                onClick={toggleReducedMotion}
                className="flex items-center gap-2 cursor-pointer group hover:text-ochre transition-colors"
                aria-pressed={isReducedMotion}
                aria-label={isReducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
            >
                <div className={`w-4 h-4 border border-current flex items-center justify-center p-0.5`}>
                    {isReducedMotion && <div className="w-full h-full bg-current" />}
                </div>
                <span className="font-normal">Reduced motion</span>
            </button>
        </div>
    )
}
