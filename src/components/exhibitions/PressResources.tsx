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
                        <div className="flex items-center gap-4 py-2">
                            <button
                                onClick={() => setActivePdf({ url: pressKitUrl, title: 'Press Kit' })}
                                className="text-left flex-1 text-lg font-medium tracking-tight hover:underline underline-offset-4"
                            >
                                Read press release
                            </button>
                            <a
                                href={pressKitUrl}
                                download
                                className="shrink-0 text-sm font-bold underline underline-offset-4 hover:no-underline"
                                aria-label="Download Read press release"
                            >
                                Download
                            </a>
                        </div>
                    )}
                    {exhibitionGuideUrl && (
                        <div className="flex items-center gap-4 py-2">
                            <button
                                onClick={() => setActivePdf({ url: exhibitionGuideUrl, title: 'Exhibition Guide' })}
                                className="text-left flex-1 text-lg font-medium tracking-tight hover:underline underline-offset-4"
                            >
                                Read exhibition guide
                            </button>
                            <a
                                href={exhibitionGuideUrl}
                                download
                                className="shrink-0 text-sm font-bold underline underline-offset-4 hover:no-underline"
                                aria-label="Download Read exhibition guide"
                            >
                                Download
                            </a>
                        </div>
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
