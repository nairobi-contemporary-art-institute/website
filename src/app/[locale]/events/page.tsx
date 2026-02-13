import { client, sanityFetch } from "@/sanity/lib/client"
import { EVENTS_PAGE_QUERY, EVENTS_QUERY } from "@/sanity/lib/queries"
import { EventFilter } from "@/components/events/EventFilter"
import { getLocalizedValue, portableTextToPlainText } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { Metadata } from "next"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const pageData = await sanityFetch<any>({ query: EVENTS_PAGE_QUERY, tags: ['eventsPage'] })

    if (!pageData) {
        return {
            title: 'Events',
            description: 'Upcoming and past events at Nairobi Contemporary Art Institute.'
        }
    }

    const title = getLocalizedValue(pageData.title, locale) || 'Events'
    const descriptionBlocks = getLocalizedValue<any>(pageData.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : 'Events at NCAI')

    return {
        title,
        description
    }
}

export default async function EventsPage({ params }: Props) {
    const { locale } = await params

    const [pageData, events] = await Promise.all([
        sanityFetch<any>({ query: EVENTS_PAGE_QUERY, tags: ['eventsPage'] }),
        sanityFetch<any[]>({ query: EVENTS_QUERY, tags: ['event'] })
    ])

    const title = getLocalizedValue(pageData?.header?.headline, locale) || getLocalizedValue(pageData?.title, locale) || 'Events'
    const description = getLocalizedValue(pageData?.header?.description, locale)

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                    {title}
                </h1>
                {description && (
                    <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed mb-12">
                        <PortableText value={description} locale={locale} />
                    </div>
                )}
                <div className="h-px w-24 bg-charcoal" />
            </header>

            <EventFilter events={events} locale={locale} />
        </div>
    )
}
