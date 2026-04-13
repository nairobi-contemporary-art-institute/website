'use client'

import React from 'react'

export function DesignDevWorkflow() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 14</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Design/Dev Workflow
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    The strict, formalized standard operating procedure driving the pipeline from design specification to Next.js deployment.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">The GSD Methodology</h3>
                <div className="bg-ivory border border-umber/10 p-8 space-y-6">
                    <p className="text-sm text-umber/80 leading-relaxed">
                        NCAI development strictly follows the <strong>Get Stuff Done (GSD)</strong> framework, utilizing a suite of slash commands and planning artifacts to maintain codebase health and prevent technical drift.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-4 pt-4 border-t border-umber/10">
                            <h4 className="text-sm font-bold text-charcoal">1. Strategy & Verification</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                Before writing any code, features must be broken down using the Strategist via `/plan`. Every plan is empirically verified against its success criteria by an independent Auditor before it is considered finalized.
                            </p>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-umber/10">
                            <h4 className="text-sm font-bold text-charcoal">2. Artifact Integrity</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                Constant synchronization through `.planning/ROADMAP.md` and `.gsd/STATE.md` guarantees the structural integrity of every sprint cycle. Modifications are always atomic.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Codebase Standards</h3>
                <div className="bg-charcoal p-8">
                    <ul className="space-y-6 text-sm text-ivory/80 list-none">
                        <li className="pl-4 border-l-2 border-ochre pb-4 border-b border-white/5">
                            <strong className="block text-white mb-2">TypeScript Strict Mode</strong>
                            We enforce strict type-checking. Generics and implicit any returns (`warn`) ensure the Sanity query payloads precisely match the UI definitions.
                        </li>
                        <li className="pl-4 border-l-2 border-ochre pb-4 border-b border-white/5">
                            <strong className="block text-white mb-2">Feature-Based Directories</strong>
                            Components are divided exclusively by their domain (e.g., `/layout`, `/ui`, `/home`, `/education`, `/styleguide`).
                        </li>
                        <li className="pl-4 border-l-2 border-ochre">
                            <strong className="block text-white mb-2">Component Constraints</strong>
                            If it relies on `react` hooks, it must use the `'use client'` directive at the top of the file explicitly. Static composites utilize default Server Components to reduce the Javascript footprint delivered to edge locations.
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
