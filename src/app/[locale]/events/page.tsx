import { client } from "@/sanity/lib/client"
import { EVENTS_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"

// Placeholder for date formatting if not exists
const formatDateLocal = (dateString: string, locale: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Ensure dynamic rendering
export const revalidate = 60

type Props = {
    params: Promise<{ locale: string }>
}

export default async function EventsPage({ params }: Props) {
    const { locale } = await params
    const events = await client.fetch(EVENTS_QUERY)

    // Separate upcoming and past events
    const now = new Date()
    const upcomingEvents = events.filter((e: any) => new Date(e.endDate || e.startDate) >= now)
    const pastEvents = events.filter((e: any) => new Date(e.endDate || e.startDate) < now).reverse() // Most recent past first

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                    Events
                </h1>
                <div className="h-px w-24 bg-charcoal" />
            </header>

            <section className="mb-32">
                <h2 className="text-2xl font-medium mb-12">Upcoming</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {upcomingEvents.map((event: any) => {
                            const title = getLocalizedValue(event.title, locale)
                            return (
                                <Link
                                    key={event._id}
                                    href={`/${locale}/events/${event.slug}`}
                                    className="group block"
                                >
                                    <div className="relative aspect-[4/3] bg-off-white mb-6 overflow-hidden">
                                        {event.mainImage && (
                                            <Image
                                                src={urlFor(event.mainImage).width(800).height(600).url()}
                                                alt={event.mainImage.alt || title || 'Event'}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-widest">
                                            {event.eventType}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm text-umber">
                                            <span>{formatDateLocal(event.startDate, locale)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-charcoal group-hover:text-indigo-600 transition-colors">
                                            {title}
                                        </h3>
                                        {event.location && (
                                            <p className="text-sm text-gray-500">{event.location}</p>
                                        )}
                                        {event.tags && event.tags.length > 0 && (
                                            <div className="flex gap-2 flex-wrap pt-2">
                                                {event.tags.slice(0, 3).map((tag: any) => (
                                                    <span key={tag._id || Math.random()} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                                                        {getLocalizedValue(tag.title, locale)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No upcoming events scheduled.</p>
                )}
            </section>

            <section>
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-2xl font-medium">Past</h2>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {pastEvents.map((event: any) => {
                        const title = getLocalizedValue(event.title, locale)
                        return (
                            <Link
                                key={event._id}
                                href={`/${locale}/events/${event.slug}`}
                                className="group block opacity-70 hover:opacity-100 transition-opacity"
                            >
                                <div className="space-y-2">
                                    <div className="text-xs text-umber uppercase tracking-widest">
                                        {event.eventType}
                                    </div>
                                    <h3 className="text-lg font-bold text-charcoal group-hover:text-indigo-600 transition-colors">
                                        {title}
                                    </h3>
                                    <div className="text-sm text-gray-500">
                                        <span>{formatDateLocal(event.startDate, locale)}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
