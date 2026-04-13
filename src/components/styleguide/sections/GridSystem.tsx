'use client';

import React from 'react';
import { Grid } from '@/components/ui/Grid/Grid';

export function GridSystem() {
    return (
        <div className="space-y-24 pb-24">
            <header>
                <h2 className="text-xs font-bold text-deep-umber/40 capitalize tracking-[0.4em] mb-4">Section 04</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Grid System
                </h1>
                <p className="text-lg text-deep-umber/80 italic leading-relaxed max-w-2xl">
                    A technical architectural grid system for precision alignment. Inspired by Geist, it provides systematic structure with visual guides.
                </p>
            </header>
            
            {/* 0. Page Sections & Padding */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-ochre pl-4 mb-2">Page Sections & Padding</h3>
                    <p className="text-xs text-deep-umber/60 italic">Standard spacing rules for major layout blocks.</p>
                </header>
                <div className="bg-white border border-deep-umber/10 p-6 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-ochre"></span>
                                <h4 className="text-[10px] font-bold capitalize tracking-widest text-charcoal">Global Section Padding</h4>
                                </div>
                                <p className="text-sm text-deep-umber/70 leading-relaxed pl-4 border-l border-ochre/20">
                                    Primary rule: Responsive fluid padding using a CSS clamp rule. This ensures a smooth transition between mobile and desktop without layout jumps.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 pl-4">
                                <div className="space-y-4">
                                    <span className="text-[9px] font-mono text-deep-umber/40 uppercase">Fluid Implementation</span>
                                    <div className="px-4 py-3 bg-ivory border border-deep-umber/10 rounded-sm">
                                        <code className="text-[10px] text-ochre font-bold block mb-2">
                                            clamp(1rem, 0.75rem + 1vw, 1.5rem)
                                        </code>
                                        <div className="flex justify-between items-center text-[9px] text-deep-umber/40 font-mono">
                                            <span>Min: 16px</span>
                                            <div className="h-0.5 flex-1 mx-4 bg-ochre/20 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ochre"></div>
                                            </div>
                                            <span>Max: 24px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-deep-umber/50 leading-relaxed pl-4 italic">
                                Use the class <code className="text-charcoal font-bold p-[p-section-clamp]">p-section-clamp</code> for consistent fluid spacing.
                            </p>
                        </div>

                        {/* Visual Mockup */}
                        <div className="relative aspect-video bg-ivory border border-deep-umber/5 overflow-hidden group">
                            {/* Desktop Padding Visualization */}
                            <div className="absolute inset-0 border-[clamp(12px,1.5vw,24px)] border-ochre/10 pointer-events-none z-10 transition-all duration-700"></div>
                            
                            {/* Grid/Guides representing the fluid zone */}
                            <div className="absolute top-0 left-0 w-full h-[clamp(12px,1.5vw,24px)] border-b border-ochre/20 dash-border"></div>
                            <div className="absolute bottom-0 left-0 w-full h-[clamp(12px,1.5vw,24px)] border-t border-ochre/20 dash-border"></div>
                            <div className="absolute top-0 left-0 w-[clamp(12px,1.5vw,24px)] h-full border-r border-ochre/20 dash-border"></div>
                            <div className="absolute top-0 right-0 w-[clamp(12px,1.5vw,24px)] h-full border-l border-ochre/20 dash-border"></div>
                            
                            {/* Inner Content Area */}
                            <div className="absolute inset-[clamp(12px,1.5vw,24px)] bg-white shadow-sm flex flex-col items-center justify-center gap-2">
                                <span className="text-[10px] font-bold text-ochre capitalize tracking-widest">Fluid Safe Zone</span>
                                <span className="text-[8px] text-ochre/40 font-mono">scaling...</span>
                            </div>

                            {/* Annotations */}
                            <div className="absolute top-[4px] left-1/2 -translate-x-1/2 text-[8px] font-bold text-ochre uppercase tracking-tighter bg-ivory px-1 whitespace-nowrap">
                                Variable Fluid Padding Rule
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. Breakpoints & Transitions */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-rich-blue pl-4 mb-2">Breakpoints & Transitions</h3>
                    <p className="text-xs text-deep-umber/60 italic">Standard responsive breakpoints for the NCAI ecosystem.</p>
                </header>
                <div className="bg-white border border-deep-umber/10 overflow-hidden">
                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-deep-umber/10">
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Mobile</span>
                                <span className="text-[9px] font-mono text-ochre">&lt; 768px</span>
                            </div>
                            <p className="text-xs text-deep-umber/70 leading-relaxed">
                                Single column focus. Sidebars collapse into drawers. Top-level navigation adopts the hamburger menu transition.
                            </p>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Tablet</span>
                                <span className="text-[9px] font-mono text-ochre">768px - 1024px</span>
                            </div>
                            <p className="text-xs text-deep-umber/70 leading-relaxed">
                                Content spreads to 2 columns. Sidebar remains hidden or compact. Grid gutters reduce to 16px.
                            </p>
                        </div>
                        <div className="p-8 space-y-4 bg-ivory/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Desktop</span>
                                <span className="text-[9px] font-mono text-ochre">1024px+</span>
                            </div>
                            <p className="text-xs text-deep-umber/70 leading-relaxed font-medium">
                                Full 12-column grid active. Standard section padding of 24px enforced across all layout modules.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Basic Grid */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-ochre pl-4 mb-2">Basic Grid</h3>
                    <p className="text-xs text-deep-umber/60 italic">A non-responsive single grid with auto flowing cells.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System>
                        <Grid columns={3} rows={2}>
                            <Grid.Cell className="text-[10px] font-mono">1</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono">2</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono">3</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono">4</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono">5</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono">6</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 3. Gaps */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-rich-blue pl-4 mb-2">Gaps</h3>
                    <p className="text-xs text-deep-umber/60 italic">Grid cells can have specific spacing while maintaining guide alignment.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System>
                        <Grid columns={6} rows={1} gap={20}>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                            <Grid.Cell className="bg-rich-blue/5 text-[10px] font-mono">Gap: 20</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 4. Solid */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-deep-umber pl-4 mb-2">Solid Cells</h3>
                    <p className="text-xs text-deep-umber/60 italic">Cells with the 'solid' prop cover the background guides.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System>
                        <Grid columns={3} rows={1}>
                            <Grid.Cell solid className="text-[10px] font-bold italic">Solid Cell</Grid.Cell>
                            <Grid.Cell className="text-[10px] font-mono text-charcoal/30">Transparent</Grid.Cell>
                            <Grid.Cell solid className="text-[10px] font-bold italic">Solid Cell</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 5. Solid Clipping */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-ochre pl-4 mb-2">Solid Clipping</h3>
                    <p className="text-xs text-deep-umber/60 italic">Advanced clipping where solid cells cover specific sections of the grid guides.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System>
                        <Grid columns={6} rows={2}>
                            <Grid.Cell column="span 2" row="span 2" solid className="text-[10px] font-bold">2x2 Solid</Grid.Cell>
                            <Grid.Cell>3</Grid.Cell>
                            <Grid.Cell>4</Grid.Cell>
                            <Grid.Cell column="5/7" row="1/3" solid className="text-[10px] font-bold">5+6 Solid</Grid.Cell>
                            <Grid.Cell>7</Grid.Cell>
                            <Grid.Cell>8</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 6. Rows and Columns */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-rich-blue pl-4 mb-2">Rows and Columns</h3>
                    <p className="text-xs text-deep-umber/60 italic">Responsive column and row definitions.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System>
                        <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
                            <Grid.Cell>1</Grid.Cell>
                            <Grid.Cell>2</Grid.Cell>
                            <Grid.Cell>3</Grid.Cell>
                            <Grid.Cell>4</Grid.Cell>
                            <Grid.Cell>5</Grid.Cell>
                            <Grid.Cell>6</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 7. Overlaying Cells */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-deep-umber pl-4 mb-2">Overlaying Cells</h3>
                    <p className="text-xs text-deep-umber/60 italic">Overlapping cells with Z-index management.</p>
                </header>
                <div className="bg-white border border-deep-umber/10 h-64">
                    <Grid.System>
                        <Grid columns={12} rows={12} height="100%">
                            <Grid.Cell column="1/5" row="1/5" solid className="bg-sun-bleached-paper shadow-lg">1/5</Grid.Cell>
                            <Grid.Cell column="4/8" row="4/8" className="bg-rich-blue/10 backdrop-blur-sm border border-rich-blue/20">4/8 Overlay</Grid.Cell>
                            <Grid.Cell column="7/12" row="7/12" solid className="bg-charcoal text-white">7/12</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 8. Hide Guides */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-ochre pl-4 mb-2">Hide Guides</h3>
                    <p className="text-xs text-deep-umber/60 italic">Toggle visibility of row or column guides.</p>
                </header>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border border-deep-umber/10 aspect-video">
                        <span className="text-[10px] font-mono p-2 block opacity-50">hideGuides="row"</span>
                        <Grid.System><Grid columns={12} rows={12} height="100%" hideGuides="row" /></Grid.System>
                    </div>
                    <div className="bg-white border border-deep-umber/10 aspect-video">
                        <span className="text-[10px] font-mono p-2 block opacity-50">hideGuides="column"</span>
                        <Grid.System><Grid columns={12} rows={12} height="100%" hideGuides="column" /></Grid.System>
                    </div>
                </div>
            </section>

            {/* 9. Preserve Aspect Ratio */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-rich-blue pl-4 mb-2">Preserve Aspect Ratio</h3>
                    <p className="text-xs text-deep-umber/60 italic">Maintains a consistent aspect ratio based on grid units.</p>
                </header>
                <div className="bg-white border border-deep-umber/10">
                    <Grid.System text-xs>
                        <Grid columns={16} rows={9} height="preserve-aspect-ratio">
                            <Grid.Cell column="1/17" row="1/10" className="text-xl font-bold italic opacity-20">16:9 Aspect</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>

            {/* 10. Debug Mode */}
            <section className="space-y-8">
                <header>
                    <h3 className="text-sm font-bold text-charcoal capitalize tracking-widest border-l-2 border-emerald-600 pl-4 mb-2">Debug Mode</h3>
                    <p className="text-xs text-deep-umber/60 italic">Visualize cell boundaries and grid structure during development.</p>
                </header>
                <div className="bg-white border border-deep-umber/10 mt-12">
                    <Grid.System debug>
                        <Grid columns={6} rows={1}>
                            <Grid.Cell>A</Grid.Cell>
                            <Grid.Cell>B</Grid.Cell>
                            <Grid.Cell>C</Grid.Cell>
                            <Grid.Cell>D</Grid.Cell>
                            <Grid.Cell>E</Grid.Cell>
                            <Grid.Cell>F</Grid.Cell>
                        </Grid>
                    </Grid.System>
                </div>
            </section>
        </div>
    );
}
