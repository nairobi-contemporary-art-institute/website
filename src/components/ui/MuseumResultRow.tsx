import React from 'react'
import { MuseumCardData } from '@/lib/types/museum-card'
import { MuseumGrid } from './MuseumGrid'
import { cn } from '@/lib/utils'

interface MuseumResultRowProps {
    title: string;
    items: MuseumCardData[];
    className?: string;
}

export function MuseumResultRow({ title, items, className }: MuseumResultRowProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn("w-full py-12", className)}>
            <div className="container mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#1a1a1a]/10 pb-4 gap-4">
                    <h2 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#1a1a1a]">
                        {title}
                    </h2>
                    <span className="text-sm md:text-base text-[#1a1a1a]/60 font-medium shrink-0">
                        {items.length} {items.length === 1 ? 'result' : 'results'}
                    </span>
                </div>
            </div>
            
            <div className="container">
                <MuseumGrid 
                    items={items} 
                    showFilters={false}
                    gridColumns="grid-cols-1 min-[501px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1291px]:grid-cols-4"
                    cardAspectRatio="aspect-[3/4]"
                    gridGap="gap-4"
                />
            </div>
        </div>
    )
}
