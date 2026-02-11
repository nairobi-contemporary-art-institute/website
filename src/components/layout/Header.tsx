'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { SearchModal } from '@/components/ui/SearchModal'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useParams } from 'next/navigation'

/**
 * The global navigation Header component.
 * Features:
 * - Structural "Architecture" design style
 * - Solid background with grid lines
 * - Bold typography
 * - Integrated LanguageSwitcher and Search
 */
export function Header() {
    const t = useTranslations('Navigation')
    const params = useParams()
    const locale = (params?.locale as string) || 'en'

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const navLinks = [
        { href: '/about', label: t('about') },
        { href: '/visit', label: t('visit') },
        { href: '/exhibitions', label: t('exhibitions') },
        { href: '/education', label: t('education') },
        { href: '/channel', label: t('channel') },
        { href: '/support', label: t('support') },
    ]

    return (
        <>
            <header className="sticky top-0 z-50 bg-ivory/80 backdrop-blur-md text-umber border-b border-umber/10 transition-colors duration-300">
                <div className="h-20 grid grid-cols-[auto_1fr_auto] items-stretch">
                    {/* Logo Section */}
                    <div className="flex items-center px-6 md:px-8 border-r border-umber/10">
                        <Link
                            href="/"
                            className="text-umber flex items-center gap-2 group"
                            aria-label="NCAI Home"
                        >
                            <Logo className="h-10 w-auto group-hover:text-amber-800 transition-colors" />
                            <span className="text-3xl font-bold tracking-tighter group-hover:text-amber-800 transition-colors pt-2">NCAI</span>
                        </Link>
                    </div>

                    {/* Desktop Nav Section */}
                    <div className="hidden md:flex items-center px-8">
                        <nav className="flex items-center gap-8 w-full">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-bold uppercase tracking-[0.2em] text-umber/60 hover:text-umber transition-colors relative group"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Utils Section */}
                    <div className="flex items-center px-6 md:px-8 border-l border-umber/10 gap-6">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-umber/90 hover:text-umber transition-colors p-2 -mr-2"
                            aria-label="Open search"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 19L14.65 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden text-umber focus:outline-none p-2 -mr-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            <div className="w-6 h-5 flex flex-col justify-between relative">
                                <span className={cn(
                                    "w-full h-0.5 bg-current transition-all duration-300",
                                    isMobileMenuOpen && "rotate-45 translate-y-2.25"
                                )} />
                                <span className={cn(
                                    "w-full h-0.5 bg-current transition-all duration-300",
                                    isMobileMenuOpen && "opacity-0"
                                )} />
                                <span className={cn(
                                    "w-full h-0.5 bg-current transition-all duration-300",
                                    isMobileMenuOpen && "-rotate-45 -translate-y-2.25"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={cn(
                    "fixed inset-0 bg-ivory z-40 flex flex-col pt-32 px-6 gap-8 transition-all duration-500 ease-in-out md:hidden",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    <nav className="flex flex-col gap-6">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-3xl font-bold uppercase tracking-tighter text-umber transition-all duration-500 border-b border-umber/10 pb-4",
                                    isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                )}
                                style={{ transitionDelay: `${i * 50}ms` }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className={cn(
                        "mt-auto mb-10 transition-all duration-500 delay-300",
                        isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                locale={locale}
            />
        </>
    )
}
