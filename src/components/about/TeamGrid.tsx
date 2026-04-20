'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { X, Plus, ChevronDown } from 'lucide-react'

interface Person {
    _id: string
    name: any
    slug: string
    roles?: string[]
    category?: 'staff' | 'contributor'
    image?: any
    bio?: any
}

interface TeamGridProps {
    people: Person[]
    locale: string
}

export function TeamGrid({ people, locale }: TeamGridProps) {
    const t = useTranslations('Pages.about.teamFilters')
    const tc = useTranslations('Pages.about.teamCategories')
    const [activeFilter, setActiveFilter] = useState('all')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    const categories = [
        { id: 'all', label: t('all') },
        { id: 'curatorial', label: t('curator') },
        { id: 'education', label: t('education') },
        { id: 'administration', label: t('administration') },
        { id: 'press', label: t('press') }
    ]

    const filteredPeople = useMemo(() => {
        if (activeFilter === 'all') return people
        return people.filter(person => 
            person.roles?.some(role => role.toLowerCase().includes(activeFilter.toLowerCase()))
        )
    }, [people, activeFilter])

    const staffMembers = useMemo(() => filteredPeople.filter(p => !p.category || p.category === 'staff'), [filteredPeople])
    const contributors = useMemo(() => filteredPeople.filter(p => p.category === 'contributor'), [filteredPeople])

    useEffect(() => {
        if (gridRef.current) {
            gsap.fromTo(".person-card", 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            )
        }

        const hash = window.location.hash.replace('#', '')
        if (hash) {
            const person = people.find(p => p.slug === hash)
            if (person) {
                setExpandedId(person._id)
                setTimeout(() => {
                    const el = document.getElementById(`person-${person._id}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 500)
            }
        }
    }, [activeFilter, people])

    if (!people || people.length === 0) return null

    const renderPerson = (person: Person) => {
        const name = getLocalizedValue(person.name, locale)
        const bio = getLocalizedValue(person.bio, locale)
        const isExpanded = expandedId === person._id

        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={person._id}
                id={`person-${person._id}`}
                className={`person-card group transition-all duration-700 ${
                    isExpanded 
                    ? 'lg:col-span-2 flex flex-col md:flex-row items-start gap-12 bg-white p-8 md:p-12 border border-charcoal/5 shadow-2xl relative z-10' 
                    : 'space-y-6'
                }`}
            >
                <div className={`relative aspect-[4/5] overflow-hidden bg-charcoal/5 group-hover:shadow-2xl transition-all duration-700 shrink-0 ${
                    isExpanded ? 'w-full md:w-[380px]' : 'w-full'
                }`}>
                    {person.image ? (
                        <Image
                            src={urlFor(person.image).width(800).height(1000).url()}
                            alt={name || 'Team Member'}
                            fill
                            className="object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-charcoal/10 font-black text-9xl capitalize transform -rotate-12">
                            NCAI
                        </div>
                    )}
                    
                    {!isExpanded && bio && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(person._id);
                            }}
                            className="absolute bottom-6 right-6 w-12 h-12 bg-ivory/90 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className={`space-y-6 ${isExpanded ? 'flex-1 md:pt-4' : ''}`}>
                    {isExpanded && (
                        <button 
                            onClick={() => setExpandedId(null)}
                            className="absolute top-8 right-8 text-charcoal/40 hover:text-umber transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="space-y-2">
                        <h3 className={`${isExpanded ? 'text-4xl md:text-5xl' : 'text-2xl'} font-bold text-charcoal tracking-tight group-hover:text-umber transition-colors`}>
                            {name}
                        </h3>
                        {person.roles && person.roles.length > 0 && (
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-umber/60 leading-relaxed">
                                {person.roles.join(' / ')}
                            </p>
                        )}
                    </div>

                    {bio && (
                        <div className={`prose prose-sm text-charcoal/70 transition-all duration-500 overflow-hidden ${isExpanded ? 'max-w-xl opacity-100' : 'line-clamp-3 opacity-80'}`}>
                            <PortableText value={bio} locale={locale} />
                        </div>
                    )}

                    {isExpanded && (
                        <div className="pt-8 border-t border-charcoal/5">
                            <button 
                                onClick={() => setExpandedId(null)}
                                className="text-[10px] font-mono uppercase tracking-[0.2em] text-umber hover:gap-3 transition-all flex items-center gap-2"
                            >
                                Close Details <ChevronDown className="w-3 h-3 rotate-180" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-24">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 border-b border-charcoal/5 pb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveFilter(cat.id)
                            setExpandedId(null)
                        }}
                        className={`px-6 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                            activeFilter === cat.id 
                            ? 'bg-umber text-ivory border-umber shadow-lg' 
                            : 'bg-transparent text-charcoal/40 border-charcoal/10 hover:border-umber/40'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Sections */}
            <div ref={gridRef} className="space-y-32">
                {/* Staff Section */}
                {staffMembers.length > 0 && (
                    <div className="space-y-12">
                        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-charcoal/30 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-charcoal/10" />
                            {tc('staff')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            <AnimatePresence mode="popLayout">
                                {staffMembers.map(renderPerson)}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Contributors Section */}
                {contributors.length > 0 && (
                    <div className="space-y-12">
                        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-charcoal/30 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-charcoal/10" />
                            {tc('contributors')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            <AnimatePresence mode="popLayout">
                                {contributors.map(renderPerson)}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
