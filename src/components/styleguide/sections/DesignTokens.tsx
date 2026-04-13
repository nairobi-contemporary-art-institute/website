'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

const COLORS = [
    { name: 'Pure White', hex: '#FFFFFF', class: 'bg-white border border-deep-umber/10', token: '--background', type: 'Canvas' },
    { name: 'Sun-bleached Paper', hex: '#FDFBF7', class: 'bg-sun-bleached-paper border border-deep-umber/10', token: '--sun-bleached-paper', type: 'Brand' },
    { name: 'Charcoal Black', hex: '#1A1A1A', class: 'bg-charcoal', token: '--charcoal', type: 'Structure' },
    { name: 'Dark Background', hex: '#1C1C1C', class: 'bg-background-dark', token: '--background-dark', type: 'Secondary' },
    { name: 'Deep Umber', hex: '#4A3B32', class: 'bg-deep-umber', token: '--deep-umber', type: 'Secondary' },
    { name: 'Ochre', hex: '#CCA43B', class: 'bg-ochre', token: '--ochre', type: 'Accent' },
    { name: 'Rich Blue', hex: '#3F51B5', class: 'bg-rich-blue', token: '--rich-blue', type: 'Action' },
]

const GEIST_HEADINGS = [
    { id: '72', size: '72px', line: '72px', spacing: '-4.32px' },
    { id: '64', size: '64px', line: '64px', spacing: '-3.84px' },
    { id: '56', size: '56px', line: '56px', spacing: '-3.36px' },
    { id: '48', size: '48px', line: '56px', spacing: '-2.88px' },
    { id: '40', size: '40px', line: '48px', spacing: '-2.40px' },
    { id: '32', size: '32px', line: '40px', spacing: '-1.28px' },
    { id: '24', size: '24px', line: '32px', spacing: '-0.96px' },
]

const GEIST_COPY = [
    { id: '24', size: '24px', line: '36px', spacing: 'Normal' },
    { id: '20', size: '20px', line: '32px', spacing: 'Normal' },
    { id: '16', size: '16px', line: '24px', spacing: 'Normal' },
    { id: '14', size: '14px', line: '20px', spacing: 'Normal' },
]

export function DesignTokens() {
    return (
        <div className="space-y-20">
            <header>
                <h2 className="text-xs font-bold text-deep-umber/40 capitalize tracking-[0.4em] mb-4">Section 03</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Design Tokens
                </h1>
                <p className="text-lg text-deep-umber/80 italic leading-relaxed max-w-2xl">
                    The atomic values of the NCAI interface — from color and typography to the spacing scale that defines our architectural rhythm.
                </p>
            </header>

            {/* Colors */}
            <section>
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest mb-10 border-b border-deep-umber/10 pb-4">Color Palette</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {COLORS.map((color) => (
                        <div key={color.name} className="flex gap-4 items-center">
                            <div className={`w-20 h-20 shrink-0 shadow-sm ${color.class}`} />
                            <div>
                                <h4 className="text-[10px] font-bold text-deep-umber/40 capitalize tracking-widest mb-1">{color.type}</h4>
                                <h5 className="text-sm font-bold text-charcoal capitalize tracking-tighter">{color.name}</h5>
                                <div className="mt-2 flex gap-2">
                                    <code className="text-[10px] bg-charcoal/5 px-1.5 py-0.5 text-charcoal/60 lowercase">{color.token}</code>
                                    <code className="text-[10px] bg-charcoal/5 px-1.5 py-0.5 text-charcoal/60">{color.hex}</code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography Scale — Derived from Geist */}
            <section className="space-y-12">
                <header className="border-b border-deep-umber/10 pb-4">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest mb-2">Typography Scale</h3>
                    <p className="text-xs text-deep-umber/60 italic">NCAI uses the Vercel Geist type system for architectural clarity and technical precision.</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Headings */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-bold text-deep-umber/40 capitalize tracking-widest border-l-2 border-ochre pl-3">Headings</h4>
                        <div className="space-y-6">
                            {GEIST_HEADINGS.map(h => (
                                <div key={h.id} className="group">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[9px] font-mono text-deep-umber/40 lowercase">text-heading-{h.id}</span>
                                        <span className="text-[9px] font-mono text-deep-umber/40">{h.size} / {h.line}</span>
                                    </div>
                                    <h5
                                        className={`text-charcoal font-bold capitalize truncate text-heading-${h.id}`}
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        nairobi art
                                    </h5>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Copy & Labels */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-bold text-deep-umber/40 capitalize tracking-widest border-l-2 border-rich-blue pl-3">Copy (Body)</h4>
                            <div className="space-y-8">
                                {GEIST_COPY.map(c => (
                                    <div key={c.id}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[9px] font-mono text-deep-umber/40 lowercase">text-copy-{c.id}</span>
                                            <span className="text-[9px] font-mono text-deep-umber/40 capitalize">{c.size} / {c.line}</span>
                                        </div>
                                        <p
                                            className={`text-deep-umber/90 leading-relaxed text-copy-${c.id}`}
                                        >
                                            Curated restraint: Excess ornamentation is rejected. Architectural clarity: Layouts reflect gallery architecture.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-deep-umber/5">
                            <h4 className="text-[10px] font-bold text-deep-umber/40 capitalize tracking-widest border-l-2 border-charcoal pl-3 mb-6">Font Families</h4>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-mono text-deep-umber/40 capitalize">Sans (Primary)</span>
                                    <p className="text-xl font-bold text-charcoal">Geist Sans</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-mono text-deep-umber/40 capitalize">Mono (System)</span>
                                    <p className="text-xl font-mono text-charcoal">Geist Mono</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
