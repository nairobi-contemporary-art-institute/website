'use client'

import React from 'react'

export function AnalyticsImprovement() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 15</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Analytics & Improvement
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Telemetry, engagement mapping, and continuous optimization strategies for the NCAI digital ecosystem.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Telemetry Framework</h3>
                <div className="bg-ivory border border-umber/10 p-8 space-y-6">
                    <p className="text-sm text-umber/80 leading-relaxed">
                        Rather than utilizing highly-invasive, generic trackers, our analytics approach binds closely to the explicit user interactions that indicate true institutional engagement—from exploring historical index sets to registering for physical museum events.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-charcoal">Utility Layer: `src/lib/analytics.ts`</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                A specialized abstraction module that ensures interactions (such as the `trackEvent` properties inside the Search Modal) are correctly piped and standardized before transmitting.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-charcoal">Mailing Operations: `listmonk.ts`</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                A dedicated integration tracking user subscription rates and campaign performance via self-hosted Listmonk infrastructure. Handled securely through `src/app/api/newsletter/subscribe/route.ts`.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Key Performance Indicators</h3>
                <div className="bg-charcoal text-ivory/80 p-8 space-y-6">
                    <p className="text-sm leading-relaxed">
                        The success of a cultural platform is measured differently than an ecommerce site. We track the depth of the visit rather than the velocity.
                    </p>
                    
                    <ul className="text-xs space-y-4 font-mono">
                        <li className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white">GSAP Scroll Completion</span>
                            <span className="text-ochre">Engagement Depth</span>
                        </li>
                        <li className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white">Exhibition Archive Queries</span>
                            <span className="text-ochre">Scholarly Use</span>
                        </li>
                        <li className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white">Event Registration Flow</span>
                            <span className="text-ochre">Conversion</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
