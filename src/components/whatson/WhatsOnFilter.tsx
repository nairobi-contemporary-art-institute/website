"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { X, ChevronDown } from "lucide-react"

export interface WhatsOnFilterProps {
    categories: string[]
    activeCategory: string
    onCategoryChange: (cat: string) => void
    tags: string[]
    activeTags: string[]
    onTagChange: (tag: string, checked: boolean) => void
    isCalendarOpen: boolean
    onCalendarToggle: () => void
}

export function WhatsOnFilter({
    categories,
    activeCategory,
    onCategoryChange,
    tags,
    activeTags,
    onTagChange,
    isCalendarOpen,
    onCalendarToggle
}: WhatsOnFilterProps) {
    return (
        <div className="bg-[#2A2A2A] text-white w-full">
            {/* Top Row: Event Type Selector */}
            <div className="">
                <div className="container py-0 flex items-center">
                    <div className="flex flex-wrap w-full md:w-fit border-l border-t border-[#333]">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat || (cat === 'All' && !activeCategory);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                                    className={cn(
                                        "px-4 md:px-6 py-3 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] transition-colors flex-grow md:flex-grow-0 border-r border-b border-[#333]",
                                        isActive 
                                            ? "bg-white text-black" 
                                            : "bg-[#2A2A2A] text-[#aaa] hover:bg-[#333] hover:text-white"
                                    )}
                                >
                                    {cat}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Filters (Container) + Calendar Toggle (Screen Edge) */}
            <div className="flex flex-col md:flex-row md:items-end w-full relative">
                
                {/* Left Side: Checkboxes - within container */}
                <div className="container py-6 md:pt-10 md:pb-8 flex-1">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-xs md:text-sm text-[#ccc] font-medium tracking-wide">
                        <span className="uppercase text-[10px] md:text-xs font-bold tracking-widest text-white mr-2">
                            Event suitable for:
                        </span>
                        {tags.map((tag) => {
                            const isChecked = activeTags.includes(tag);
                            return (
                                <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={cn(
                                        "w-4 h-4 border border-[#555] flex items-center justify-center transition-colors group-hover:border-white",
                                        isChecked ? "bg-white border-white" : "bg-[#333]"
                                    )}>
                                        {isChecked && <div className="w-2 h-2 bg-black" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="sr-only"
                                        checked={isChecked}
                                        onChange={(e) => onTagChange(tag, e.target.checked)}
                                    />
                                    <span className={cn(
                                        "transition-colors",
                                        isChecked ? "text-white" : "group-hover:text-white"
                                    )}>{tag}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-shrink-0 md:pb-0 h-full">
                    <button 
                        onClick={onCalendarToggle}
                        className="bg-black hover:bg-[#111] text-white border-l border-t border-[#333] px-8 h-[60px] md:h-[72px] flex items-center gap-8 font-bold text-xs uppercase tracking-[0.2em] transition-colors min-w-[200px] w-full md:w-auto justify-between"
                    >
                        <span>Calendar</span>
                        <div className="w-6 h-6 flex items-center justify-center relative">
                            {isCalendarOpen ? (
                                <X className="w-5 h-5 font-light" />
                            ) : (
                                <div className="relative w-4 h-4">
                                    <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-white -translate-y-1/2" />
                                    <div className="absolute left-1/2 top-0 h-4 w-[1px] bg-white -translate-x-1/2" />
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
