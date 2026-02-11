'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
    isDarkMode: boolean
    isReducedMotion: boolean
    toggleDarkMode: () => void
    toggleReducedMotion: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isReducedMotion, setIsReducedMotion] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize from system preferences
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

            // Check localStorage or fallback to system
            const savedDark = localStorage.getItem('ncai-dark-mode')
            const savedMotion = localStorage.getItem('ncai-reduced-motion')

            setIsDarkMode(savedDark !== null ? savedDark === 'true' : prefersDark)
            setIsReducedMotion(savedMotion !== null ? savedMotion === 'true' : prefersReducedMotion)
            setIsInitialized(true)
        }
    }, [])

    // Sync with localStorage and DOM
    useEffect(() => {
        if (!isInitialized) return

        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('ncai-dark-mode', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('ncai-dark-mode', 'false')
        }
    }, [isDarkMode, isInitialized])

    useEffect(() => {
        if (!isInitialized) return

        if (isReducedMotion) {
            document.documentElement.style.setProperty('--motion-duration', '0s')
            localStorage.setItem('ncai-reduced-motion', 'true')
        } else {
            document.documentElement.style.removeProperty('--motion-duration')
            localStorage.setItem('ncai-reduced-motion', 'false')
        }
    }, [isReducedMotion, isInitialized])

    const toggleDarkMode = () => setIsDarkMode(prev => !prev)
    const toggleReducedMotion = () => setIsReducedMotion(prev => !prev)

    return (
        <AccessibilityContext.Provider
            value={{
                isDarkMode,
                isReducedMotion,
                toggleDarkMode,
                toggleReducedMotion
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    )
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext)
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider')
    }
    return context
}

export function useReducedMotion() {
    const { isReducedMotion } = useAccessibility()
    return isReducedMotion
}
