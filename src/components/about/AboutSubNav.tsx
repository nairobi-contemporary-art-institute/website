'use client'

import { usePathname } from '@/i18n'
import { Link } from '@/i18n'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"

interface AboutSubNavProps {
    locale: string
}

export function AboutSubNav({ locale }: AboutSubNavProps) {
    const t = useTranslations('Navigation')
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { label: t('aboutOverview'), href: '/about' },
        { label: t('aboutMission'), href: '/about/mission' },
        { label: t('aboutHistory'), href: '/about/history' },
        { label: t('aboutTeam'), href: '/about/team' },
        { label: t('aboutCareers'), href: '/about/careers' },
    ]

    return (
        <div 
            className={cn(
                "sticky z-[90] w-full border-b border-charcoal/5 transition-all duration-500 ease-in-out",
                isScrolled ? "bg-ivory/80 backdrop-blur-md translate-y-[-8px]" : "bg-ivory"
            )}
            style={{ top: 'var(--header-offset, 96px)' }}
        >
            <GridSystem unstable_useContainer className="py-4 md:py-6">
                <nav className="flex items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar scroll-smooth">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative py-2",
                                    isActive 
                                        ? "text-umber" 
                                        : "text-charcoal/40 hover:text-charcoal"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-umber" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </GridSystem>
        </div>
    )
}
