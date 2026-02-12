'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { SearchModal } from '@/components/ui/SearchModal'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

interface HeaderClientProps {
    locale: string;
    openingStatus: React.ReactNode;
    navLinks: Array<{ label: string; href: string }>;
}

export function HeaderClient({ locale, openingStatus, navLinks = [] }: HeaderClientProps) {
    const t = useTranslations('HomePage')
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isAtTop, setIsAtTop] = useState(true)

    const headerRef = useRef<HTMLDivElement>(null)
    const logoContainerRef = useRef<HTMLDivElement>(null)
    const initialLogoRef = useRef<HTMLDivElement>(null)
    const fullLogoRef = useRef<HTMLDivElement>(null)
    const runwayRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Disable expansion on mobile ( < 768px )
        if (window.innerWidth < 768) return

        const initialWidth = initialLogoRef.current?.offsetWidth || 120
        const targetWidth = runwayRef.current?.offsetWidth || 400

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "200px top",
                scrub: 0.5,
            }
        })

        // Animate the container width to push the navigation
        tl.fromTo(logoContainerRef.current,
            { width: initialWidth },
            { width: targetWidth, duration: 1, ease: "none" },
            0
        )

        tl.to(initialLogoRef.current, {
            opacity: 0,
            x: -20,
            scale: 0.8,
            duration: 1,
            ease: "power2.inOut"
        }, 0)
            .fromTo(fullLogoRef.current,
                {
                    clipPath: "inset(0% 100% 0% 0%)",
                    opacity: 0,
                    x: 20
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    x: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                },
                0
            )
    }, { scope: headerRef, dependencies: [locale] })

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 20)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Check if the current route is the immersive timeline
    const isImmersive = pathname?.includes('/timeline')

    // Fallback if navLinks is empty
    const displayLinks = navLinks.length > 0 ? navLinks : [
        { href: '/about', label: 'About' },
        { href: '/visit', label: 'Visit' },
        { href: '/exhibitions', label: 'Exhibitions' },
        { href: '/education', label: 'Education' },
        { href: '/channel', label: 'Channel' },
        { href: '/support', label: 'Support' },
    ]

    if (isImmersive) return null

    return (
        <>
            <div ref={headerRef} className="sticky top-0 z-50 flex flex-col w-full">
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        isAtTop ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    {openingStatus}
                </div>
                <header className="bg-ivory/80 backdrop-blur-md text-umber border-b border-umber/10 transition-colors duration-300">
                    <div className="h-20 grid grid-cols-[auto_1fr_auto] items-stretch">
                        {/* Logo Section */}
                        <div ref={logoContainerRef} className="flex items-center px-6 md:px-8 border-r border-umber/10 overflow-hidden">
                            <Link
                                href="/"
                                className="text-umber flex items-center group relative h-full w-full"
                                aria-label="NCAI Home"
                            >
                                {/* Dynamic Runway - Provides the measurement for the multi-language title (absolute so it doesn't affect initial width) */}
                                <div ref={runwayRef} className="absolute hidden md:block opacity-0 pointer-events-none whitespace-nowrap text-lg lg:text-xl font-bold uppercase tracking-tight px-2">
                                    {t('title')}
                                </div>

                                {/* Initial State: Logomark + NCAI */}
                                <div ref={initialLogoRef} className="flex items-center gap-2 md:absolute md:left-0 whitespace-nowrap">
                                    <Logo className="h-10 w-auto group-hover:text-amber-800 transition-colors" />
                                    <span className="text-3xl font-bold tracking-tighter group-hover:text-amber-800 transition-colors pt-2">NCAI</span>
                                </div>

                                {/* Target State: Full Title (revealed on scroll) */}
                                <div
                                    ref={fullLogoRef}
                                    className="hidden md:block absolute left-0 whitespace-nowrap text-lg lg:text-xl font-bold uppercase tracking-tight text-umber opacity-0"
                                    aria-hidden="true"
                                >
                                    {t('title')}
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav Section */}
                        <div className="hidden md:flex items-center px-8">
                            <nav className="flex items-center gap-8 w-full">
                                {displayLinks.map((link) => (
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
                            {displayLinks.map((link, i) => (
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
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                locale={locale}
            />
        </>
    )
}
