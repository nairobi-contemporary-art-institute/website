'use client'

import { useRef, useState } from 'react'
import { Dialog } from '@base-ui/react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { X, Download, Printer, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerModalProps {
    isOpen: boolean
    onClose: () => void
    fileUrl: string
    title: string
}

export function PDFViewerModal({ isOpen, onClose, fileUrl, title }: PDFViewerModalProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<HTMLDivElement>(null)
    const [viewMode, setViewMode] = useState<'standard' | 'wide' | 'full'>('wide')

    const { contextSafe } = useGSAP({ scope: containerRef })

    const onEnter = contextSafe(() => {
        gsap.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
        gsap.fromTo(viewerRef.current,
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' }
        )
    })

    useGSAP(() => {
        if (isOpen) {
            onEnter()
        }
    }, [isOpen])

    const onPrint = () => {
        const win = window.open(fileUrl, '_blank')
        if (win) {
            win.print()
        }
    }

    const toggleViewMode = () => {
        const modes: ('standard' | 'wide' | 'full')[] = ['standard', 'wide', 'full']
        const currentIndex = modes.indexOf(viewMode)
        const nextIndex = (currentIndex + 1) % modes.length
        setViewMode(modes[nextIndex])
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                {/* Backdrop */}
                <Dialog.Backdrop
                    ref={overlayRef}
                    className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-sm"
                />

                <Dialog.Popup
                    ref={containerRef}
                    className={cn(
                        "fixed inset-0 z-[110] flex flex-col items-center justify-center outline-none transition-all duration-500",
                        viewMode === 'full' ? "p-0" : "p-4 md:p-8 lg:p-12"
                    )}
                >
                    <div 
                        ref={viewerRef}
                        className={cn(
                            "w-full h-full bg-white shadow-2xl overflow-hidden flex flex-col relative transition-all duration-500 ease-in-out",
                            viewMode === 'standard' && "max-w-4xl",
                            viewMode === 'wide' && "max-w-6xl",
                            viewMode === 'full' && "max-w-none"
                        )}
                    >
                        {/* Custom Header - Clinical Luxury */}
                        <div className="bg-charcoal text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                            <div className="flex flex-col min-w-0 flex-1 mr-4">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-1">Resource Viewer</span>
                                <h3 className={cn(
                                    "text-sm font-light tracking-wide truncate transition-all duration-300",
                                    viewMode === 'standard' ? "max-w-[100px] md:max-w-[200px] lg:max-w-[300px]" : "max-w-[150px] md:max-w-xl"
                                )}>
                                    {title}
                                </h3>
                            </div>
                            
                            <div className="flex items-center space-x-2 md:space-x-4">
                                {/* Segmented Width Control */}
                                <div className="hidden md:flex items-center bg-white/5 p-1 border border-white/10">
                                    <button 
                                        onClick={() => setViewMode('standard')}
                                        className={cn(
                                            "px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all duration-300",
                                            viewMode === 'standard' ? "bg-white text-charcoal" : "text-stone-400 hover:text-white"
                                        )}
                                    >
                                        Standard
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('wide')}
                                        className={cn(
                                            "px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all duration-300",
                                            viewMode === 'wide' ? "bg-white text-charcoal" : "text-stone-400 hover:text-white"
                                        )}
                                    >
                                        Wide
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('full')}
                                        className={cn(
                                            "px-3 py-1 text-[9px] uppercase tracking-widest font-bold transition-all duration-300",
                                            viewMode === 'full' ? "bg-white text-charcoal" : "text-stone-400 hover:text-white"
                                        )}
                                    >
                                        Full
                                    </button>
                                </div>

                                <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />

                                <button 
                                    onClick={onPrint}
                                    className="flex items-center space-x-2 text-stone-300 hover:text-white transition-colors group"
                                >
                                    <Printer className="w-5 h-5" />
                                </button>
                                
                                <a 
                                    href={fileUrl} 
                                    download 
                                    className="flex items-center space-x-2 text-stone-300 hover:text-white transition-colors group"
                                >
                                    <span className="hidden md:inline text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Download</span>
                                    <Download className="w-5 h-5" />
                                </a>

                                <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />

                                <Dialog.Close
                                    className="text-stone-300 hover:text-white transition-colors flex flex-col items-center group"
                                >
                                    <X className="w-6 h-6" />
                                </Dialog.Close>
                            </div>
                        </div>

                        {/* PDF Content Area */}
                        <div className="flex-1 bg-stone-100 relative overflow-hidden">
                            {/* Standard Native Iframe (Performance & Accessibility) */}
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                className="w-full h-full border-none"
                                title={title}
                            />
                            
                            {/* Branded Loading State Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 bg-stone-50">
                                <div className="text-[10px] uppercase tracking-[0.4em] text-charcoal/20 animate-pulse font-black">
                                    NCAI DIGITAL RESOURCE
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
