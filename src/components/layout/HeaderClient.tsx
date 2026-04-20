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
}

import { MegaMenu } from './MegaMenu'

export function HeaderClient({ locale, openingStatus, navLinks = [] }: HeaderClientProps) {
    const t = useTranslations('HomePage')
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isAtTop, setIsAtTop] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)
    const [isHoveringHeader, setIsHoveringHeader] = useState(false)
    const lastScrollY = useRef(0)

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

    if (isImmersive) return null

    return (
        <>
            <div
                ref={headerRef}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex flex-col w-full transition-all duration-500 ease-in-out",
                    !isVisible ? "-translate-y-full" : "translate-y-0"
                )}
                onMouseLeave={closeMegaMenu}
            >
                <div
                    ref={bannerRef}
                    className="overflow-hidden"
                >
                    {openingStatus}
                </div>
                <header
                    className="bg-white/80 backdrop-blur-md text-umber border-b border-rich-blue/20 transition-colors duration-300"
                    onMouseEnter={() => setIsHoveringHeader(true)}
                    onMouseLeave={() => setIsHoveringHeader(false)}
                >
                    <div ref={headerInnerRef} className="grid grid-cols-[auto_1fr_auto] items-stretch py-6 md:py-8 transition-all duration-300">
                        {/* Logo Section */}
                        <div ref={logoContainerRef} className="flex items-center px-6 md:px-8 border-r border-rich-blue/20 overflow-hidden">
                            <Link
                                href="/"
                                className="text-umber flex items-center group relative h-full w-full"
                                aria-label="NCAI Home"
                                onMouseEnter={closeMegaMenu}
                            >
                                {/* Dynamic Runway - Provides the measurement for the multi-language title (absolute so it doesn't affect initial width) */}
                                <div ref={runwayRef} className="absolute hidden md:block opacity-0 pointer-events-none whitespace-nowrap text-lg lg:text-xl font-bold tracking-tight px-2">
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
                                    className="hidden md:block absolute left-0 whitespace-nowrap text-lg lg:text-xl font-bold tracking-tight text-umber opacity-0"
                                    aria-hidden="true"
                                >
                                    {t('title')}
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav Section */}
                        <div className="hidden md:flex items-center px-8">
                            <nav className="flex items-center gap-8 w-full">
                                {displayLinks.map((link, idx) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-bold transition-all duration-200 uppercase tracking-[0.2em] text-deep-umber hover:text-ochre relative py-4 group"
                                        onMouseEnter={() => handleMouseEnter(idx)}
                                    >
                                        {link.label}
                                        {/* Underline for active/hovered */}
                                        <span className={cn(
                                            "absolute bottom-2 left-0 h-0.5 bg-ochre transition-all ease-in-out duration-300",
                                            activeMenuIndex === idx ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                        )} />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Utils Section */}
                        <div className="flex items-center px-6 md:px-8 border-l border-rich-blue/20 gap-6">
                            {/* Search Trigger */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-umber/90 hover:text-umber transition-colors p-2 -mr-2"
                                aria-label="Open search"
                                onMouseEnter={closeMegaMenu}
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

                    {/* Desktop MegaMenu Overlay */}
                    <div className="hidden md:block">
                        {displayLinks.map((link, idx) => (
                            <MegaMenu
                                key={idx}
                                isOpen={activeMenuIndex === idx && !!link.columns}
                                columns={link.columns || []}
                                onClose={closeMegaMenu}
                            />
                        ))}
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={cn(
                        "fixed inset-0 bg-white z-40 flex flex-col pt-32 px-6 pb-12 transition-all duration-500 ease-in-out md:hidden overflow-y-auto",
                        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        <nav className="flex flex-col gap-10">
                            {displayLinks.map((link, i) => (
                                <div key={link.href} className="flex flex-col gap-4">
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "text-4xl font-bold uppercase tracking-tighter text-deep-umber transition-all duration-500",
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
                                            "flex flex-col gap-3 ml-1 pl-4 border-l-2 border-rich-blue/10 transition-all duration-700",
                                            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        )} style={{ transitionDelay: `${(i * 50) + 200}ms` }}>
                                            {(link.columns || []).flatMap(col => col.links || []).map((sublink, j) => (
                                                <Link
                                                    key={(sublink?.href || '') + j}
                                                    href={sublink?.href || '#'}
                                                    className="text-lg font-bold text-rich-blue/60 hover:text-ochre"
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
                            "mt-12 transition-all duration-500 delay-300",
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
