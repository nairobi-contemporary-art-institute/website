'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { usePathname } from '@/i18n'

// ── 48 Quaternary Colors (6 families × 8 fine-grained shades) ──
const QUATERNARY_COLORS = [
    // Red / Orange family
    '#B71C1C', '#D32F2F', '#E53935', '#FF5252',
    '#FF6E40', '#FF7043', '#FF8A65', '#FFAB91',
    // Orange / Yellow family
    '#FF6D00', '#FF9100', '#FFA000', '#FFB300',
    '#FFC107', '#FFD54F', '#FFEB3B', '#FDD835',
    // Lime / Green family
    '#C0CA33', '#9CCC65', '#8BC34A', '#7CB342',
    '#66BB6A', '#4CAF50', '#43A047', '#2E7D32',
    // Teal / Cyan family
    '#00897B', '#009688', '#00ACC1', '#00BCD4',
    '#0097A7', '#0288D1', '#039BE5', '#03A9F4',
    // Blue / Indigo family
    '#1E88E5', '#1976D2', '#1565C0', '#3949AB',
    '#3F51B5', '#5C6BC0', '#5E35B1', '#7E57C2',
    // Purple / Magenta family
    '#8E24AA', '#AB47BC', '#7B1FA2', '#9C27B0',
    '#D81B60', '#E91E63', '#C2185B', '#AD1457',
]

// ── 24 Tertiary Colors (6 families × 4 shades) ──
const TERTIARY_COLORS = [
    // Red Family
    '#E53935', '#FF7043', '#FB8C00', '#FF9800',
    // Yellow Family
    '#FDD835', '#C0CA33', '#7CB342', '#43A047',
    // Green Family
    '#2E7D32', '#388E3C', '#00897B', '#00ACC1',
    // Cyan/Blue Family
    '#00BCD4', '#039BE5', '#1E88E5', '#3949AB',
    // Violet/Purple Family
    '#5E35B1', '#8E24AA', '#7B1FA2', '#AB47BC',
    // Magenta/Rose Family
    '#D81B60', '#E91E63', '#C2185B', '#AD1457',
]

// ── 12 Secondary Colors (Primary RGB triads cycling) ──
const SECONDARY_COLORS = [
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
]

interface EntranceAnimationProps {
    backgroundImages?: { url: string; alt: string }[]
}

export function EntranceAnimation({ backgroundImages = [] }: EntranceAnimationProps) {
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(pathname === '/')

    useEffect(() => {
        if (pathname === '/') {
            setIsVisible(true)
        }
    }, [pathname])

    useEffect(() => {
        if (!isVisible || !containerRef.current) return

        const container = containerRef.current
        const phase1Stripes = container.querySelectorAll('.phase-1-stripe')
        const phase2Stripes = container.querySelectorAll('.phase-2-stripe')
        const phase3Stripes = container.querySelectorAll('.phase-3-stripe')
        const phase4Stripes = container.querySelectorAll('.phase-4-stripe')
        const ncaiText = container.querySelector('.ncai-logo-text')
        const bg1 = container.querySelector('.bg-layer-1')
        const bg2 = container.querySelector('.bg-layer-2')
        const bg3 = container.querySelector('.bg-layer-3')

        const tl = gsap.timeline({
            onComplete: () => {
                setIsVisible(false)
            }
        })

        // ═══════════════════════════════════════════════
        // T=0: INITIAL STATE
        // ═══════════════════════════════════════════════

        // Phase 1: 6 solid black stripes — full screen coverage
        tl.set(phase1Stripes, { y: 0, opacity: 1, visibility: 'visible' }, 0)

        // Phases 2–4: off-screen and invisible
        tl.set(phase2Stripes, {
            y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'),
            autoAlpha: 0
        }, 0)
        tl.set(phase3Stripes, {
            y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'),
            autoAlpha: 0
        }, 0)
        tl.set(phase4Stripes, {
            y: (i: number) => (i % 2 === 0 ? '100vh' : '-100vh'),
            autoAlpha: 0
        }, 0)

        const bgLayers = [bg1, bg2, bg3].filter(Boolean) as Element[]

        // BG1: Instantly visible at T=0 (hidden behind solid black stripes)
        if (bg1) tl.set(bg1, { autoAlpha: 1 }, 0)
        if (bg2) tl.set(bg2, { autoAlpha: 0 }, 0)
        if (bg3) tl.set(bg3, { autoAlpha: 0 }, 0)

        tl.set(ncaiText, { opacity: 0, scale: 0.85 }, 0)

        // ═══════════════════════════════════════════════
        // T=0.05–0.55s: NCAI LOGO FADES IN
        // ═══════════════════════════════════════════════
        tl.to(ncaiText, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out'
        }, 0.05)

        // ═══════════════════════════════════════════════
        // T=0.35–1.35s: PHASE 1 EXIT (6 B&W stripes slide out)
        // Reveals BG1 behind them
        // ═══════════════════════════════════════════════
        tl.to(phase1Stripes, {
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.0,
            ease: 'power2.inOut',
            stagger: 0.05
        }, 0.35)

        // ═══════════════════════════════════════════════
        // T=0.8–1.85s: PHASE 2 SWEEP (12 secondary colors)
        // ═══════════════════════════════════════════════
        tl.to(phase2Stripes, {
            autoAlpha: 1,
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.05,
            ease: 'power2.inOut',
            stagger: 0.03
        }, 0.8)

        // BG2: INSTANT SWAP at T=1.15 (Phase 2 peak coverage)
        // Stripes travel 400vh total, cross viewport center ~35% into eased duration
        // T = 0.8 + (1.05 × 0.35) ≈ 1.17, rounded to 1.15
        if (bg2) {
            tl.set(bg2, { autoAlpha: 1 }, 1.15)
        }

        // ═══════════════════════════════════════════════
        // T=1.35–2.4s: PHASE 3 SWEEP (24 tertiary colors)
        // ═══════════════════════════════════════════════
        tl.to(phase3Stripes, {
            autoAlpha: 1,
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.05,
            ease: 'power2.inOut',
            stagger: 0.015
        }, 1.35)

        // BG3: INSTANT SWAP at T=1.7 (Phase 3 peak coverage)
        if (bg3) {
            tl.set(bg3, { autoAlpha: 1 }, 1.7)
        }

        // ═══════════════════════════════════════════════
        // T=1.9–2.95s: PHASE 4 SWEEP (48 quaternary colors)
        // This is the final curtain — homepage is revealed after
        // ═══════════════════════════════════════════════
        tl.to(phase4Stripes, {
            autoAlpha: 1,
            y: (i: number) => (i % 2 === 0 ? '-300vh' : '300vh'),
            duration: 1.05,
            ease: 'power2.inOut',
            stagger: 0.007
        }, 1.9)

        // ALL BGS REMOVED at T=2.25 (Phase 4 peak coverage)
        // Phase 4 stripes fully obscure the screen at this moment,
        // so removing BGs is invisible. When Phase 4 exits,
        // the real homepage content is revealed underneath.
        if (bgLayers.length > 0) {
            tl.set(bgLayers, { autoAlpha: 0 }, 2.25)
        }

        // ═══════════════════════════════════════════════
        // T=2.3–3.3s: NCAI LOGO FADES OUT
        // ═══════════════════════════════════════════════
        tl.to(ncaiText, {
            opacity: 0,
            scale: 1.15,
            duration: 1.0,
            ease: 'power2.in'
        }, 2.3)

        return () => {
            tl.kill()
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden pointer-events-none"
        >
            {/* ── Background Image Layers ── */}
            {backgroundImages[0] && (
                <img
                    src={backgroundImages[0].url}
                    alt={backgroundImages[0].alt}
                    className="bg-layer-1 absolute inset-0 w-full h-full object-cover z-[1] invisible opacity-0"
                />
            )}
            {backgroundImages[1] && (
                <img
                    src={backgroundImages[1].url}
                    alt={backgroundImages[1].alt}
                    className="bg-layer-2 absolute inset-0 w-full h-full object-cover z-[2] invisible opacity-0"
                />
            )}
            {backgroundImages[2] && (
                <img
                    src={backgroundImages[2].url}
                    alt={backgroundImages[2].alt}
                    className="bg-layer-3 absolute inset-0 w-full h-full object-cover z-[3] invisible opacity-0"
                />
            )}

            {/* ── Phase 1: 6 Solid Black Stripes ── */}
            <div className="absolute inset-0 flex w-full h-full z-10 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`p1-${i}`}
                        className="phase-1-stripe h-[300vh] flex-1"
                        style={{ background: '#000000' }}
                    />
                ))}
            </div>

            {/* ── Phase 2: 12 Secondary Color Stripes ── */}
            <div className="absolute inset-0 flex w-full h-full z-20 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={`p2-${i}`}
                        className="phase-2-stripe h-[300vh] flex-1 invisible opacity-0"
                        style={{ background: SECONDARY_COLORS[i] }}
                    />
                ))}
            </div>

            {/* ── Phase 3: 24 Tertiary Color Stripes ── */}
            <div className="absolute inset-0 flex w-full h-full z-30 pointer-events-none">
                {[...Array(24)].map((_, i) => (
                    <div
                        key={`p3-${i}`}
                        className="phase-3-stripe h-[300vh] flex-1 invisible opacity-0"
                        style={{ background: TERTIARY_COLORS[i] }}
                    />
                ))}
            </div>

            {/* ── Phase 4: 48 Quaternary Color Stripes (final curtain) ── */}
            <div className="absolute inset-0 flex w-full h-full z-[35] pointer-events-none">
                {[...Array(48)].map((_, i) => (
                    <div
                        key={`p4-${i}`}
                        className="phase-4-stripe h-[300vh] flex-1 invisible opacity-0"
                        style={{ background: QUATERNARY_COLORS[i] }}
                    />
                ))}
            </div>

            {/* ── NCAI Logo Text Overlay ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <h1
                    className="ncai-logo-text text-white font-bold tracking-tighter leading-none select-none opacity-0"
                    style={{
                        fontSize: 'clamp(100px, 20vw, 400px)',
                        textShadow: '0 4px 60px rgba(0,0,0,0.3)',
                    }}
                >
                    NCAI
                </h1>
            </div>
        </div>
    )
}
