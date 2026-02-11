'use client'

import React from 'react'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { NewsletterSignup } from '@/components/layout/NewsletterSignup'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function ComponentLibrary() {
    return (
        <div className="space-y-20">
            <header>
                <h2 className="text-xs font-bold text-umber/40 uppercase tracking-[0.4em] mb-4">Section 05</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal uppercase tracking-tighter mb-8">
                    Component library
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Live UI components integrated directly from the NCAI codebase. These components are performance-optimized, accessible, and theme-aware.
                </p>
            </header>

            {/* Actions */}
            <section className="space-y-10">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-4">Actions & Buttons</h3>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="px-8 py-3 bg-charcoal text-ivory text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-umber transition-colors">
                                Primary Action
                            </button>
                            <button className="px-8 py-3 border border-charcoal text-charcoal text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-charcoal hover:text-ivory transition-all">
                                Outline Action
                            </button>
                        </div>
                        <p className="text-sm text-umber/60 leading-relaxed">
                            Used for primary and secondary site interactions. Buttons use strict capitalisation and wide tracking to maintain authority.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <button className="text-[10px] font-bold text-indigo uppercase tracking-[0.2em] hover:text-umber transition-colors underline underline-offset-4">
                            Link Action Style
                        </button>
                        <p className="text-sm text-umber/60 leading-relaxed">
                            Used for inline text links or subtle metadata interactions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Dividers */}
            <section className="space-y-10">
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-4">Responsive Dividers</h3>
                <div className="space-y-12 bg-ivory p-8 border border-umber/5">
                    <div className="space-y-4">
                        <span className="text-[10px] text-umber/40 uppercase font-mono">variant="curved" weight="thin"</span>
                        <ResponsiveDivider variant="curved" weight="thin" className="text-umber/20" />
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] text-umber/40 uppercase font-mono">variant="straight" weight="bold"</span>
                        <ResponsiveDivider variant="straight" weight="bold" className="text-ochre/30" />
                    </div>
                </div>
            </section>

            {/* Global Modules */}
            <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-4">Newsletter Hub</h3>
                    <div className="scale-90 origin-top-left">
                        <NewsletterSignup />
                    </div>
                </div>
                <div className="space-y-10">
                    <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest border-b border-umber/10 pb-4">Language Interaction</h3>
                    <div className="bg-ivory p-8 border border-umber/5 inline-block">
                        <LanguageSwitcher />
                    </div>
                    <p className="text-sm text-umber/60 leading-relaxed">
                        Multiscript switching logic. Supports all 10 institutional languages with automatic LTR/RTL font optimization.
                    </p>
                </div>
            </section>
        </div>
    )
}
