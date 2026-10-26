'use client'

import { usePathname } from '@/i18n'
import { HeaderClientLegacy } from './legacy/HeaderClientLegacy'
import { HeaderClientNCAI } from './HeaderClientNCAI'
import type { FreeEntryBadgeProps } from './FreeEntryBadge'

interface HeaderContentProps {
    locale: string;
    openingStatus: React.ReactNode;
    navLinks: any[];
    utilityLinks?: any[];
    headerStyle?: string;
    featuredImages?: any[];
    freeEntryBadge?: FreeEntryBadgeProps | null;
}

export function HeaderSwitcher({ locale, openingStatus, navLinks, utilityLinks, headerStyle, featuredImages, freeEntryBadge }: HeaderContentProps) {
    const pathname = usePathname()
    // pathname from next-intl usePathname() without locale prefix. so it's '/'
    const isHome = pathname === '/'
    const isStyleguide = pathname === '/styleguide'

    if (isHome || isStyleguide || headerStyle === 'standard') {
        return <HeaderClientLegacy locale={locale} openingStatus={openingStatus} navLinks={navLinks} utilityLinks={utilityLinks} featuredImages={featuredImages} freeEntryBadge={freeEntryBadge} />
    }

    return (
        <HeaderClientNCAI
            locale={locale}
            openingStatus={openingStatus}
            navLinks={navLinks}
            utilityLinks={utilityLinks}
            featuredImages={featuredImages}
            freeEntryBadge={freeEntryBadge}
        />
    )
}
