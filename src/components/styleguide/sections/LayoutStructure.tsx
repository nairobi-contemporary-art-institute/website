'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function LayoutStructure() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 uppercase tracking-[0.4em] mb-4">Section 04</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal uppercase tracking-tighter mb-8">
                    Layout & Grid
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Our layouts are blueprints for intuitive exploration. Inspired by Swahili coastal geometry and modern architectural rhythm.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-4">Global Container</h3>
                <div className="bg-umber/5 p-4 md:p-12 relative rounded-sm border border-dashed border-umber/20">
                    <div className="absolute top-0 left-0 text-[8px] bg-charcoal text-ivory px-2 py-1 uppercase tracking-widest font-bold">.container --max-w-5xl</div>
                    <div className="h-40 bg-ivory shadow-sm flex items-center justify-center">
                        <span className="text-[10px] font-bold text-umber/40 uppercase tracking-widest italic">Main Content Area</span>
                    </div>
                    <div className="absolute top-4 left-4 h-[calc(100%-32px)] w-4 bg-ochre/20 flex flex-col items-center justify-center">
                        <span className="text-[8px] -rotate-90 origin-center whitespace-nowrap text-ochre font-bold">PADDING: px-6</span>
                    </div>
                </div>
            </section>

            <section className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Desktop Breakpoint</h4>
                    <p className="text-sm text-umber/70 leading-relaxed">
                        Full multi-column layouts enabled. Sidebar becomes sticky for deep content exploration.
                    </p>
                    <code className="text-xs bg-charcoal text-ivory px-2 py-1 rounded-sm">1024px+</code>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Tablet Rhythm</h4>
                    <p className="text-sm text-umber/70 leading-relaxed">
                        Transitions to single column with prominent centered headings. Horizontal flows remain active.
                    </p>
                    <code className="text-xs bg-charcoal/10 text-charcoal px-2 py-1 rounded-sm">768px+</code>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Mobile Focus</h4>
                    <p className="text-sm text-umber/70 leading-relaxed">
                        Pure vertical hierarchy. Navigation collapses into intentional drawers.
                    </p>
                    <code className="text-xs bg-ochre/20 text-ochre px-2 py-1 rounded-sm">&lt;768px</code>
                </div>
            </section>
        </div>
    )
}
