'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function Accessibility() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 10</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Accessibility & Inclusion
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Art is for everyone. We adhere to WCAG 2.2 AAA standards to ensure the NCAI digital experience is usable by people with diverse abilities.
                </p>
            </header>

            <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Visual Standards</h3>
                    <ul className="space-y-4 text-sm text-umber/80 leading-relaxed list-none">
                        <li className="flex gap-3">
                            <span className="text-ochre font-bold">Contrast</span>
                            <span>All text/background combinations maintain a minimum contrast ratio of 7:1 for enhanced legibility.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-ochre font-bold">Typography</span>
                            <span>We avoid font sizes below 12px for metadata and 14px for body content.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-ochre font-bold">Motion</span>
                            <span>Respect for the `prefers-reduced-motion` media query is mandatory across all animations.</span>
                        </li>
                    </ul>
                </div>
                <div className="space-y-8">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Structural Standards</h3>
                    <ul className="space-y-4 text-sm text-umber/80 leading-relaxed list-none">
                        <li className="flex gap-3 border-l-2 border-charcoal/5 pl-4">
                            <span>Semantic HTML and ARIA labels are used to ensure screen reader compatibility.</span>
                        </li>
                        <li className="flex gap-3 border-l-2 border-charcoal/5 pl-4">
                            <span>Keyboard navigation is preserved; focus states are never suppressed.</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
