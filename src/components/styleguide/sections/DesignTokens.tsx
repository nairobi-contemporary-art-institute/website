'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

const COLORS = [
    { name: 'Sun-Bleached Ivory', hex: '#FDFBF7', class: 'bg-ivory border border-umber/10', token: '--ivory', type: 'Canvas' },
    { name: 'Charcoal Black', hex: '#1A1A1A', class: 'bg-charcoal', token: '--charcoal', type: 'Structure' },
    { name: 'Deep Umber', hex: '#4A3B32', class: 'bg-umber', token: '--umber', type: 'Secondary' },
    { name: 'Ochre', hex: '#CCA43B', class: 'bg-ochre', token: '--ochre', type: 'Accent' },
    { name: 'Vibrant Indigo', hex: '#3F51B5', class: 'bg-indigo', token: '--indigo', type: 'Action' },
    { name: 'Burnished Gold', hex: '#D4AF37', class: 'bg-gold', token: '--gold', type: 'Premium' },
]

export function DesignTokens() {
    return (
        <div className="space-y-20">
            <header>
                <h2 className="text-xs font-bold text-umber/40 uppercase tracking-[0.4em] mb-4">Section 03</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal uppercase tracking-tighter mb-8">
                    Design Tokens
                </h1>
                <p className="text-lg text-umber/80 italic leading-relaxed max-w-2xl">
                    The atomic values of the NCAI interface — from color and typography to the spacing scale that defines our architectural rhythm.
                </p>
            </header>

            {/* Colors */}
            <section>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-10 border-b border-umber/10 pb-4">Color Palette</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    {COLORS.map((color) => (
                        <div key={color.name} className="flex gap-4 items-center">
                            <div className={`w-20 h-20 rounded-sm shrink-0 shadow-sm ${color.class}`} />
                            <div>
                                <h4 className="text-[10px] font-bold text-umber/40 uppercase tracking-widest mb-1">{color.type}</h4>
                                <h5 className="text-sm font-bold text-charcoal uppercase tracking-tighter">{color.name}</h5>
                                <div className="mt-2 flex gap-2">
                                    <code className="text-[10px] bg-charcoal/5 px-1.5 py-0.5 rounded-xs text-charcoal/60 lowercase">{color.token}</code>
                                    <code className="text-[10px] bg-charcoal/5 px-1.5 py-0.5 rounded-xs text-charcoal/60">{color.hex}</code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography */}
            <section>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-10 border-b border-umber/10 pb-4">Typography Scale</h3>
                <div className="space-y-16">
                    <div className="group">
                        <span className="text-[9px] text-umber/40 font-mono mb-4 block">--font-size-4xl (3rem)</span>
                        <h2 className="text-5xl md:text-8xl font-bold text-charcoal uppercase tracking-tighter leading-none group-hover:text-ochre transition-colors">
                            INSTITUTION
                        </h2>
                    </div>
                    <div className="group">
                        <span className="text-[9px] text-umber/40 font-mono mb-4 block">--font-size-2xl (1.5rem / Italic)</span>
                        <h3 className="text-2xl md:text-5xl font-bold text-charcoal italic tracking-tight leading-none">
                            Nairobi Contemporary Art Institute
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <span className="text-[9px] text-umber/40 font-mono mb-4 block">Body — 14px / Line-Height 1.4</span>
                            <p className="text-base text-umber/90 leading-relaxed">
                                Curated Restraint: Excess ornamentation is rejected. Architectural Clarity: Layouts reflect gallery architecture. Cultural Intelligence: Regional identity via structure, not decoration.
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] text-umber/40 font-mono mb-4 block">Metadata — 12px / Monospace</span>
                            <code className="text-[12px] font-mono text-charcoal leading-snug block">
                                EXHIBITION_ID: 2026_01_RETRO<br />
                                CURATOR: SARAH_MBEKI<br />
                                STATUS: ACTIVE_ARCHIVE
                            </code>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
