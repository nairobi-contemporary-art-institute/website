'use client'

import React from 'react'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { NewsletterSignup } from '@/components/layout/NewsletterSignup'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Book } from '@/components/ui/Book'

export function ComponentLibrary() {
    return (
        <div className="space-y-20">
            <header>
                <h2 className="text-xs font-bold text-deep-umber/40 capitalize tracking-[0.4em] mb-4">Section 05</h2>
                <h1 className="text-heading-72 text-charcoal mb-8">
                    Component library
                </h1>
                <p className="text-copy-16 text-deep-umber/80 leading-relaxed max-w-2xl">
                    Live UI components integrated directly from the NCAI codebase. These components are performance-optimized, accessible, and theme-aware.
                </p>
            </header>

            {/* Actions */}
            <section className="space-y-10">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-deep-umber/10 pb-4">Actions & Buttons</h3>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="px-8 py-3 bg-charcoal text-sun-bleached-paper text-[10px] font-bold capitalize tracking-[0.2em] hover:bg-deep-umber transition-colors">
                                Primary Action
                            </button>
                            <button className="px-8 py-3 border border-charcoal text-charcoal text-[10px] font-bold capitalize tracking-[0.2em] hover:bg-sun-bleached-paper hover:text-charcoal transition-all">
                                Outline Action
                            </button>
                        </div>
                        <p className="text-sm text-deep-umber/60 leading-relaxed">
                            Used for primary and secondary site interactions. Buttons use strict capitalisation and wide tracking to maintain authority.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <button className="text-[10px] font-bold text-rich-blue capitalize tracking-[0.2em] hover:text-deep-umber transition-colors underline underline-offset-4">
                            Link Action Style
                        </button>
                        <p className="text-sm text-deep-umber/60 leading-relaxed">
                            Used for inline text links or subtle metadata interactions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Immersive Elements */}
            <section className="space-y-10">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-deep-umber/10 pb-4">Immersive Media Components</h3>
                <div className="bg-sun-bleached-paper p-12 border border-deep-umber/5 overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-20 items-center justify-center">
                        <div className="space-y-4 text-center">
                            <Book title="Archives v1" color="#3F51B5" textColor="white" textured />
                            <span className="text-[9px] text-deep-umber/40 font-mono capitalize">Rich Blue / Textured</span>
                        </div>
                        <div className="space-y-4 text-center">
                            <Book title="NCAI Anthology" color="#CCA43B" textColor="charcoal" textured />
                            <span className="text-[9px] text-deep-umber/40 font-mono capitalize">Ochre / Textured</span>
                        </div>
                        <div className="space-y-4 text-center">
                            <Book title="Deep Imprints" color="#4A3B32" textColor="white" variant="simple" />
                            <span className="text-[9px] text-deep-umber/40 font-mono capitalize">Deep Umber / Simple</span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-deep-umber/60 leading-relaxed max-w-2xl">
                    The Book component uses CSS 3D transforms and nested gradients to simulate physical depth and archive texture. Used in the Publications section to highlight regional literature.
                </p>
            </section>

            {/* Dividers */}
            <section className="space-y-10">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-deep-umber/10 pb-4">Responsive Dividers</h3>
                <div className="space-y-12 bg-sun-bleached-paper p-8 border border-deep-umber/5">
                    <div className="space-y-4">
                        <span className="text-[10px] text-deep-umber/40 capitalize font-mono">variant="curved" weight="thin"</span>
                        <ResponsiveDivider variant="curved" weight="thin" className="text-deep-umber/20" />
                    </div>
                    <div className="space-y-4">
                        <span className="text-[10px] text-deep-umber/40 capitalize font-mono">variant="straight" weight="bold"</span>
                        <ResponsiveDivider variant="straight" weight="bold" className="text-ochre/30" />
                    </div>
                </div>
            </section>

            {/* Global Modules */}
            <section className="grid md:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-deep-umber/10 pb-4">Newsletter Hub</h3>
                    <div className="scale-90 origin-top-left">
                        <NewsletterSignup />
                    </div>
                </div>
                <div className="space-y-10">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-deep-umber/10 pb-4">Language Interaction</h3>
                    <div className="bg-sun-bleached-paper p-8 border border-deep-umber/5 inline-block">
                        <LanguageSwitcher />
                    </div>
                    <p className="text-sm text-deep-umber/60 leading-relaxed">
                        Multiscript switching logic. Supports all 10 institutional languages with automatic LTR/RTL font optimization.
                    </p>
                </div>
            </section>
        </div>
    )
}
