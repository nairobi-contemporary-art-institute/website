'use client'

import { useState, useEffect } from 'react'

import { Link } from '@/i18n'
import { cn } from '@/lib/utils'
import { Popover } from '@base-ui/react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { Info } from 'lucide-react'
import { useLocale } from 'next-intl'

interface MegaMenuProps {
    isOpen: boolean;
    columns: Array<{
        title?: string;
        links: Array<{
            label: string;
            href: string;
        }>;
    }>;
    onClose: () => void;
    featuredImages?: any[];
}

export function MegaMenu({ isOpen, columns, onClose, featuredImages }: MegaMenuProps) {
    const locale = useLocale();
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const images = featuredImages ?? [];

    useEffect(() => {
        if (isOpen && images.length > 0) {
            // Selection logic: shuffle and pick 3
            const shuffled = [...images].sort(() => 0.5 - Math.random());
            setSelectedImages(shuffled.slice(0, 3));
        }
    }, [isOpen, images]);

    if (!columns || columns.length === 0) return null;

    // Hardcoded default Unsplash images as fallbacks
    const defaultImages = [
        "https://images.unsplash.com/photo-1518998053574-53ee75313484?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1493333333333-333333333333?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800"
    ];

    return (
        <Popover.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* Hidden trigger to satisfy accessibility context */}
            <Popover.Trigger className="sr-only" />
            <Popover.Portal>
                <Popover.Positioner className="fixed top-[var(--header-height,100px)] left-0 w-full z-[90]">
                    <Popover.Popup
                        className="w-full bg-background-dark border-b border-white/10 shadow-2xl overflow-hidden outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 duration-300"
                        onMouseLeave={onClose}
                    >
                        <div className="container mx-auto px-6 py-12 md:px-12 flex flex-col md:flex-row gap-16">
                            {/* Left: Navigation Columns */}
                            <div className={cn(
                                "grid gap-12 flex-1",
                                columns.length === 1 ? "grid-cols-1 max-w-xs" :
                                    columns.length === 2 ? "grid-cols-2 max-w-2xl" :
                                        columns.length === 3 ? "grid-cols-3" :
                                            "grid-cols-4"
                            )}>
                                {columns.map((column, idx) => (
                                    <div key={idx} className="flex flex-col gap-6">
                                        {column.title && (
                                            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 border-b border-white/10 pb-2">
                                                {column.title}
                                            </h3>
                                        )}
                                        <ul className="flex flex-col gap-4">
                                            {(column.links || []).map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-lg font-bold text-white hover:text-ochre transition-colors group flex items-center gap-2"
                                                        onClick={onClose}
                                                    >
                                                        <span className="relative">
                                                            {link.label}
                                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ochre transition-all group-hover:w-full" />
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Right: Featured Images Section (Show for 'Visit' or similar top-level items) */}
                            <div className="w-full md:w-[45%] flex flex-col gap-6 mt-12 md:mt-0">
                                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 border-b border-white/10 pb-2">
                                    Visit NCAI
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[0, 1, 2].map((i) => {
                                        const imgAsset = selectedImages[i];
                                        const displayUrl = imgAsset 
                                            ? urlFor(imgAsset).width(400).height(500).url() 
                                            : defaultImages[i];
                                        
                                        return (
                                            <div key={i} className="group cursor-pointer relative">
                                                {imgAsset?.link ? (
                                                    <Link href={imgAsset.link} className="block relative aspect-[4/5] overflow-hidden rounded-none bg-stone-900 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                                                        <Image
                                                            src={displayUrl}
                                                            alt={`Featured ${i + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 100vw, 15vw"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                                                    </Link>
                                                ) : (
                                                    <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-stone-900 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                                                        <Image
                                                            src={displayUrl}
                                                            alt={`Featured ${i + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            sizes="(max-width: 768px) 100vw, 15vw"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                                                    </div>
                                                )}

                                                {/* Info Icon & Tooltip - Outside overflow-hidden */}
                                                {imgAsset?.caption && (
                                                    <div className="absolute bottom-3 right-3 z-30 pointer-events-auto">
                                                        <div className="group/info relative">
                                                            <button 
                                                                aria-label="Image Information"
                                                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/40 hover:scale-110 transition-all duration-300 shadow-lg"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Info size={18} />
                                                            </button>
                                                            
                                                            {/* Tooltip */}
                                                            <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-[250px] opacity-0 translate-y-2 group-hover/info:opacity-100 group-hover/info:translate-y-0 transition-all duration-300 z-40">
                                                                <div className="bg-background-dark/95 backdrop-blur-xl border border-white/10 p-4 text-xs text-white/90 leading-relaxed shadow-2xl">
                                                                    <div className="flex flex-col gap-2">
                                                                        <span className="text-[9px] uppercase tracking-widest text-ochre font-bold">Image Information</span>
                                                                        <p className="font-normal italic">
                                                                            {imgAsset?.caption && Array.isArray(imgAsset.caption) 
                                                                                ? (imgAsset.caption.find((c: any) => c._key === locale)?.value || imgAsset.caption[0]?.value)
                                                                                : imgAsset?.caption}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom strip for decorative element or quick info */}
                        <div className="bg-white/[0.02] border-t border-white/5 py-4 px-6 md:px-12">
                            <div className="container mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30 font-bold">
                                <span>Nairobi Contemporary Art Institute</span>
                                <Link href="/about" className="hover:text-ivory transition-colors">
                                    <span>East African Contemporary Art</span>
                                </Link>
                            </div>
                        </div>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}
