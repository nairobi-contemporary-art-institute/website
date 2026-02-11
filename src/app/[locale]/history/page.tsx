
import { type Metadata } from 'next'
import Image from 'next/image'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { TIMELINE_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'

import { TimelinePath } from '@/components/history/TimelinePath'

export const metadata: Metadata = {
    title: 'History & Timeline',
    description: 'The history and evolution of the Nairobi Contemporary Art Institute.',
}

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const timelineEvents = await client.fetch(TIMELINE_QUERY)
    const t = await getMessages({ locale }) as any

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <header className="max-w-4xl mx-auto mb-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-charcoal mb-6">
                    {t.Pages?.history?.title || 'Our History'}
                </h1>
                <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl mx-auto leading-relaxed">
                    {t.Pages?.history?.description || 'Tracing the journey of art in East Africa through the lens of NCAI.'}
                </p>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20 mt-12 mx-auto max-w-xs" />
            </header>

            <div className="max-w-5xl mx-auto relative">
                {/* Historical Curvilinear Path */}
                <TimelinePath className="left-4 md:left-1/2 -translate-x-1/2 md:translate-x-0 text-umber" />

                <div className="space-y-24">
                    {timelineEvents.map((event: any, index: number) => {
                        const title = getLocalizedValue(event.title, locale)
                        const description = getLocalizedValue(event.description, locale)
                        const isEven = index % 2 === 0

                        return (
                            <div key={event._id} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-charcoal rounded-full border-4 border-white shadow-sm -translate-x-1/2 md:translate-x-[0.5px] z-10 top-0 md:top-8" />

                                {/* Content Side */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                    <div className={`space-y-4 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                        <span className="inline-block text-5xl md:text-6xl font-bold text-umber/10 tracking-tighter">
                                            {event.year}
                                        </span>
                                        <h2 className="text-2xl font-bold text-charcoal">
                                            {title}
                                        </h2>
                                        <div className={`prose prose-umber prose-sm ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                                            <PortableText value={description} locale={locale} />
                                        </div>
                                    </div>
                                </div>

                                {/* Media Side */}
                                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                    {event.media && (
                                        <div className={`relative aspect-[3/2] bg-charcoal/5 rounded-sm overflow-hidden shadow-lg ${isEven ? 'md:origin-left' : 'md:origin-right'} hover:scale-[1.02] transition-transform duration-500`}>
                                            <Image
                                                src={urlFor(event.media).width(600).height(400).url()}
                                                alt={title || `Event in ${event.year}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {timelineEvents.length === 0 && (
                <div className="text-center py-20 text-umber/50">
                    <p>Timeline data coming soon.</p>
                </div>
            )}
        </div>
    )
}
