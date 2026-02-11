'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export const styleguideSections = [
    { id: '1-intro', label: '01 Introduction & Governance', status: 'ready' },
    { id: '2-brand', label: '02 Brand Foundations', status: 'ready' },
    { id: '3-tokens', label: '03 Design Tokens', status: 'ready' },
    { id: '4-layout', label: '04 Layout & Structure', status: 'ready' },
    { id: '5-components', label: '05 Component Library', status: 'ready' },
    { id: '6-museum', label: '06 Museum Modules', status: 'stub' },
    { id: '7-editorial', label: '07 Editorial & Content', status: 'ready' },
    { id: '8-media', label: '08 Media Guidelines', status: 'stub' },
    { id: '9-motion', label: '09 Interaction & Motion', status: 'ready' },
    { id: '10-a11y', label: '10 Accessibility', status: 'ready' },
    { id: '11-responsive', label: '11 Responsive Strategy', status: 'ready' },
    { id: '12-technical', label: '12 Technical Implementation', status: 'ready' },
    { id: '13-templates', label: '13 Page Templates', status: 'stub' },
    { id: '14-workflow', label: '14 Design/Dev Workflow', status: 'stub' },
    { id: '15-analytics', label: '15 Analytics & Improvement', status: 'stub' },
]

interface StyleguideNavProps {
    activeSection: string
    onSectionChange: (id: string) => void
}

export function StyleguideNav({ activeSection, onSectionChange }: StyleguideNavProps) {
    return (
        <nav className="flex flex-col gap-1 py-4">
            {styleguideSections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className={cn(
                        "text-left px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                        "hover:bg-ivory hover:text-charcoal",
                        activeSection === section.id
                            ? "bg-charcoal text-ivory border-l-4 border-ochre"
                            : "text-umber/60 border-l-4 border-transparent"
                    )}
                >
                    <div className="flex items-center justify-between gap-2">
                        <span>{section.label}</span>
                        {section.status === 'stub' && (
                            <span className="text-[8px] px-1 border border-umber/20 opacity-50">STUB</span>
                        )}
                    </div>
                </button>
            ))}
        </nav>
    )
}
