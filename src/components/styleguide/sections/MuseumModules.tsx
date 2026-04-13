'use client'

import React from 'react'
import { MuseumGrid } from '@/components/ui/MuseumGrid'
import { WhatsOnClient } from '@/components/whatson/WhatsOnClient'
import { MuseumResultRow } from '@/components/ui/MuseumResultRow'

export function MuseumModules() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 06</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Museum Modules
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Specialized components and architectural systems tailored for museum-tier institutional representation.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">NCAI Header Redesign (IMMA-Style)</h3>
                <div className="bg-ivory border border-umber/10 p-8 space-y-6">
                    <p className="text-sm text-umber/80 leading-relaxed">
                        The new museum-grade header operates on a contextual logic, switching between modes to provide a premium structural hierarchy. 
                        It replicates the layered visual aesthetic found in prominent cultural institutions like the Irish Museum of Modern Art (IMMA).
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-charcoal">HeaderClientNCAI</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                Used everywhere except the homepage. Provides a static, two-tiered navigation framework revealing deeper archive and education links. Features a smooth GSAP-powered logo scroll transition to maintain spatial continuity.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-charcoal">HeaderSwitcher Context</h4>
                            <p className="text-xs text-umber/60 leading-relaxed">
                                Operates silently to determine which header to render based on the active route and the `siteSettings` schema retrieved from Sanity. Admins can globally force the legacy standard header if needed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Archival Datasets</h3>
                <div className="bg-charcoal text-ivory/80 p-8 space-y-6">
                    <p className="text-sm leading-relaxed">
                        Data structured specifically for museological presentation. Extends standard document types mapping complex relationships.
                    </p>
                    
                    <div className="family-mono text-xs space-y-4">
                        <div className="border-l-2 border-ochre pl-4">
                            <strong className="text-white block mb-1">Museum Exhibitions Array</strong>
                            <span className="text-white/50 block">`sanity/schemaTypes/artist.ts`</span>
                            A specialized array linking artists to past museum exhibitions globally, rendered specifically within the `ArtistContent` component.
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Museum Grid & Cards (Isotope)</h3>
                <div className="bg-ivory border border-umber/10 overflow-hidden space-y-12 pb-12">
                    <div className="p-8 border-b border-umber/10 space-y-4">
                        <p className="text-sm text-umber/80 leading-relaxed">
                            A unified architecture mapping the NCAI Content Tree (Exhibitions, Events, Library, etc.) into a responsive masonry isotopic grid. Includes client-side categorized filtering via Framer Motion, modeled heavily after IMMA visual standards.
                        </p>
                    </div>
                    
                    {/* Variant 1: Home Page Style */}
                    <div className="space-y-4">
                        <div className="px-8">
                            <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest border-l-2 border-ochre pl-3">Variant A: Home Page Style</h4>
                            <p className="text-xs text-umber/60 mt-2">Full width, no gaps, 3 columns, 1:1 square aspect ratio.</p>
                        </div>
                        <div className="bg-[#0f0f0f] w-full min-h-[400px]">
                            <MuseumGrid 
                                items={MOCK_MUSEUM_DATA} 
                                filterPrefix="CONTENT SUITABLE FOR:" 
                            />
                        </div>
                    </div>

                    {/* Variant 2: What's On Style */}
                    <div className="space-y-4">
                        <div className="px-8">
                            <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest border-l-2 border-ochre pl-3">Variant B: What's On Calendar Style</h4>
                            <p className="text-xs text-umber/60 mt-2">Contained with padding, gap-4 spacing, 4 columns, 3:4 portrait aspect ratio.</p>
                        </div>
                        <div className="w-full relative border border-umber/10">
                            {/* Rendering the complete What's On Client including filters and calendar */}
                            <WhatsOnClient 
                                items={MOCK_MUSEUM_DATA} 
                                locale="en" 
                                noticeBarSettings={{
                                    enabled: true,
                                    autoMondayClosing: true,
                                    customStatus: {
                                        label: { _type: 'internationalizedArrayString', _key: 'en', value: 'STYLEGUIDE PREVIEW' },
                                        linkText: { _type: 'internationalizedArrayString', _key: 'en', value: 'Learn More' },
                                        linkUrl: '#'
                                    }
                                }}
                            />
                        </div>
                    </div>

                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Result Rows</h3>
                <div className="bg-stone-50 border border-umber/10 overflow-hidden pb-12">
                    <div className="p-8 border-b border-umber/10 mb-8 bg-white">
                        <h4 className="text-sm font-bold text-charcoal mb-2">Sectioned Grid Content</h4>
                        <p className="text-sm text-umber/80 leading-relaxed">
                            Used to chronologically or categorically group items into titled rows, matching the style inspiration of upcoming and current exhibitions. Automatically calculates result counts.
                        </p>
                    </div>
                    
                    <MuseumResultRow 
                        title="Upcoming Exhibitions in 2026" 
                        items={MOCK_MUSEUM_DATA.slice(0,3)}
                    />
                </div>
            </section>
        </div>
    )
}

// Ensure this component works with Next.js specific type imports
const MOCK_MUSEUM_DATA: import('@/lib/types/museum-card').MuseumCardData[] = [
    {
        id: "1",
        href: "#",
        label: "OUTDOOR SCREENINGS",
        title: "Living Canvas at NCAI",
        date: "JUNE - SEPTEMBER 2026",
        backgroundColor: "#1e0000",
        tags: ["Families", "Groups", "Individuals"]
    },
    {
        id: "2",
        href: "#",
        label: "PAGE",
        title: "Join NCAI Members",
        subtitle: "Support contemporary art in Nairobi",
        backgroundColor: "#4a5d23",
        tags: ["Individuals", "Adults"]
    },
    {
        id: "3",
        href: "#",
        label: "ORAL HISTORY PROJECT",
        title: "Voices of Nairobi Artists",
        date: "SERIES 2 OUT NOW",
        backgroundColor: "#3b2a50",
        tags: ["Students", "Individuals", "Groups"]
    },
    {
        id: "4",
        href: "#",
        label: "WORKSHOP, EVENT",
        title: "Children's Creative Studio",
        date: "EVERY SATURDAY",
        backgroundColor: "#a05a2c",
        tags: ["Families", "Children", "Teens"]
    },
    {
        id: "5",
        href: "#",
        label: "EXHIBITION",
        title: "Shifting Grounds",
        subtitle: "Emerging practices",
        date: "CLOSES 12 AUGUST 2026",
        backgroundColor: "#2a3b4c",
        tags: ["Families", "Adults", "Students"]
    }
];
