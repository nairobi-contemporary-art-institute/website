'use client'

import React from 'react'
import { Lock, Check } from 'lucide-react'

export function DesignDevWorkflow() {
    return (
        <div className="space-y-24">
            <header>
                <h2 className="text-xs font-bold text-umber/40 capitalize tracking-[0.4em] mb-4">Section 14</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-charcoal capitalize tracking-tighter mb-8">
                    Design/Dev Workflow
                </h1>
                <p className="text-lg text-umber/80 leading-relaxed max-w-2xl">
                    A strict, formalized Standard Operating Procedure (SOP) for taking a product from design specification to production-ready Next.js deployment.
                </p>
            </header>

            {/* 01 & 02: Specification & Architecture */}
            <div className="grid lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">01. Design Specification Intake</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Objective</h4>
                            <p className="text-sm text-umber/80">Convert design artifacts into an unambiguous engineering contract.</p>
                            
                            <div className="space-y-2 pt-4">
                                <span className="text-[10px] font-bold text-ochre uppercase tracking-widest">Inputs</span>
                                <ul className="text-xs text-umber/60 space-y-1 list-disc pl-4">
                                    <li>Figma / high-fidelity design files</li>
                                    <li>Product Requirements Document (PRD)</li>
                                    <li>User stories / Acceptance criteria</li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-umber/10">
                                <div className="bg-white/50 p-4 border border-umber/5">
                                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest block mb-2">Gate: Approval Required</span>
                                    <p className="text-[10px] text-umber/60 italic">Design + Engineering sign-off that spec is complete and testable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">02. Technical Architecture Definition</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Objective</h4>
                            <p className="text-sm text-umber/80">Lock in system structure before coding begins.</p>
                            
                            <div className="space-y-2 pt-4">
                                <span className="text-[10px] font-bold text-ochre uppercase tracking-widest">Decisions</span>
                                <ul className="text-xs text-umber/60 space-y-1 list-disc pl-4">
                                    <li>Next.js App Router (Server Components focus)</li>
                                    <li>Tailwind CSS v4 + Vanilla CSS Modules</li>
                                    <li>Sanity CMS data layer (GROQ queries)</li>
                                    <li>Rendering: SSR / ISR / Static hybrid</li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-umber/10">
                                <div className="bg-white/50 p-4 border border-umber/5">
                                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-2 mb-1 text-ochre">
                                        <Lock className="w-2.5 h-2.5" />
                                        Architecture Gate
                                    </span>
                                    <p className="text-[10px] text-umber/60 italic">Tech lead approval on scalability and maintainability.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 03 & 04: Initialization & Design System */}
            <div className="grid lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">03. Project Initialization</h3>
                    <div className="bg-charcoal p-8 rounded-sm h-full text-ivory/80">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-ivory uppercase tracking-widest">Objective</h4>
                            <p className="text-sm leading-relaxed">Create a standardized, reproducible project base with strict environmental parity.</p>
                            
                            <div className="family-mono text-[10px] space-y-2 bg-black/20 p-4 rounded border border-white/5">
                                <div>/app (Routes)</div>
                                <div>/components (Feature-led)</div>
                                <div>/lib (Utilities & GSAP)</div>
                                <div>/sanity (Schemas & Queries)</div>
                                <div>/types (Strict TS Definitions)</div>
                            </div>

                            <p className="text-[10px] italic pt-4">Lint + build must pass before any feature work starts.</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">04. Design System Implementation</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Objective</h4>
                            <p className="text-sm text-umber/80">Translate design tokens into reusable UI primitives.</p>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-ochre" />
                                    <span className="text-[10px] font-bold text-charcoal tracking-widest uppercase">WCAG Accessibility</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-ochre" />
                                    <span className="text-[10px] font-bold text-charcoal tracking-widest uppercase">Pixel Parity Tolerance</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-ochre" />
                                    <span className="text-[10px] font-bold text-charcoal tracking-widest uppercase">Responsive Primitives</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-umber/10">
                                <p className="text-[10px] text-umber/60 italic">Gate: Visual parity with design + accessibility audit pass.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 05 & 06: Feature Dev & QA */}
            <div className="grid lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">05. Feature Development</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Process</h4>
                            <ul className="text-xs text-umber/60 space-y-3 list-none">
                                <li className="pl-4 border-l border-ochre">1. Create branch (<code className="bg-umber/5 px-1 font-bold">feature/name</code>)</li>
                                <li className="pl-4 border-l border-ochre">2. Implement UI, Logic, and API integration</li>
                                <li className="pl-4 border-l border-ochre">3. Add Unit and Integration tests</li>
                            </ul>
                            <div className="pt-4 border-t border-umber/10">
                                <span className="text-[10px] font-bold text-charcoal uppercase tracking-widest block mb-1 mt-2">PR Review Standards</span>
                                <p className="text-[10px] text-umber/60 italic">Strict typing (no 'any'), code quality review, and design compliance.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">06. Testing & QA</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Requirements</h4>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-3 bg-white border border-umber/5">
                                    <div className="text-[10px] font-bold text-ochre mb-1 uppercase">Unit</div>
                                    <div className="text-[9px] text-umber/60 uppercase">Functions & Hooks</div>
                                </div>
                                <div className="p-3 bg-white border border-umber/5">
                                    <div className="text-[10px] font-bold text-ochre mb-1 uppercase">E2E</div>
                                    <div className="text-[9px] text-umber/60 uppercase">Full User Flows</div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-umber/10">
                                <p className="text-[10px] text-umber/60 italic">Gate: CI must pass all tests with 0 critical bugs open.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 07 & 08: Optimization & Deployment */}
            <div className="grid lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">07. Performance Optimization</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Critical Web Vitals</h4>
                            <div className="space-y-4 mt-6">
                                <div className="flex justify-between items-baseline border-b border-umber/5 pb-2">
                                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-[0.2em]">LCP / CLS</span>
                                    <span className="text-[10px] text-umber/40 uppercase">Optimized via Next/Image</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-umber/5 pb-2">
                                    <span className="text-[10px] font-bold text-charcoal uppercase tracking-[0.2em]">Bundle Analysis</span>
                                    <span className="text-[10px] text-umber/40 uppercase">Code Splitting & Lazy Loading</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-umber/10">
                                <p className="text-[10px] text-umber/60 italic font-medium">Gate: Performance thresholds met (defined in project SLA).</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">08. Deployment Pipeline</h3>
                    <div className="bg-charcoal p-8 rounded-sm h-full text-ivory/80">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-ivory uppercase tracking-widest">Automated CD</h4>
                            <ul className="text-[10px] space-y-2 uppercase tracking-widest list-none">
                                <li className="flex gap-2"><span className="text-ochre">→</span> Push to main</li>
                                <li className="flex gap-2"><span className="text-ochre">→</span> CI (Lint / Test / Build)</li>
                                <li className="flex gap-2"><span className="text-ochre">→</span> Deploy Preview</li>
                                <li className="flex gap-2"><span className="text-ochre">→</span> Production Deploy</li>
                            </ul>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[10px] text-ivory/40 italic">Gate: Successful build + healthy verification signals.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 09 & 10: Verification & Maintenance */}
            <div className="grid lg:grid-cols-2 gap-12 pb-24">
                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">09. Post-Deployment Verification</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Production Check</h4>
                            <div className="space-y-4 pt-4 border-t border-umber/10">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <span>Smoke Tests (Routing/API)</span>
                                    <Check className="w-3 h-3 text-green-600" />
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <span>Error Monitoring (Sentry)</span>
                                    <Check className="w-3 h-3 text-green-600" />
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                    <span>Analytics Validation</span>
                                    <Check className="w-3 h-3 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest border-b border-umber/10 pb-2 inline-block">10. Maintenance & Iteration</h3>
                    <div className="bg-ivory border border-umber/10 p-8 rounded-sm h-full">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest">Lifecycle Management</h4>
                            <p className="text-sm text-umber/80 leading-relaxed">
                                Continuous preservation of institutional standards through versioning, refactoring, and performance sustainment.
                            </p>
                            <div className="grid grid-cols-1 gap-2 pt-4 border-t border-umber/10 text-[9px] uppercase font-bold tracking-[0.2em] text-umber/40">
                                <div>SemVer Compliance</div>
                                <div>Dependency Lifecycle</div>
                                <div>Retrospective Cycles</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Enforcement Principles */}
            <section className="bg-charcoal text-white p-12 rounded-sm border border-white/5 space-y-12">
                <header className="border-b border-white/10 pb-8 text-center max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold tracking-tighter italic">Enforcement Principles</h2>
                    <p className="text-xs text-ivory/40 uppercase tracking-widest mt-2">The Non-Negotiable Contract</p>
                </header>

                <div className="grid md:grid-cols-4 gap-12 text-center items-start">
                    <div className="space-y-4">
                        <div className="text-2xl font-black text-ochre">01</div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">No Spec — No Code</h4>
                        <p className="text-[10px] text-ivory/50 italic px-4 leading-relaxed">Engineering cannot proceed without an approved design contract.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-2xl font-black text-ochre">02</div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">No Tests — No Merge</h4>
                        <p className="text-[10px] text-ivory/50 italic px-4 leading-relaxed">Every feature must include unit and integration coverage.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-2xl font-black text-ochre">03</div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">No CI Pass — No Deploy</h4>
                        <p className="text-[10px] text-ivory/50 italic px-4 leading-relaxed">The automated pipeline is the ultimate gatekeeper of quality.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-2xl font-black text-ochre">04</div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Authority Control</h4>
                        <p className="text-[10px] text-ivory/50 italic px-4 leading-relaxed">Design tokens and API contracts are the single source of truth.</p>
                    </div>
                </div>

                <div className="pt-12 text-center border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
                        Design → Spec → Architecture → Setup → Components → Features → Tests → Optimize → Deploy → Monitor
                    </span>
                </div>
            </section>
        </div>
    )
}
