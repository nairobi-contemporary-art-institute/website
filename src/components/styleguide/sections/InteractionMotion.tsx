'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export function InteractionMotion() {
    const container = useRef<HTMLDivElement>(null)
    const boxRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Simple animation to prove GSAP is working
        gsap.to(boxRef.current, {
            rotation: 360,
            duration: 2,
            repeat: -1,
            ease: "none"
        })

        // ScrollTrigger validation
        gsap.to(".scroll-box", {
            scrollTrigger: {
                trigger: ".scroll-section",
                start: "top center",
                end: "bottom center",
                scrub: true,
                markers: false // Set to true to see the start/end lines
            },
            x: 400,
            backgroundColor: "#A0522D", // Ochre
            borderRadius: "50%"
        })
    }, { scope: container })

    return (
        <section ref={container} className="space-y-12">
            <div>
                <h2 className="text-4xl font-bold text-charcoal tracking-tighter uppercase mb-4">09 Interaction & Motion</h2>
                <p className="text-lg text-umber/80 max-w-2xl">
                    NCAI's digital experience relies on fluid, physics-based motion to guide users through its historical narratives.
                    We use <strong>GSAP</strong> as our primary animation engine.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-8 border border-umber/10 bg-white space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-umber/60">GSAP Core Check</h3>
                    <div
                        ref={boxRef}
                        className="w-20 h-20 bg-ochre flex items-center justify-center text-ivory font-bold text-xs"
                    >
                        GSAP
                    </div>
                    <p className="text-sm text-umber/60 italic">
                        If the box above is rotating, the core GSAP library and <code>useGSAP</code> hook are functioning correctly.
                    </p>
                </div>

                <div className="p-8 border border-umber/10 bg-white space-y-4 scroll-section overflow-hidden">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-umber/60">ScrollTrigger Check</h3>
                    <div className="h-40 relative border-l border-dashed border-umber/20 pl-4">
                        <div className="scroll-box w-16 h-16 bg-charcoal flex items-center justify-center text-ivory font-bold text-[10px] uppercase">
                            Scroll Me
                        </div>
                    </div>
                    <p className="text-sm text-umber/60 italic">
                        Scroll down to see this box move horizontally and change color.
                    </p>
                </div>
            </div>

            <div className="p-12 border border-umber/10 bg-charcoal text-ivory space-y-6">
                <h3 className="text-2xl font-bold tracking-tighter uppercase">Motion Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <h4 className="text-ochre font-bold uppercase text-xs tracking-widest">01 Curvilinear</h4>
                        <p className="text-xs text-ivory/60 leading-relaxed">Motion follows natural, non-linear paths, reflecting the organic growth of art history.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-ochre font-bold uppercase text-xs tracking-widest">02 Purposeful</h4>
                        <p className="text-xs text-ivory/60 leading-relaxed">No motion for its own sake. Every transition must serve hierarchical clarity or narrative flow.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-ochre font-bold uppercase text-xs tracking-widest">03 Accessible</h4>
                        <p className="text-xs text-ivory/60 leading-relaxed">Respect <code>prefers-reduced-motion</code>. Provide static alternatives for all essential navigation.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
