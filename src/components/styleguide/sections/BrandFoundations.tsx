'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { Logo } from '@/components/ui/Logo'

export function BrandFoundations() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 02</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Brand foundations
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    "Contemporary Minimalism x Regional Identity" — A synthesis of Nairobi's modern architectural growth and the organic rhythms of East African craft.
                </p>
            </header>

            <section className="bg-charcoal p-12 md:p-20 text-ivory relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-xs font-bold capitalize tracking-[0.3em] mb-8 text-ivory/40">Philosophy</h3>
                    <p className="text-3xl font-light italic leading-snug mb-8">
                        "The interface honors the city's layered visual culture while maintaining the breathable, gallery-quality minimalism."
                    </p>
                    <div className="flex gap-4">
                        {['Curated Restraint', 'Architectural Clarity', 'Cultural Intelligence'].map(p => (
                            <span key={p} className="text-[9px] font-bold capitalize tracking-widest border border-ivory/20 px-3 py-1">{p}</span>
                        ))}
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 opacity-10">
                    <div className="w-full h-full border border-ivory rotate-45" />
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-12">
                <div className="border border-umber/10 p-8">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest mb-6">Logo Concept</h3>
                    <div className="aspect-video bg-ivory flex items-center justify-center border border-charcoal/5 mb-6 group">
                        <div className="flex items-center gap-3">
                            <Logo className="h-16 w-auto text-charcoal" />
                            <span className="text-5xl font-bold tracking-tighter capitalize pt-3">NCAI</span>
                        </div>
                    </div>
                    <p className="text-sm text-umber/70 leading-relaxed">
                        The primary identity is a synthesis of typographic authority and architectural abstraction. The three vertical bars represent Nairobi's rising skyline and the institutional pillars of the institute, while the bold wordmark maintains a museum-grade presence.
                    </p>
                </div>
                <div className="border border-umber/10 p-8">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest mb-6">Imagery Strategy</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="aspect-square bg-umber/5" />
                        <div className="aspect-square bg-umber/10" />
                    </div>
                    <p className="text-sm text-umber/70 leading-relaxed">
                        Exhibition photography should prioritize scale, texture, and silence. We use large bleed formats and generous negative space to simulate the physical gallery experience.
                    </p>
                </div>
            </section>
        </div>
    )
}
