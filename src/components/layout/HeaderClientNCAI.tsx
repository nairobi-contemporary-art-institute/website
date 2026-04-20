'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from '@/i18n'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { SearchModal } from '@/components/ui/SearchModal'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { MegaMenu } from './MegaMenu'

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

export function HeaderClientNCAI({ locale, openingStatus, navLinks = [], utilityLinks = [], featuredImages = [] }: HeaderClientProps) {
    const t = useTranslations('HomePage')
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)
    const [isHoveringHeader, setIsHoveringHeader] = useState(false)
    const lastScrollY = useRef(0)
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    // Refs for GSAP
    const headerRef = useRef<HTMLDivElement>(null)
    const initialLogoRef = useRef<HTMLDivElement>(null)
    const fullLogoRef = useRef<HTMLDivElement>(null)
    const bannerRef = useRef<HTMLDivElement>(null)

    // Animation for logo matching the legacy one exactly
    useGSAP(() => {
        if (window.innerWidth < 768) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: typeof document !== 'undefined' ? document.body : null,
                start: "top top",
                end: "200px top",
                scrub: 0.5,
            }
        })

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

    // Scroll listener for sticky header styling and smart hide/show
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const vh75 = window.innerHeight * 0.75
            
            // Update scrolled state for styling
            setIsScrolled(currentScrollY > 40)

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
    }, []);

    // Update global CSS variable for header offset to sync sticky navs
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const root = document.documentElement;
        const offset = isVisible ? (window.innerWidth < 768 ? 88 : 96) : 0;
        root.style.setProperty('--header-offset', `${offset}px`);
    }, [isVisible]);

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

    const isImmersive = pathname?.includes('/timeline')

    const displayLinks = navLinks.length > 0 ? navLinks : [
        {
            href: '/whats-on',
            label: "What's On",
            columns: [
                {
                    title: 'Current', links: [
                        { label: 'Exhibitions', href: '/exhibitions' },
                        { label: 'Events Calendar', href: '/events' },
                        { label: "What's On Today", href: '/whats-on' }
                    ]
                },
                {
                    title: 'Archive', links: [
                        { label: 'Past Exhibitions', href: '/exhibitions#archive' },
                        { label: 'Past Events', href: '/events#archive' }
                    ]
                }
            ]
        },
        {
            href: '/visit',
            label: 'Visit',
            columns: [
                {
                    title: 'NCAI', links: [
                        { label: 'Plan Your Visit', href: '/visit' },
                        { label: 'Location & Hours', href: '/visit#location' },
                        { label: 'Accessibility', href: '/accessibility' }
                    ]
                },
                {
                    title: 'Groups', links: [
                        { label: 'Tours & Groups', href: '/visit#tours' },
                        { label: 'School Visits', href: '/about/mission' }
                    ]
                }
            ]
        },
        {
            href: '/collection',
            label: 'Collection',
            columns: [
                {
                    title: 'Research', links: [
                        { label: 'Collection', href: '/collection' },
                        { label: 'Artists', href: '/artists' },
                        { label: 'Archives', href: '/collection' }
                    ]
                }
            ]
        },
        {
            href: '/education',
            label: 'Learn',
            columns: [
                {
                    title: 'Engagement', links: [
                        { label: 'Public Programs', href: '/education' },
                        { label: 'Artist Residencies', href: '/about/mission' },
                        { label: 'Resources', href: '/whats-on' }
                    ]
                }
            ]
        },
        { href: '/channel', label: 'Channel' },
        {
            href: '/get-involved',
            label: 'Support',
            columns: [
                {
                    title: 'Join Us', links: [
                        { label: 'Membership', href: '/get-involved#membership' },
                        { label: 'Support NCAI', href: '/get-involved#support' },
                        { label: 'Careers', href: '/about/careers' }
                    ]
                },
                {
                    title: 'Opportunities', links: [
                        { label: 'Volunteer', href: '/contact' },
                        { label: 'Venue Hire', href: '/contact' }
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

    // Important: The header turns dark when:
    // 1. A desktop mega menu is active
    // 2. The user is hovering over the header bar
    // 3. We are on an artist portrait page
    const isArtistPortrait = pathname?.includes('/artist-portrait-')
    const isArtist = pathname?.includes('/artists/')
    const isExhibition = pathname?.includes('/exhibitions/')
    const isChannel = pathname?.includes('/channel')
    const isCollection = pathname?.includes('/collection')
    
    // Header turns dark (white text -> dark background)
    const isDark = activeMenuIndex !== null || isHoveringHeader || isArtistPortrait || isArtist || isExhibition || isChannel || isCollection || isMobileMenuOpen
    
    // Header becomes solid (non-transparent)
    const isSolid = isScrolled || isMobileMenuOpen || activeMenuIndex !== null || isArtistPortrait || isArtist || isExhibition || isChannel || isCollection

    return (
        <>
            {/* The header is fixed, meaning it overlays the hero section like IMMA */}
                <div
                    ref={headerRef}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-[100] flex flex-col w-full transition-all duration-500 ease-in-out",
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
                        // Force expanded state on server and initial client pass
                        (!mounted || !isScrolled) ? "max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    )}>
                        {openingStatus}
                    </div>
                </div>

                <header
                    className={cn(
                        "transition-all duration-300",
                        isDark 
                            ? "bg-background-dark text-white shadow-sm" 
                            : isSolid 
                                ? "bg-white text-charcoal shadow-sm"
                                : "bg-transparent text-ivory" 
                    )}
                    onMouseEnter={() => setIsHoveringHeader(true)}
                    onMouseLeave={() => setIsHoveringHeader(false)}
                >
                    <div className="flex justify-between items-stretch px-6 md:px-12 transition-all duration-300 relative z-50">
                        {/* Logo Section */}
                        <div className="flex items-center py-6">
                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center group relative h-full w-full transition-colors duration-300",
                                    isDark ? "text-white" : isSolid ? "text-charcoal" : "text-ivory"
                                )}
                                aria-label="NCAI Home"
                                onMouseEnter={closeMegaMenu}
                            >
                                {/* Initial State: Logomark + NCAI */}
                                <div ref={initialLogoRef} className="flex items-center gap-2 md:absolute md:left-0 whitespace-nowrap">
                                    <Logo className="h-10 md:h-12 w-auto transition-colors" />
                                    <span className="text-3xl font-bold tracking-tighter transition-colors pt-2">NCAI</span>
                                </div>

                                {/* Target State: Full Title (revealed on scroll) */}
                                <div
                                    ref={fullLogoRef}
                                    className="hidden md:flex items-center absolute left-0 whitespace-nowrap opacity-0"
                                    aria-hidden="true"
                                >
                                    <Logo className="h-8 md:h-10 w-auto mr-4" />
                                    <span className="text-xl md:text-3xl font-bold tracking-tight">
                                        {t('title')}
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Section - Desktop Only */}
                        <div className="hidden md:flex flex-col justify-center gap-2 py-4">
                            {/* Top Tier Links (Small) */}
                            <div className="flex justify-end items-center gap-6">
                                {utilityLinks.length > 0 ? (
                                    utilityLinks.map((link, idx) => (
                                        <Link 
                                            key={`${link.label}-${link.href}-${idx}`} 
                                            href={link.href} 
                                            className="opacity-80 hover:opacity-100 text-xs font-semibold tracking-widest uppercase transition-opacity"
                                        >
                                            {link.label}
                                        </Link>
                                    ))
                                ) : (
                                    <>
                                        <Link href="#" className="opacity-80 hover:opacity-100 text-[10px] font-bold tracking-[0.2em] uppercase transition-opacity">Shop</Link>
                                        <Link href="/get-involved#membership" className="opacity-80 hover:opacity-100 text-[10px] font-bold tracking-[0.2em] uppercase transition-opacity">Membership</Link>
                                    </>
                                )}
                                <LanguageSwitcher />
                            </div>

                            {/* Bottom Tier Links (Large) */}
                            <div className="flex justify-end items-center gap-8">
                                <nav className="flex items-center gap-8">
                                    {displayLinks.map((link, idx) => (
                                        <Link
                                            key={`${link.label}-${link.href}-${idx}`}
                                            href={link.href}
                                            className="text-lg md:text-xl font-bold uppercase tracking-tight relative py-2 group hover:opacity-70 transition-opacity"
                                            onMouseEnter={() => handleMouseEnter(idx)}
                                        >
                                            {link.label}
                                            <span className={cn(
                                                "absolute bottom-0 left-0 h-0.5 transition-all ease-in-out duration-300",
                                                isDark ? "bg-white" : isSolid ? "bg-charcoal" : "bg-ivory",
                                                activeMenuIndex === idx ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                            )} />
                                        </Link>
                                    ))}
                                    {/* Desktop Search Toggle */}
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

                        {/* Mobile Utils Section */}
                        <div className={cn(
                            "flex md:hidden items-center px-6 border-l gap-2 transition-colors duration-300",
                            isDark ? "border-white/10" : "border-black/10"
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

                            {/* Mobile Menu Toggle */}
                            <button
                                className="focus:outline-none p-2 relative z-50 h-10 w-10 flex items-center justify-center transition-all active:scale-95"
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
                                activeCategory={link.label}
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
                                <div key={`${link.label}-${link.href}-${i}`} className="flex flex-col gap-4">
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
                                                    key={`${sublink?.label}-${sublink?.href}-${j}`}
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
