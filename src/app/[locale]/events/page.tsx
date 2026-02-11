import { client } from "@/sanity/lib/client"
import { EVENTS_QUERY } from "@/sanity/lib/queries"
import { EventFilter } from "@/components/events/EventFilter"

// Ensure dynamic rendering
export const revalidate = 60

type Props = {
    params: Promise<{ locale: string }>
}

export default async function EventsPage({ params }: Props) {
    const { locale } = await params
    const events = await client.fetch(EVENTS_QUERY)

    // Separate upcoming and past logic is handled in the client filter for interactive switching,
    // but initially we pass all events.

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                    Events
                </h1>
                <div className="h-px w-24 bg-charcoal" />
            </header>

            <EventFilter events={events} locale={locale} />
        </div>
    )
}
