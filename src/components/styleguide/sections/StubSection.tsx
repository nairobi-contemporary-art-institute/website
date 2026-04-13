'use client'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

interface StubSectionProps {
    id: string
    title: string
    description?: string
    phase?: string
}

export function StubSection({ id, title, description, phase = "3-5" }: StubSectionProps) {
    return (
        <div id={id} className="min-h-[40vh] py-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-ochre capitalize tracking-[0.2em] px-2 py-1 bg-ochre/10">
                    Coming Soon — Phase {phase}
                </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal capitalize tracking-tighter mb-6">
                {title}
            </h2>
            <div className="max-w-2xl bg-ivory border border-umber/10 p-8">
                <p className="text-umber/60 italic leading-relaxed">
                    {description || "This section is part of our long-term documentation strategy. It will be populated with live components, guidelines, and templates as the project progresses through future implementation phases."}
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="w-8 h-[1px] bg-umber/20 mt-3" />
                    <p className="text-[10px] text-umber/40 capitalize tracking-widest leading-relaxed">
                        Part of the NCAI Museum-Grade Design System Framework
                    </p>
                </div>
            </div>
            <ResponsiveDivider variant="curved" weight="thin" className="text-umber/5 mt-20" />
        </div>
    )
}
