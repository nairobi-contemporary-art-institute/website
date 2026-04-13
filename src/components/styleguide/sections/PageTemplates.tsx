'use client'

import React from 'react'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function PageTemplates() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 13</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Page Templates
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Standardized layouts serving as the structural foundation for distinct content archetypes across the NCAI platform.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Core Archetypes</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <TemplateCard 
                        title="Generic Page"
                        type="sanity/schemaTypes/page.ts"
                        description="The baseline structural template for text-heavy editorial pages, policies, and standard communication. Employs the default NCAI grid and spacing logic without specialized programmatic features."
                    />
                    <TemplateCard 
                        title="Artist Profile"
                        type="sanity/schemaTypes/artist.ts"
                        description="A complex, data-rich template dedicated to representing creator portfolios. Integrates relationship fields connecting the artist to specific exhibitions, museum modules, and individual artworks."
                    />
                    <TemplateCard 
                        title="Home Page"
                        type="sanity/schemaTypes/homePage.ts"
                        description="The experiential entry point to the institute. Features custom layout overrides, hero slide orchestration, and featured programmatic content (exhibitions, news)."
                    />
                    <TemplateCard 
                        title="Index Pages (Artists/Exhibitions)"
                        type="sanity/schemaTypes/artistsPage.ts"
                        description="Aggregator templates. These manage the presentation of structured grid lists, defining header styling, taxonomy filtering behavior, and search presentation."
                    />
                </div>
            </section>

            <ResponsiveDivider variant="curved" weight="thin" className="text-umber/5 mt-20" />

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Implementation Details</h3>
                <div className="bg-ivory border border-umber/10 p-8 space-y-6">
                    <p className="text-sm text-umber/80 leading-relaxed">
                        Every template relies on Next.js 15 App Router conventions (`page.tsx` rendering layouts) combined with strongly typed Sanity schema definitions. 
                        The decoupling between content structure (Sanity) and presentation (Next.js) allows non-technical editors to orchestrate complex visual layouts without breaking the design system.
                    </p>
                    <div className="bg-charcoal text-ivory/80 p-6 font-mono text-xs mt-4">
                        <p className="text-ochre mb-2"># Template Instantiation Flow</p>
                        <p>1. Identify archetype required (e.g., event vs. exhibition)</p>
                        <p>2. Define localized routing in src/app/[locale]/[archetype]/page.tsx</p>
                        <p>3. Fetch data using typed GROQ queries via sanityFetch()</p>
                        <p>4. Render through designated UI composite components</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

function TemplateCard({ title, type, description }: { title: string, type: string, description: string }) {
    return (
        <div className="bg-ivory border border-umber/10 p-6 space-y-4 hover:border-ochre/50 transition-colors">
            <div>
                <h4 className="text-lg font-bold text-charcoal">{title}</h4>
                <p className="text-[10px] text-umber/60 font-mono mt-1">{type}</p>
            </div>
            <p className="text-sm text-umber/80 leading-relaxed">
                {description}
            </p>
        </div>
    )
}
