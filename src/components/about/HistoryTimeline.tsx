'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { TimelinePath } from '@/components/history/TimelinePath'
import { GridRoot as Grid, Cell as GridCell } from "@/components/ui/Grid/Grid"

interface TimelineEvent {
    _id: string
    year: number | string
    title: any
    description: any
    media: any
}

interface HistoryTimelineProps {
    events: TimelineEvent[]
    locale: string
}

const MOCK_EVENTS = [
    {
        _id: 'mock-1',
        year: '2020',
        title: [
            { _key: 'en', value: 'Foundation of NCAI' },
            { _key: 'sw', value: 'Kuanzishwa kwa NCAI' },
            { _key: 'ar', value: 'تأسيس NCAI' }
        ],
        description: [
            {
                _key: 'en', value: [
                    {
                        _type: 'block',
                        _key: 'b1',
                        children: [{ _type: 'span', _key: 's1', text: 'The Nairobi Contemporary Art Institute (NCAI) was founded as a non-profit contemporary art institution.' }],
                        markDefs: [],
                        style: 'normal'
                    }
                ]
            },
            {
                _key: 'sw', value: [
                    {
                        _type: 'block',
                        _key: 'b1s',
                        children: [{ _type: 'span', _key: 's1s', text: 'Taasisi ya Sanaa ya Kisasa ya Nairobi (NCAI) ilianzishwa kama taasisi ya sanaa isiyo ya faida.' }],
                        markDefs: [],
                        style: 'normal'
                    }
                ]
            }
        ],
        media: null,
    },
    {
        _id: 'mock-2',
        year: '2022',
        title: [
            { _key: 'en', value: 'Opening Exhibition' },
            { _key: 'sw', value: 'Maonyesho ya Kwanza' },
            { _key: 'ar', value: 'المعرض الافتتاحي' }
        ],
        description: [
            {
                _key: 'en', value: [
                    {
                        _type: 'block',
                        _key: 'b2',
                        children: [{ _type: 'span', _key: 's2', text: 'NCAI opened its physical space in Nairobi with a landmark exhibition of contemporary practice.' }],
                        markDefs: [],
                        style: 'normal'
                    }
                ]
            }
        ],
        media: null,
    },
    {
        _id: 'mock-3',
        year: '2024',
        title: [
            { _key: 'en', value: 'Digital Wing Launch' },
            { _key: 'sw', value: 'Uzinduzi wa Digital Wing' },
            { _key: 'ar', value: 'إطلاق الجناح الرقمي' }
        ],
        description: [
            {
                _key: 'en', value: [
                    {
                        _type: 'block',
                        _key: 'b3',
                        children: [{ _type: 'span', _key: 's3', text: 'Launch of the immersive digital timeline and archival platform.' }],
                        markDefs: [],
                        style: 'normal'
                    }
                ]
            }
        ],
        media: null,
    }
]

export function HistoryTimeline({ events: initialEvents, locale }: HistoryTimelineProps) {
    const events = initialEvents && initialEvents.length > 0 ? initialEvents : MOCK_EVENTS

    return (
        <div className="relative py-12">
            <div className="max-w-5xl mx-auto relative group">
                {/* Historical Curvilinear Path */}
                <TimelinePath className="left-4 md:left-1/2 -translate-x-1/2 md:translate-x-0 text-umber/40 group-hover:text-amber-500/60 transition-colors duration-1000" />

                <div className="space-y-32">
                    {events.map((event, index) => {
                        const title = getLocalizedValue(event.title, locale)
                        const description = getLocalizedValue(event.description, locale)
                        const isEven = index % 2 === 0

                        return (
                            <div
                                key={event._id}
                                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-charcoal border-2 border-ivory shadow-sm -translate-x-1/2 md:translate-x-[-1px] z-10 top-0 md:top-12 group-hover:bg-amber-500 group-hover:scale-125 transition-all duration-500" />

                                {/* Content Side */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                    <div className={`space-y-4 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                        <span className="inline-block text-6xl md:text-8xl font-black text-umber/5 tracking-tighter leading-none">
                                            {event.year}
                                        </span>
                                        <div className="-mt-6 md:-mt-10 relative z-10">
                                            <h3 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight capitalize">
                                                {title}
                                            </h3>
                                            {description && (
                                                <div className={`prose prose-sm md:prose-base max-w-md text-charcoal/70 mt-4 ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                                                    <PortableText value={description} locale={locale} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Media Side */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                    {event.media && (
                                        <div className={`relative aspect-[4/3] bg-charcoal/5 overflow-hidden shadow-2xl rounded-sm ${isEven ? 'md:origin-left' : 'md:origin-right'} hover:scale-[1.05] transition-all duration-700 group/item`}>
                                            <Image
                                                src={urlFor(event.media).width(800).height(600).url()}
                                                alt={title || `Event in ${event.year}`}
                                                fill
                                                className="object-cover grayscale group-hover/item:grayscale-0 transition-all duration-1000"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            <div className="absolute inset-0 bg-charcoal/10 group-hover/item:bg-transparent transition-colors duration-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
