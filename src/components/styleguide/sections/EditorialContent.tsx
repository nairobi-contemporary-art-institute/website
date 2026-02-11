'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function EditorialContent() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 uppercase tracking-[0.4em] mb-4">Section 07</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal uppercase tracking-tighter mb-8">
                    Editorial & Content
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Institutional tone, voice, and the formatting of cultural metadata.
                </p>
            </header>

            <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-2 inline-block">Tone of Voice</h3>
                    <ul className="space-y-4 text-sm text-umber/80 leading-relaxed list-none">
                        <li className="pl-4 border-l-2 border-ochre">
                            <strong>Scholarly yet Accessible</strong>: Avoid excessive jargon while maintaining intellectual rigour.
                        </li>
                        <li className="pl-4 border-l-2 border-umber/20">
                            <strong>Measured</strong>: Keep copy concise. Let the artist's work speak louder than the description.
                        </li>
                        <li className="pl-4 border-l-2 border-umber/20">
                            <strong>Global-Facing</strong>: Nairobi is our home, but the world is our audience.
                        </li>
                    </ul>
                </div>
                <div className="space-y-8">
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-2 inline-block">Metadata Standards</h3>
                    <div className="bg-charcoal p-6 text-ivory/80 font-mono text-xs rounded-sm space-y-2">
                        <p>Artist Name: UPPERCASE</p>
                        <p>Artwork Title: *Italicized*</p>
                        <p>Medium: Sentence Case</p>
                        <p>Dating: YYYY-YYYY or YYYY</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
