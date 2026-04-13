'use client'

import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/ui/PageTransition'

/**
 * Conditionally renders Header and Footer based on the current route.
 * For example, immersive routes like /timeline may want to hide global nav.
 */
export function ConditionalWrapper({
    children,
    header,
    footer
}: {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
}) {
    const pathname = usePathname()

    // Check if the current route is the immersive timeline
    // Precise check for /timeline or /[locale]/timeline to avoid accidental matches
    const isImmersive = pathname?.match(/\/(?:[a-z]{2}\/)?timeline$/)

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
            {header}
            <main className="flex-1">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            {footer}
        </>
    )
}
