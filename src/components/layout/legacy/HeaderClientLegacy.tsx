'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from '@/i18n'
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
    navLinks: Array<{
        label: string;
        href: string;
        columns?: Array<{
            title?: string;
            links: Array<{ label: string; href: string }>;
        }>;
    }>;
    utilityLinks?: Array<{ label: string; href: string }>;
    featuredImages?: any[];
}

import { MegaMenu } from '../MegaMenu'

export function HeaderClientLegacy({ locale, openingStatus, navLinks = [], utilityLinks = [], featuredImages = [] }: HeaderClientProps) {
    const t = useTranslations('HomePage')
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isAtTop, setIsAtTop] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)
    const [isHoveringHeader, setIsHoveringHeader] = useState(false)
    const lastScrollY = useRef(0)
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    // ... (refs stay the same)
    const headerRef = useRef<HTMLDivElement>(null)
    const logoContainerRef = useRef<HTMLDivElement>(null)
    const initialLogoRef = useRef<HTMLDivElement>(null)
    const fullLogoRef = useRef<HTMLDivElement>(null)
    const runwayRef = useRef<HTMLDivElement>(null)
    const headerInnerRef = useRef<HTMLDivElement>(null)
    const bannerRef = useRef<HTMLDivElement>(null)
    const isFirstMount = useRef(true)
    const lastAtTop = useRef(isAtTop)

    // ... (useGSAP and useEffect for scroll stay same)
    useGSAP(() => {
        // Disable expansion on mobile ( < 768px )
        if (window.innerWidth < 768) return

        const initialContentWidth = initialLogoRef.current?.offsetWidth || 120
        const targetContentWidth = runwayRef.current?.offsetWidth || 400

        // Account for absolute positioning and container padding to prevent clipping
        const style = window.getComputedStyle(logoContainerRef.current!)
        const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)

        const initialWidth = initialContentWidth + horizontalPadding
        const targetWidth = targetContentWidth + horizontalPadding

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

        // Sync header height contraction via padding
        tl.to(headerInnerRef.current, {
            paddingTop: "0.75rem", // py-3
            paddingBottom: "0.75rem", // py-3
            duration: 1,
            ease: "none"
        }, 0)


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
        const banner = bannerRef.current
        if (!banner) return

        if (isFirstMount.current) {
            gsap.set(banner, { maxHeight: 100, opacity: 1 })
            isFirstMount.current = false
            lastAtTop.current = isAtTop
            return
        }

        if (isAtTop !== lastAtTop.current) {
            gsap.killTweensOf(banner)
            if (isAtTop) {
                // Return to top: 2.5s delay then 2.5s slow reveal
                gsap.to(banner, {
                    maxHeight: 100,
                    opacity: 1,
                    duration: 2.5,
                    delay: 2.5,
                    ease: "power2.inOut"
                })
            } else {
                // Leave top: Quick hide
                gsap.to(banner, {
                    maxHeight: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                })
            }
            lastAtTop.current = isAtTop
        }
    }, [isAtTop])

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const vh75 = window.innerHeight * 0.75
            
            setIsAtTop(currentScrollY < 20)

            // Smart hide/show logic
            if (currentScrollY > vh75 && currentScrollY > lastScrollY.current) {
                // Scrolling down past 240vh
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY.current) {
                // Any upward scroll reveals header
                setIsVisible(true)
            }
            
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Mouse proximity listener - reveal header when hovering near the top
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const vh16 = window.innerHeight * 0.16
            if (e.clientY <= vh16) {
                setIsVisible(true)
            }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Check if the current route is the immersive timeline
    const isScrolled = !isAtTop
    const isImmersive = pathname?.includes('/timeline')

    // Fallback if navLinks is empty
    const displayLinks = navLinks.length > 0 ? navLinks : [
        {
            href: '/exhibitions',
            label: 'Exhibitions',
            columns: [
                {
                    title: 'Explore', links: [
                        { label: 'Current', href: '/exhibitions' },
                        { label: 'Past Archive', href: '/exhibitions' },
                        { label: 'Upcoming', href: '/exhibitions' },
                        { label: 'Timeline', href: '/timeline' }
                    ]
                }
            ]
        },
        {
            href: '/collection',
            label: 'Archive',
            columns: [
                {
                    title: 'Repository', links: [
                        { label: 'The Collection', href: '/collection' },
                        { label: 'Artist Registry', href: '/artists' },
                        { label: 'Publications', href: '/publications' }
                    ]
                }
            ]
        },
        {
            href: '/events',
            label: 'Programs',
            columns: [
                {
                    title: 'Activity', links: [
                        { label: 'Events Calendar', href: '/events' },
                        { label: 'Educational Outreach', href: '/education' }
                    ]
                }
            ]
        },
        { href: '/channel', label: 'Channel' },
        {
            href: '/visit',
            label: 'Visit',
            columns: [
                {
                    title: 'NCAI', links: [
                        { label: 'Plan Your Visit', href: '/visit' },
                        { label: 'About Us', href: '/about' },
                        { label: 'Support NCAI', href: '/get-involved' },
                        { label: 'Contact', href: '/contact' }
                    ]
                }
            ]
        },
    ]

    const handleMouseEnter = (index: number) => {
        setActiveMenuIndex(index)
    }

    const closeMegaMenu = () => {
        setActiveMenuIndex(null)
    }

    const isDark = activeMenuIndex !== null || isHoveringHeader || isMobileMenuOpen
    const isSolid = isScrolled || isMobileMenuOpen || activeMenuIndex !== null

    if (isImmersive) return null

    return (
        <>
            <div
                ref={headerRef}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex flex-col w-full transition-all duration-500 ease-in-out",
                    !isVisible ? "-translate-y-full" : "translate-y-0",
                    isDark ? "notice-theme-dark" : "notice-theme-light"
                )}
                onMouseLeave={closeMegaMenu}
            >
                <div
                    ref={bannerRef}
                    className="overflow-hidden"
                    suppressHydrationWarning
                >
                    <div className={cn(
                        "transition-all duration-500",
                        (!mounted || !isScrolled) ? "max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    )}>
                        {openingStatus}
                    </div>
                </div>
                <header
                    className={cn(
                        "transition-all duration-300",
                        isDark 
                            ? "bg-background-dark text-white border-b border-white/10 shadow-sm"
                            : isSolid
                                ? "bg-white text-umber border-b border-rich-blue/20 shadow-sm"
                                : "bg-white/80 backdrop-blur-md text-umber border-b border-rich-blue/20"
                    )}
                    onMouseEnter={() => setIsHoveringHeader(true)}
                    onMouseLeave={() => setIsHoveringHeader(false)}
                >
                    <div ref={headerInnerRef} className="flex justify-between items-stretch px-6 md:px-12 transition-all duration-300 relative z-50">
                        {/* Logo Section */}
                        <div ref={logoContainerRef} className={cn(
                            "flex items-center py-6 overflow-hidden transition-colors duration-300",
                            isDark ? "text-white" : "text-umber"
                        )}>
                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center group relative h-full w-full transition-colors duration-300",
                                    isDark ? "text-white" : "text-umber"
                                )}
                                aria-label="NCAI Home"
                                onMouseEnter={closeMegaMenu}
                            >
                                {/* Dynamic Runway - Provides the measurement for the multi-language title */}
                                <div ref={runwayRef} className="absolute flex items-center opacity-0 pointer-events-none whitespace-nowrap text-xl md:text-3xl font-bold tracking-tight">
                                    <Logo className="h-10 md:h-12 w-auto mr-4" />
                                    <span>{t('title')}</span>
                                </div>

                                {/* Initial State: Logomark + NCAI */}
                                <div ref={initialLogoRef} className="flex items-center md:absolute md:left-0 whitespace-nowrap">
                                    <Logo className="h-10 md:h-12 w-auto mr-4 transition-colors" />
                                    <span className="text-3xl font-bold tracking-tighter transition-colors pt-2">NCAI</span>
                                </div>

                                {/* Target State: Full Title (revealed on scroll) */}
                                <div
                                    ref={fullLogoRef}
                                    className={cn(
                                        "hidden md:flex items-center absolute left-0 whitespace-nowrap text-xl md:text-3xl font-bold tracking-tight opacity-0 transition-colors duration-300",
                                        isDark ? "text-white" : "text-umber"
                                    )}
                                    aria-hidden="true"
                                >
                                    <Logo className={cn("h-10 md:h-12 w-auto mr-4 transition-colors", isDark ? "text-white" : "text-umber")} />
                                    <span>{t('title')}</span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Section - Desktop Only (Tiered structure matching NCAI header) */}
                        <div className="hidden md:flex flex-col justify-center gap-2 py-4">
                            {/* Top Tier Links */}
                            <div className="flex justify-end items-center gap-6">
                                {utilityLinks.length > 0 ? (
                                    utilityLinks.map((link) => (
                                        <Link 
                                            key={link.href} 
                                            href={link.href} 
                                            className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity"
                                        >
                                            {link.label}
                                        </Link>
                                    ))
                                ) : (
                                    <>
                                        <Link href="#" className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity">Shop</Link>
                                        <Link href="#" className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity">Support</Link>
                                        <Link href="#" className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity">Members</Link>
                                        <Link href="#" className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity">Venue Hire</Link>
                                    </>
                                )}
                                <LanguageSwitcher />
                            </div>

                            {/* Bottom Tier Links */}
                            <div className="flex justify-end items-center gap-8">
                                <nav className="flex items-center gap-8">
                                    {displayLinks.map((link, idx) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "text-lg md:text-xl font-bold transition-all duration-200 uppercase tracking-tight relative py-2 group",
                                                isDark ? "text-white hover:opacity-70" : "text-umber hover:opacity-70"
                                            )}
                                            onMouseEnter={() => handleMouseEnter(idx)}
                                        >
                                            {link.label}
                                            {/* Underline for active/hovered */}
                                            <span className={cn(
                                                "absolute bottom-0 left-0 h-0.5 transition-all ease-in-out duration-300",
                                                isDark ? "bg-white" : "bg-umber",
                                                activeMenuIndex === idx ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                            )} />
                                        </Link>
                                    ))}
                                    
                                    {/* Desktop Search Trigger */}
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="hover:opacity-70 transition-opacity ml-2"
                                        aria-label="Open search"
                                        onMouseEnter={closeMegaMenu}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 21L15.8033 15.8033M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Mobile/Utils Section */}
                        <div className={cn(
                            "flex md:hidden items-center px-6 border-l gap-2 transition-colors duration-300",
                            isDark ? "border-white/10" : "border-rich-blue/20"
                        )}>
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:opacity-70 transition-opacity"
                                aria-label="Open search"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15.8033 15.8033M19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <div className="hidden md:block">
                                <LanguageSwitcher />
                            </div>

                            {/* Mobile Toggle */}
                            <button
                                className="md:hidden text-current focus:outline-none p-2 relative z-50 h-10 w-10 flex items-center justify-center transition-all active:scale-95"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                <div className="w-7 h-5 relative flex flex-col justify-between">
                                    <span className={cn(
                                        "w-full h-0.5 bg-current transition-all duration-300 ease-in-out origin-center block absolute",
                                        isMobileMenuOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"
                                    )} />
                                    <span className={cn(
                                        "w-full h-0.5 bg-current transition-all duration-300 ease-in-out block absolute top-1/2 -translate-y-1/2",
                                        isMobileMenuOpen ? "opacity-0 -translate-x-2" : "opacity-100"
                                    )} />
                                    <span className={cn(
                                        "w-full h-0.5 bg-current transition-all duration-300 ease-in-out origin-center block absolute",
                                        isMobileMenuOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-0"
                                    )} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Desktop MegaMenu Overlay */}
                    <div className="hidden md:block">
                        {displayLinks.map((link, idx) => (
                            <MegaMenu
                                key={idx}
                                isOpen={activeMenuIndex === idx && !!link.columns}
                                columns={link.columns || []}
                                onClose={closeMegaMenu}
                                featuredImages={featuredImages}
                            />
                        ))}
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={cn(
                        "fixed inset-0 bg-background-dark text-white z-40 flex flex-col pt-44 px-6 pb-12 transition-all duration-500 ease-in-out md:hidden overflow-y-auto",
                        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        <nav className="flex flex-col gap-10">
                            {displayLinks.map((link, i) => (
                                <div key={link.href} className="flex flex-col gap-4">
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "text-4xl font-bold uppercase tracking-tighter text-white transition-all duration-500",
                                            isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                                        )}
                                        style={{ transitionDelay: `${i * 50}ms` }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>

                                    {/* Mobile Sub-links */}
                                    {link.columns && (
                                        <div className={cn(
                                            "flex flex-col gap-3 ml-1 pl-4 border-l border-white/10 transition-all duration-700",
                                            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        )} style={{ transitionDelay: `${(i * 50) + 200}ms` }}>
                                            {(link.columns || []).flatMap(col => col.links || []).map((sublink, j) => (
                                                <Link
                                                    key={(sublink?.href || '') + j}
                                                    href={sublink?.href || '#'}
                                                    className="text-lg font-semibold text-white/60 hover:text-white"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {sublink?.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                        <div className={cn(
                            "mt-12 transition-all duration-500 delay-300 text-white",
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
