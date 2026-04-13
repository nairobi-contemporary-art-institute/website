'use client'

import React from 'react'

export function MediaGuidelines() {
    return (
        <div className="space-y-16">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 08</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Media Guidelines
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    Standards for handling imagery, video, and rich content to ensure maximum performance without compromising visual fidelity.
                </p>
            </header>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Image Architecture</h3>
                <div className="bg-ivory border border-umber/10 p-8 space-y-6">
                    <p className="text-sm text-umber/80 leading-relaxed">
                        All images are managed through Sanity's robust CDN, ensuring proper delivery of modern formats (WebP/AVIF) based on browser support.
                    </p>
                    <div className="bg-charcoal text-ivory/80 p-6 font-mono text-xs mt-4 space-y-4">
                        <div className="border-l-2 border-ochre pl-4">
                            <strong className="text-white block mb-1">Image Builder Utility</strong>
                            <span className="text-white/50 block">`src/sanity/lib/image.ts`</span>
                            <p className="mt-2 text-umber/40">
                                Uses `@sanity/image-url` to construct optimized URLs dynamically.
                            </p>
                            <p className="mt-2 text-ochre/80">
                                urlFor(source).auto('format').fit('max')
                            </p>
                        </div>
                        <div className="border-l-2 border-umber/20 pl-4">
                            <strong className="text-white block mb-1">Next.js `&lt;Image /&gt;` Component</strong>
                            <p className="mt-2 text-umber/40">
                                We always pair Sanity's builder with the `next/image` component to leverage automated layout shifting prevention and lazy loading.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">Artwork Specifications</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-charcoal">Fidelity</h4>
                        <p className="text-xs text-umber/60 leading-relaxed">
                            Images of artworks must prioritize accurate color profiles (sRGB) over aggressive artifact-introducing compression. 
                            Sanity's `fit('clip')` should be utilized to maintain aspect ratios accurately instead of generic cropping.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-charcoal">Alt Text & Accessibility</h4>
                        <p className="text-xs text-umber/60 leading-relaxed">
                            All decorative images receive `alt=""`. For artworks, the Sanity schema mandates a distinct alternative text string. If none is provided, it falls back to dynamically describing the title and author.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
