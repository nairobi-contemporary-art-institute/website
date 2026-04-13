import React from 'react'
import { getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, EVENTS_QUERY, PROGRAMS_QUERY, EVENTS_PAGE_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { MuseumCardData } from '@/lib/types/museum-card'
import { WhatsOnClient } from '@/components/whatson/WhatsOnClient'

export default async function WhatsOnPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'WhatsOn' }) // Will need to define/fallback this

    const [exhibitions, events, programs, pageData] = await Promise.all([
        sanityFetch<any[]>({ query: EXHIBITIONS_QUERY, tags: ['exhibition'] }),
        sanityFetch<any[]>({ query: EVENTS_QUERY, tags: ['event'] }),
        sanityFetch<any[]>({ query: PROGRAMS_QUERY, tags: ['program'] }),
        sanityFetch<any>({ query: EVENTS_PAGE_QUERY, tags: ['eventsPage'] })
    ])

    // Normalize everything down to MuseumCardData
    const items: MuseumCardData[] = [
        ...(exhibitions || []).map((exh: any): MuseumCardData => ({
            id: exh._id || exh.slug,
            href: `/exhibitions/${exh.slug}`,
            label: 'Exhibitions',
            title: getLocalizedValue(exh.title, locale) || 'Untitled',
            date: exh.startDate ? new Date(exh.startDate).getFullYear().toString() : '',
            image: exh.listImage || exh.homepageImage || exh.mainImage,
            tags: ['Exhibitions'],
            rawStartDate: exh.startDate,
            rawEndDate: exh.endDate,
            backgroundColor: '#1a1a1a'
        })),
        ...(events || []).map((event: any): MuseumCardData => {
            // Check if events have tags associated with them for filtering
            const tags = event.tags ? event.tags.map((t: any) => t.title) : []
            return {
                id: event._id || event.slug,
                href: `/events/${event.slug}`,
                label: event.eventType || 'Events',
                title: getLocalizedValue(event.title, locale) || 'Untitled',
                date: event.startDate ? new Date(event.startDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                image: event.mainImage,
                tags: ['Events', ...tags],
                rawStartDate: event.startDate,
                rawEndDate: event.endDate,
                backgroundColor: '#301815'
            }
        }),
        ...(programs || []).map((prog: any): MuseumCardData => {
            const tags = prog.tags ? prog.tags.map((t: any) => t.title) : []
            return {
                id: prog._id || prog.slug,
                href: `/education/${prog.slug}`,
                label: prog.programType || 'Workshops',
                title: getLocalizedValue(prog.title, locale) || 'Untitled',
                date: prog.startDate ? new Date(prog.startDate).toLocaleDateString(locale, { month: 'short', year: 'numeric' }) : '',
                image: prog.mainImage,
                tags: ['Workshops', ...tags],
                rawStartDate: prog.startDate,
                rawEndDate: prog.endDate,
                backgroundColor: '#1E293B'
            }
        })
    ]

    return (
        <main className="min-h-screen bg-stone-50">
            {/* Minimal Header could go here, but Filter starts sticky typically */}
            <div className="bg-black w-full border-b border-[#333]">
                <div className="text-ivory py-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">What's On</h1>
                </div>
            </div>

            {/* Client Component integrating Filters, Calendar, Grid */}
            <WhatsOnClient 
                items={items} 
                locale={locale} 
                noticeBarSettings={pageData?.noticeBar}
            />
        </main>
    )
}
