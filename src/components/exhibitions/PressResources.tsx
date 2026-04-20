'use client'

import { useState } from 'react'
import { AccordionSection } from '@/components/ui/AccordionSection'
import { PDFViewerModal } from '@/components/ui/PDFViewerModal'

interface PressResourcesProps {
    pressKitUrl?: string
    exhibitionGuideUrl?: string
}

export function PressResources({ pressKitUrl, exhibitionGuideUrl }: PressResourcesProps) {
    const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null)

    if (!pressKitUrl && !exhibitionGuideUrl) return null

    return (
        <>
            <AccordionSection title="Press & Resources">
                <div className="flex flex-col gap-4">
                    {pressKitUrl && (
                        <button 
                            onClick={() => setActivePdf({ url: pressKitUrl, title: 'Press Kit' })}
                            className="text-left py-2 flex items-center gap-4 group w-full"
                        >
                            <span className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all">↓</span>
                            <span className="text-lg font-medium tracking-tight">Download Press Release</span>
                        </button>
                    )}
                    {exhibitionGuideUrl && (
                        <button 
                            onClick={() => setActivePdf({ url: exhibitionGuideUrl, title: 'Exhibition Guide' })}
                            className="text-left py-2 flex items-center gap-4 group w-full"
                        >
                            <span className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all">↓</span>
                            <span className="text-lg font-medium tracking-tight">Exhibition Guide</span>
                        </button>
                    )}
                </div>
            </AccordionSection>

            <PDFViewerModal 
                isOpen={!!activePdf}
                onClose={() => setActivePdf(null)}
                fileUrl={activePdf?.url || ''}
                title={activePdf?.title || ''}
            />
        </>
    )
}
