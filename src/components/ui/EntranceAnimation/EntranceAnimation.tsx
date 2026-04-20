'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from '@/lib/gsap'
import { usePathname } from '@/i18n'
import { Logo } from '@/components/ui/Logo'
import { useReducedMotion } from '@/contexts/AccessibilityContext'
import { SECONDARY_COLORS, TERTIARY_COLORS } from '@/lib/colors'

const STARK_COLORS = Array.from({ length: 24 }, (_, i) => i % 2 === 0 ? '#000000' : '#FFFFFF')

interface EntranceAnimationProps {
    backgroundImages?: { url: string; alt: string }[]
}

export function EntranceAnimation({ backgroundImages = [] }: EntranceAnimationProps) {
    const pathname = usePathname()
    const isReducedMotion = useReducedMotion()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(pathname === '/')
    const [selectedImages, setSelectedImages] = useState<{ url: string; alt: string }[]>([])

    // Randomly select 3 unique images only on client side to avoid hydration mismatch
    useEffect(() => {
        if (!backgroundImages || backgroundImages.length === 0) return
        
        const shuffled = [...backgroundImages]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        
        setSelectedImages(shuffled.slice(0, 3))
    }, [backgroundImages])

    useEffect(() => {
        if (pathname === '/') {
            setIsVisible(true)
        }
    }, [pathname])

    useEffect(() => {
        if (!isVisible || !containerRef.current) return

        // -- SCROLL LOCK --
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const container = containerRef.current
        const phase1Stripes = container.querySelectorAll('.phase-1-stripe')
        const phase2Stripes = container.querySelectorAll('.phase-2-stripe')
        const phase3Stripes = container.querySelectorAll('.phase-3-stripe')
        const phase4Stripes = container.querySelectorAll('.phase-4-stripe')
        const identityContainer = container.querySelector('.identity-reveal-container')
        const logoMarkBars = container.querySelectorAll('.logo-mark-bar')
        const wordmarkLetters = container.querySelectorAll('.wordmark-letter')
        const bg1 = container.querySelector('.bg-layer-1')
        const bg2 = container.querySelector('.bg-layer-2')
        const bg3 = container.querySelector('.bg-layer-3')

        // If reduced motion is enabled, we skip the complex sequence
        if (isReducedMotion) {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = originalOverflow || 'unset'
                    setIsVisible(false)
                }
            })
            tl.to(container, { opacity: 0, duration: 1, delay: 1, ease: 'power2.inOut' })
            return () => {
                document.body.style.overflow = originalOverflow || 'unset'
                tl.kill()
            }
        }

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = originalOverflow || 'unset'
                setIsVisible(false)
            }
        })

        // -- Initial State --
        tl.set(phase1Stripes, { y: 0, opacity: 1, visibility: 'visible' }, 0)
        tl.set(phase2Stripes, { y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'), autoAlpha: 0 }, 0)
        tl.set(phase3Stripes, { y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'), autoAlpha: 0 }, 0)
        tl.set(phase4Stripes, { y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'), autoAlpha: 0 }, 0)
        tl.set(logoMarkBars, { opacity: 0 }, 0)
        tl.set(wordmarkLetters, { opacity: 0, scale: 0.95 }, 0)

        // BG Layers initialization
        if (bg1) tl.set(bg1, { autoAlpha: 1 }, 0)
        if (bg2) tl.set(bg2, { autoAlpha: 0 }, 0)
        if (bg3) tl.set(bg3, { autoAlpha: 0 }, 0)

        // -- Phase 1 Exit --
        tl.to(phase1Stripes, {
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.0, ease: 'power2.inOut', stagger: 0.05
        }, 0.35)

        // -- Phase 2 Sweep --
        tl.to(phase2Stripes, {
            autoAlpha: 1, y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.0, ease: 'power2.inOut', stagger: 0.03
        }, 0.8)
        if (bg2) tl.set(bg2, { autoAlpha: 1 }, 1.15)

        // -- Phase 3 Sweep --
        tl.to(phase3Stripes, {
            autoAlpha: 1, y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.0, ease: 'power2.inOut', stagger: 0.015
        }, 1.35)
        if (bg3) tl.set(bg3, { autoAlpha: 1 }, 1.7)

        // -- PHASE 4: THE CONTINUOUS SWEEP (Never static, Always solid) --
        // Set visibility immediately so they are solid as they enter the frame
        tl.set(phase4Stripes, { autoAlpha: 1, visibility: 'visible' }, 1.9)

        tl.to(phase4Stripes, {
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 2.2, // Slightly faster for snappier feel
            ease: 'none', // Strict linear motion for non-static requirement
            stagger: { each: 0.005, from: "center" }
        }, 1.9)

        // Backdrop Blur Layer reveal (blurs the homepage content behind the overlay)
        const blurLayer = container.querySelector('.backdrop-blur-layer')
        tl.to(blurLayer, {
            opacity: 1,
            backdropFilter: 'blur(80px)',
            duration: 1.0, // Smoother transition
            ease: 'power2.out'
        }, 1.9)

        // -- LOGO REVEAL --
        // Place the logo mark bars only when the stripes have met and are starting to leave (approx 0.5s into sweep)
        tl.set(identityContainer, { opacity: 1 }, 2.4)
        tl.set(logoMarkBars, { opacity: 1 }, 2.4)

        // Snap logo bars to final "close" proportions (ONLY AFTER all stripes have left the screen)
        tl.to(logoMarkBars, {
            x: (i: number) => {
                if (i === 0) return `${(100 / 24) * 0.5}vw`
                if (i === 2) return `-${(100 / 24) * 0.5}vw`
                return "0vw"
            },
            duration: 0.8, // Slightly slower for more impact
            ease: 'back.out(1.2)'
        }, 4.2)

        // Staggered reveal of NCAI letters
        tl.to(wordmarkLetters, {
            opacity: 1, 
            scale: 1, 
            duration: 0.3, 
            stagger: 0.06,
            ease: 'expo.out' 
        }, 4.8)

        // Reveal the homepage as the shutters create a solid mask at center
        const baseLayer = container.querySelector('.bg-base-layer')
        if (baseLayer) tl.to(baseLayer, { opacity: 0, duration: 0.1 }, 2.1)
        if (bg1 || bg2 || bg3) {
            tl.set([bg1, bg2, bg3].filter(Boolean), { autoAlpha: 0 }, 2.45)
        }

        // Logo and wordmark exit / fade out + Remove background blur
        tl.to([logoMarkBars, wordmarkLetters], {
            opacity: 0, 
            y: -20,
            scale: 1.02,
            duration: 0.6, 
            ease: 'power2.in'
        }, 6.2)
        
        tl.to(blurLayer, {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            duration: 1.2,
            ease: 'power2.inOut'
        }, 6.2)

        return () => {
            document.body.style.overflow = originalOverflow || 'unset'
            tl.kill()
        }
    }, [isVisible, isReducedMotion, selectedImages])

    if (!isVisible) return null

    // -- Geometric Calculations --
    const STRIPE_COUNT = 24
    const STRIPE_W = (100 / STRIPE_COUNT)
    // Shift left so the bars align with indices 6, 8, 10
    const UNIT_LEFT_OFFSET = (STRIPE_W * 6) 

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden pointer-events-none"
        >
            {/* Base Background (faded out before reveal) */}
            <div className="bg-base-layer absolute inset-0 bg-white z-0" />

            {/* Backdrop Blur Layer (initially hidden) */}
            <div className="backdrop-blur-layer absolute inset-0 z-[1] opacity-0 pointer-events-none" />

            {/* Background Layers */}
            {selectedImages[0] && <img src={selectedImages[0].url} className="bg-layer-1 absolute inset-0 w-full h-full object-cover z-[2] invisible opacity-0" alt="" />}
            {selectedImages[1] && <img src={selectedImages[1].url} className="bg-layer-2 absolute inset-0 w-full h-full object-cover z-[3] invisible opacity-0" alt="" />}
            {selectedImages[2] && <img src={selectedImages[2].url} className="bg-layer-3 absolute inset-0 w-full h-full object-cover z-[4] invisible opacity-0" alt="" />}

            {/* Phases 1-4 Striped Panels */}
            <div className="absolute inset-0 flex w-full h-full z-10 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={`p1-${i}`} className="phase-1-stripe h-[200vh] flex-1 bg-black" />)}
            </div>
            <div className="absolute inset-0 flex w-full h-full z-20 pointer-events-none">
                {[...Array(12)].map((_, i) => <div key={`p2-${i}`} className="phase-2-stripe h-[200vh] flex-1 invisible opacity-0" style={{ background: SECONDARY_COLORS[i] }} />)}
            </div>
            <div className="absolute inset-0 flex w-full h-full z-30 pointer-events-none">
                {[...Array(24)].map((_, i) => <div key={`p3-${i}`} className="phase-3-stripe h-[200vh] flex-1 invisible opacity-0" style={{ background: TERTIARY_COLORS[i] }} />)}
            </div>
            <div className="absolute inset-0 flex w-full h-full z-[35] pointer-events-none">
                {STARK_COLORS.map((color, i) => (
                    <div 
                        key={`p4-${i}`} 
                        className="phase-4-stripe h-[200vh] flex-1 invisible opacity-0" 
                        style={{ background: color }} 
                    />
                ))}
            </div>

            {/* Geometric Identity Reveal Unit - Nested below Phase 4 stripes (z-35) */}
            <div 
                className="identity-reveal-container absolute inset-0 z-[34] flex items-center pointer-events-none opacity-0"
                style={{ paddingLeft: `${UNIT_LEFT_OFFSET}vw` }}
            >
                <div className="flex items-center gap-12">
                    {/* Logo Mark: 3 Vertical Bars aligned with Grid Stripes 6, 8, 10 (Each width = 1 stripe) */}
                    <div 
                        className="flex items-start h-[min(22vw,260px)]" 
                        style={{ width: `${STRIPE_W * 5}vw` }}
                    >
                        {/* Box 1 (Left Stripe - Index 6) */}
                        <div 
                            className="logo-mark-bar bg-white h-[66%] mt-[34%] translate-x-0" 
                            style={{ 
                                width: `${STRIPE_W}vw`,
                                marginRight: `${STRIPE_W}vw` 
                            }} 
                        />
                        {/* Box 2 (Middle Stripe - Index 8) */}
                        <div 
                            className="logo-mark-bar bg-white h-[68%] mt-0 translate-x-0" 
                            style={{ 
                                width: `${STRIPE_W}vw`,
                                marginRight: `${STRIPE_W}vw` 
                            }} 
                        />
                        {/* Box 3 (Right Stripe - Index 10) */}
                        <div 
                            className="logo-mark-bar bg-white h-[66%] mt-[34%] translate-x-0" 
                            style={{ width: `${STRIPE_W}vw` }} 
                        />
                    </div>

                    {/* Wordmark: Staggered Fade */}
                    <h1
                        className="ncai-logo-text flex text-white font-bold tracking-tighter leading-none select-none"
                        style={{
                            fontSize: 'clamp(60px, 14vw, 280px)',
                            textShadow: '0 4px 60px rgba(0,0,0,0.3)',
                        }}
                    >
                        {"NCAI".split('').map((letter, i) => (
                            <span key={i} className="wordmark-letter inline-block">{letter}</span>
                        ))}
                    </h1>
                </div>
            </div>
        </div>
    )
}
