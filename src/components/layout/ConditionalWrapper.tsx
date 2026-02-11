'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

import { PageTransition } from '@/components/ui/PageTransition'

/**
 * Conditionally renders Header and Footer based on the current route.
 * For example, immersive routes like /timeline may want to hide global nav.
 */
export function ConditionalWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Check if the current route is the immersive timeline
    // Note: pathname includes the locale prefix (e.g., /en/timeline)
    const isImmersive = pathname?.includes('/timeline')

    if (isImmersive) {
        return (
            <main className="flex-1">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        )
    }

    return (
        <>
            <Header />
            <main className="flex-1 pt-12 md:pt-20">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <Footer />
        </>
    )
}
