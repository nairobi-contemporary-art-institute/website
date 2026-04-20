'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MuseumCard } from './MuseumCard'
import { MuseumCardData } from '@/lib/types/museum-card'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface MuseumGridProps {
    items: MuseumCardData[];
    className?: string;
    filterPrefix?: string;
    showFilters?: boolean;
    gridColumns?: string;
    cardAspectRatio?: string;
    gridGap?: string;
}

export function MuseumGrid({ 
    items, 
    className, 
    filterPrefix = "CONTENT SUITABLE FOR:", 
    showFilters = true,
    gridColumns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cardAspectRatio = "aspect-square",
    gridGap = "gap-0"
}: MuseumGridProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Dynamically extract all unique tags from the dataset
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        items.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }, [items]);

    // Handle tag toggling
    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    // Filter items based on active tags (if empty, show all)
    const filteredItems = useMemo(() => {
        if (selectedTags.length === 0) return items;
        return items.filter(item => 
            item.tags && item.tags.some(tag => selectedTags.includes(tag))
        );
    }, [items, selectedTags]);

    const isAnySelected = selectedTags.length === 0;

    return (
        <div className={cn("w-full flex flex-col", className)}>
            {/* Filter Bar */}
            {showFilters && (
                <div className="bg-background-dark text-white py-4 px-6 md:px-8 border-b border-white/10 z-40">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs tracking-widest uppercase">
                        <span className="opacity-70 font-bold shrink-0">{filterPrefix}</span>
                        
                        <div className="flex flex-wrap items-center gap-6">
                            {/* 'Any' Option */}
                            <button 
                                onClick={() => setSelectedTags([])}
                                className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                            >
                                <div className={cn(
                                    "w-4 h-4 border flex items-center justify-center transition-colors",
                                    isAnySelected ? "bg-white border-white text-[#1a1a1a]" : "border-white/30 text-transparent"
                                )}>
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className={cn(isAnySelected ? "opacity-100" : "opacity-70")}>Any</span>
                            </button>

                            {/* Dynamic Tag Options */}
                            {allTags.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button 
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className="flex items-center gap-2 hover:opacity-100 transition-opacity"
                                    >
                                        <div className={cn(
                                            "w-4 h-4 border flex items-center justify-center transition-colors",
                                            isSelected ? "bg-white border-white text-[#1a1a1a]" : "border-white/30 text-transparent"
                                        )}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className={cn(isSelected ? "opacity-100" : "opacity-70")}>{tag}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Isotope Masonry Grid */}
            <motion.div 
                layout
                className={cn("grid w-full bg-background-dark", gridGap, gridColumns)}
            >
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            key={item.id}
                            className="w-full"
                        >
                            <MuseumCard data={item} aspectRatio={cardAspectRatio} priority={index < 2} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-24 text-center text-charcoal/50"
                    >
                        No content matches the selected filters.
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
