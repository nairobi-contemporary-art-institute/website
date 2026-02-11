import { client } from "@/sanity/lib/client"
import { EVENT_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PortableText } from "@/components/ui/PortableText"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Ensure dynamic rendering
export const revalidate = 60

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export default async function EventPage({ params }: Props) {
    const { locale, slug } = await params
    const event = await client.fetch(EVENT_BY_SLUG_QUERY, { slug })

    if (!event) {
        notFound()
    }

    const title = getLocalizedValue(event.title, locale)
    const description = getLocalizedValue(event.description, locale) || []

    const startDate = new Date(event.startDate)
    const endDate = event.endDate ? new Date(event.endDate) : null

    const formattedDate = startDate.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const formattedTime = startDate.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    })

    const isPast = new Date() > (endDate || startDate)

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen bg-stone-50/30">
            <Link
                href={`/${locale}/events`}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-umber hover:text-charcoal mb-12 transition-colors"
            >
                ← Back to Calendar
            </Link>

            <div className="max-w-6xl mx-auto">
                <header className="mb-16 border-b border-charcoal/10 pb-12">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-widest text-umber mb-6">
                        <span className="px-2 py-1 bg-umber/10 rounded-sm">{event.eventType}</span>
                        {isPast && <span className="px-2 py-1 bg-stone-200 text-stone-500 rounded-sm">Archived</span>}
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-charcoal mb-8 leading-[0.9]">
                        {title}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-lg text-charcoal/80">
                        <div className="flex items-start gap-4">
                            <span className="font-mono text-xs uppercase tracking-widest text-umber mt-1.5 w-16">When</span>
                            <div>
                                <p className="font-medium">{formattedDate}</p>
                                <p className="text-charcoal/60">{formattedTime} {endDate && `- ${endDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`}</p>
                            </div>
                        </div>
                        {event.location && (
                            <div className="flex items-start gap-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-umber mt-1.5 w-16">Where</span>
                                <p className="font-medium max-w-xs">{event.location}</p>
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24">
                    {/* Main Content */}
                    <article className="space-y-12">
                        {event.mainImage && (
                            <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden">
                                <Image
                                    src={urlFor(event.mainImage).width(1200).height(900).url()}
                                    alt={event.mainImage.alt || title || 'Event Image'}
                                    fill
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL={event.mainImage.asset?.metadata?.lqip}
                                    priority
                                />
                            </div>
                        )}

                        <PortableText value={description} />
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-12 lg:pt-0">
                        {/* RSVP Actions */}
                        {!isPast && event.registrationLink && (
                            <div className="bg-white p-8 border border-charcoal/5 shadow-sm space-y-4 sticky top-32">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-charcoal/60">Registration</h3>
                                <p className="text-sm text-charcoal/80 mb-4">
                                    Space is limited for this event. Please register in advance.
                                </p>
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 bg-charcoal text-off-white text-center font-medium tracking-wide hover:bg-umber transition-colors"
                                >
                                    RSVP Now
                                </a>
                            </div>
                        )}

                        {/* Facilitators */}
                        {event.educators && event.educators.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-umber border-b border-umber/20 pb-2">Facilitators</h3>
                                <div className="space-y-6">
                                    {event.educators.map((person: any) => (
                                        <div key={person._id} className="flex items-center gap-4 group">
                                            {person.image && (
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                                    <Image
                                                        src={urlFor(person.image).width(100).height(100).url()}
                                                        alt={getLocalizedValue(person.name, locale) || 'Facilitator'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-charcoal">{getLocalizedValue(person.name, locale)}</p>
                                                {person.roles && (
                                                    <p className="text-xs text-charcoal/60">{person.roles.join(', ')}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Exhibitions */}
                        {event.relatedExhibitions && event.relatedExhibitions.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-umber border-b border-umber/20 pb-2">In Context of</h3>
                                <div className="space-y-6">
                                    {event.relatedExhibitions.map((exhibition: any) => {
                                        const exTitle = getLocalizedValue(exhibition.title, locale)
                                        return (
                                            <Link
                                                key={exhibition._id}
                                                href={`/${locale}/exhibitions/${exhibition.slug}`}
                                                className="block group"
                                            >
                                                {exhibition.mainImage && (
                                                    <div className="relative aspect-video mb-3 overflow-hidden bg-stone-100">
                                                        <Image
                                                            src={urlFor(exhibition.mainImage).width(600).height(400).url()}
                                                            alt={exTitle || 'Exhibition'}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                                                        />
                                                    </div>
                                                )}
                                                <h4 className="font-bold group-hover:text-umber transition-colors">
                                                    {exTitle}
                                                </h4>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}
