'use client'

import React, { useState } from 'react'
import { StyleguideNav, styleguideSections } from './StyleguideNav'
import { Introduction } from '@/components/styleguide/sections/Introduction'
import { BrandFoundations } from '@/components/styleguide/sections/BrandFoundations'
import { DesignTokens } from '@/components/styleguide/sections/DesignTokens'
import { GridSystem } from '@/components/styleguide/sections/GridSystem'
import { ComponentLibrary } from '@/components/styleguide/sections/ComponentLibrary'
import { MuseumModules } from '@/components/styleguide/sections/MuseumModules'
import { StubSection } from '@/components/styleguide/sections/StubSection'
import { EditorialContent } from '@/components/styleguide/sections/EditorialContent'
import { Accessibility } from '@/components/styleguide/sections/Accessibility'
import { InteractionMotion } from '@/components/styleguide/sections/InteractionMotion'
import { BackgroundColors } from '@/components/styleguide/sections/BackgroundColors'
import { PageTemplates } from '@/components/styleguide/sections/PageTemplates'
import { MediaGuidelines } from '@/components/styleguide/sections/MediaGuidelines'
import { DesignDevWorkflow } from '@/components/styleguide/sections/DesignDevWorkflow'
import { AnalyticsImprovement } from '@/components/styleguide/sections/AnalyticsImprovement'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export function StyleguideClient() {
    const [activeSection, setActiveSection] = useState('1-intro')

    const renderSection = () => {
        switch (activeSection) {
            case '1-intro': return <Introduction />
            case '2-brand': return <BrandFoundations />
            case '3-tokens': return <DesignTokens />
            case '4-layout': return <GridSystem />
            case '5-components': return <ComponentLibrary />
            case '6-museum': return <MuseumModules />
            case '7-editorial': return <EditorialContent />
            case '8-media': return <MediaGuidelines />
            case '9-motion': return <InteractionMotion />
            case '10-a11y': return <Accessibility />
            case '13-templates': return <PageTemplates />
            case '14-workflow': return <DesignDevWorkflow />
            case '15-analytics': return <AnalyticsImprovement />
            case '16-bg-colors': return <BackgroundColors />
            default:
                const section = styleguideSections.find(s => s.id === activeSection)
                return <StubSection id={activeSection} title={section?.label || "Coming Soon"} />
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-full md:w-80 border-r border-deep-umber/10 bg-white md:h-screen md:sticky md:top-0 overflow-y-auto z-10">
                <div className="p-8 border-b border-deep-umber/10">
                    <h1 className="text-2xl font-bold text-charcoal capitalize tracking-tighter">NCAI Hub</h1>
                    <p className="text-[10px] text-deep-umber/60 capitalize tracking-widest mt-1">Design System v1.0</p>
                </div>
                <StyleguideNav activeSection={activeSection} onSectionChange={setActiveSection} />
            </aside>

            {/* Main Content Area */}
            <article className="flex-1 px-6 py-12 md:px-20 md:py-24 max-w-6xl overflow-x-hidden">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {renderSection()}
                </div>

                <footer className="mt-24 pt-12 border-t border-deep-umber/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] text-deep-umber/40 capitalize tracking-[0.3em]">
                            Nairobi Contemporary Art Institute — 2026
                        </p>
                        <nav className="flex gap-8 text-[10px] font-bold capitalize tracking-widest text-deep-umber/40">
                            <a href="#" className="hover:text-ochre">GitHub</a>
                            <a href="#" className="hover:text-ochre">Sanity</a>
                            <a href="#" className="hover:text-ochre">Docs</a>
                        </nav>
                    </div>
                </footer>
            </article>
        </div>
    )
}
