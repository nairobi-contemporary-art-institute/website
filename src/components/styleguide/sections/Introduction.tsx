'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function Introduction() {
    return (
        <div className="space-y-12">
            <header>
                <h2 className="text-xs font-bold text-umber/40 uppercase tracking-[0.4em] mb-4">Section 01</h2>
                <h1 className="text-5xl md:text-8xl font-bold text-charcoal uppercase tracking-tighter leading-none mb-8">
                    Introduction<br />& Governance
                </h1>
                <p className="text-xl text-umber/80 italic max-w-2xl leading-relaxed">
                    A synthesis of contemporary minimalism and regional identity. This design system serves as the institutional foundation for the Nairobi Contemporary Art Institute's digital presence.
                </p>
            </header>

            <ResponsiveDivider variant="curved" weight="thin" className="text-umber/10" />

            <section className="grid md:grid-cols-2 gap-16">
                <div>
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-6 border-b border-umber/10 pb-2 inline-block">Purpose</h3>
                    <p className="text-base text-umber/90 leading-relaxed mb-6">
                        The purpose of the NCAI Design System is to ensure visual and functional consistency across all digital touchpoints, from the primary website to specialized exhibition microsites.
                    </p>
                    <p className="text-base text-umber/90 leading-relaxed">
                        It provides a shared language for designers, developers, and curators, favoring architectural clarity over decorative excess.
                    </p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-6 border-b border-umber/10 pb-2 inline-block">Governance</h3>
                    <p className="text-sm text-umber/70 leading-relaxed mb-4">
                        This system is maintained by the Digital Strategy team. Changes to core design tokens (brand colors, primary typography) require a review of the institutional brand guidelines.
                    </p>
                    <ul className="text-[10px] font-bold uppercase tracking-widest text-umber/60 space-y-2 list-none">
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-ochre rounded-full" />
                            v1.0.0 — Initial Release (Feb 2026)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-umber/20 rounded-full" />
                            Next Audit: May 2026
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
