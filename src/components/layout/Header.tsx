'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { SearchModal } from '@/components/ui/SearchModal'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

/**
 * The global navigation Header component.
 * Features:
 * - Responsive navigation links with i18n support
 * - Mobile hamburger menu with slide-over
 * - Sticky positioning with backdrop-blur transition on scroll
 * - Integrated LanguageSwitcher and Search
 */
export function Header() {
    const t = useTranslations('Navigation')
    const params = useParams()
    const locale = (params?.locale as string) || 'en'

    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled ? 'bg-ivory/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
                )}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tighter text-umber flex items-center gap-2 group"
                    >
                        <span className="group-hover:text-amber-800 transition-colors">NCAI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs font-bold uppercase tracking-widest text-umber/80 hover:text-umber transition-colors relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-umber transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Utils */}
                    <div className="flex items-center gap-6">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-umber/90 hover:text-umber transition-colors"
                            aria-label="Open search"
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 19L14.65 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden text-umber focus:outline-none"
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
                    "fixed inset-0 bg-ivory z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out md:hidden",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-2xl font-bold uppercase tracking-widest text-umber transition-all duration-500 delay-[]",
                                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            )}
                            style={{ transitionDelay: `${i * 50}ms` }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className={cn(
                        "mt-8 border-t border-umber/10 pt-10 w-48 flex justify-center transition-all duration-500 delay-300",
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
