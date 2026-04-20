'use client'

import { usePathname } from '@/i18n'
import { HeaderClientLegacy } from './legacy/HeaderClientLegacy'
import { HeaderClientNCAI } from './HeaderClientNCAI'

interface HeaderContentProps {
    locale: string;
    openingStatus: React.ReactNode;
    navLinks: any[];
    utilityLinks?: any[];
    headerStyle?: string;
    featuredImages?: any[];
}

export function HeaderSwitcher({ locale, openingStatus, navLinks, utilityLinks, headerStyle, featuredImages }: HeaderContentProps) {
    const pathname = usePathname()
    // pathname from next-intl usePathname() without locale prefix. so it's '/'
    const isHome = pathname === '/'
    const isStyleguide = pathname === '/styleguide'

    if (isHome || isStyleguide || headerStyle === 'standard') {
        return <HeaderClientLegacy locale={locale} openingStatus={openingStatus} navLinks={navLinks} utilityLinks={utilityLinks} featuredImages={featuredImages} />
    }

    return (
        <HeaderClientNCAI 
            locale={locale} 
            openingStatus={openingStatus} 
            navLinks={navLinks} 
            utilityLinks={utilityLinks}
            featuredImages={featuredImages}
        />
    )
}
