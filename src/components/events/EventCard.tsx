import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface EventCardProps {
    event: any
    locale: string
    variant?: 'default' | 'compact'
}

export function EventCard({ event, locale, variant = 'default' }: EventCardProps) {
    const title = getLocalizedValue(event.title, locale)
    const date = new Date(event.startDate).toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
    const time = new Date(event.startDate).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    })

    if (variant === 'compact') {
        return (
            <Link
                href={`/${locale}/events/${event.slug}`}
                className="group flex flex-col gap-2 p-4 border border-transparent hover:border-umber/20 transition-colors"
            >
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono capitalize tracking-widest text-umber">
                        {event.eventType}
                    </span>
                    <span className={cn(
                        "text-xs px-2 py-0.5",
                        new Date(event.startDate) < new Date() ? "bg-stone-200 text-stone-600" : "bg-emerald-100 text-emerald-800"
                    )}>
                        {new Date(event.startDate) < new Date() ? 'Past' : 'Upcoming'}
                    </span>
                </div>
                <h3 className="text-lg font-medium leading-tight group-hover:text-umber transition-colors">
                    {title}
                </h3>
                <div className="text-sm text-charcoal/60 mt-auto">
                    {date} • {time}
                </div>
            </Link>
        )
    }

    return (
        <Link
            href={`/${locale}/events/${event.slug}`}
            className="group block space-y-4"
        >
            <div className="relative aspect-[3/2] bg-stone-100 overflow-hidden">
                {event.mainImage?.asset ? (
                    <Image
                        src={urlFor(event.mainImage).width(800).height(600).url()}
                        alt={event.mainImage.alt || title || 'Event'}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={event.mainImage.asset?.metadata?.lqip}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-umber/20 font-mono text-xs">
                        NO IMAGE
                    </div>
                )}
                <div className="absolute top-0 left-0 bg-white/90 backdrop-blur px-3 py-1 text-xs capitalize tracking-widest font-medium border-b border-r border-charcoal/10">
                    {event.eventType}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm font-mono text-umber">
                    <span>{date}</span>
                    <span className="w-1.5 h-1.5 bg-umber/40" />
                    <span>{time}</span>
                </div>

                <h3 className="text-2xl font-light tracking-tight group-hover:text-umber transition-colors">
                    {title}
                </h3>

                {event.location && (
                    <p className="text-sm text-charcoal/60 line-clamp-1">{event.location}</p>
                )}

                {event.tags && event.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2">
                        {event.tags.slice(0, 3).map((tag: any) => (
                            <span
                                key={tag._id}
                                className="text-[10px] capitalize tracking-widest text-charcoal/60 border border-charcoal/10 px-2 py-0.5"
                            >
                                {getLocalizedValue(tag.title, locale)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
