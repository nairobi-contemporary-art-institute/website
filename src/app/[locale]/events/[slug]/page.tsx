import { client } from "@/sanity/lib/client"
import { EVENT_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PortableText } from "@/components/ui/PortableText"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

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
    const description = getLocalizedValue(event.description, locale)

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm uppercase tracking-widest text-umber">
                        <span>{event.eventType}</span>
                        <span>•</span>
                        <span>{formatDate(event.startDate)}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-charcoal mb-8">
                        {title}
                    </h1>
                    {event.location && (
                        <p className="text-xl text-gray-600">{event.location}</p>
                    )}
                </header>

                <div className="grid md:grid-cols-[2fr_1fr] gap-16">
                    <div className="space-y-12">
                        {event.mainImage && (
                            <div className="relative aspect-video bg-off-white overflow-hidden rounded-sm">
                                <Image
                                    src={urlFor(event.mainImage).width(1200).height(800).url()}
                                    alt={event.mainImage.alt || title || 'Event Image'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        <section className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                            <PortableText value={description} locale={locale} />
                        </section>
                    </div>

                    <aside className="space-y-12">
                        <div className="bg-off-white p-8 rounded-sm space-y-6">
                            <h3 className="text-lg font-bold uppercase tracking-widest">Details</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="block text-gray-500 uppercase text-xs mb-1">Date & Time</span>
                                    <p>{formatDate(event.startDate)}</p>
                                    {event.endDate && <p>to {formatDate(event.endDate)}</p>}
                                </div>
                                {event.location && (
                                    <div>
                                        <span className="block text-gray-500 uppercase text-xs mb-1">Location</span>
                                        <p>{event.location}</p>
                                    </div>
                                )}
                            </div>

                            {event.registrationLink && (
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-6 bg-charcoal text-white text-center font-bold tracking-wide hover:bg-indigo-600 transition-colors"
                                >
                                    RSVP / Register
                                </a>
                            )}
                        </div>

                        {event.educators && event.educators.length > 0 && (
                            <div className="space-y-6 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Facilitators</h3>
                                <div className="space-y-4">
                                    {event.educators.map((person: any) => (
                                        <div key={person._id} className="flex items-center gap-3">
                                            {person.image && (
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <Image
                                                        src={urlFor(person.image).width(100).height(100).url()}
                                                        alt={getLocalizedValue(person.name, locale) || 'Facilitator'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm text-charcoal">{getLocalizedValue(person.name, locale)}</p>
                                                {person.roles && (
                                                    <p className="text-xs text-gray-500">{person.roles.join(', ')}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.tags && event.tags.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Related Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag: any) => (
                                        <span key={tag._id} className="px-2 py-1 bg-amber-50 text-amber-900/70 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                                            {getLocalizedValue(tag.title, locale)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.relatedExhibitions && event.relatedExhibitions.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Related Exhibitions</h3>
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
                                                    <div className="relative aspect-[3/2] mb-3 overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={urlFor(exhibition.mainImage).width(400).height(300).url()}
                                                            alt={exTitle || 'Exhibition'}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                )}
                                                <h4 className="font-bold group-hover:text-indigo-600 transition-colors">
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
