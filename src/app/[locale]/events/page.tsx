import { client, sanityFetch } from "@/sanity/lib/client"
import { EVENTS_PAGE_QUERY, EVENTS_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from "@/sanity/lib/utils"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { Metadata } from "next"
import { MuseumCardData } from "@/lib/types/museum-card"
import { WhatsOnClient } from "@/components/whatson/WhatsOnClient"

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

    const title = getLocalizedValueAsString(pageData.title, locale) || 'Events'
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

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || 'Events'
    const description = getLocalizedValue(pageData?.header?.description, locale)

    const items: MuseumCardData[] = (events || []).map((event: any): MuseumCardData => {
        const tags = event.tags ? event.tags.map((t: any) => t.title) : []
        return {
            id: event._id || event.slug,
            href: `/events/${event.slug}`,
            label: event.eventType || 'Events',
            title: getLocalizedValueAsString(event.title, locale) || 'Untitled',
            date: event.startDate ? new Date(event.startDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            image: event.mainImage,
            tags: ['Events', ...tags],
            rawStartDate: event.startDate,
            rawEndDate: event.endDate,
            backgroundColor: '#301815'
        }
    })

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="container mx-auto px-section-clamp py-20 pb-12">
                <header className="max-w-4xl space-y-8">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-charcoal capitalize leading-[0.85]">
                        {title}
                    </h1>
                    {description && (
                        <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            <PortableTextComponent value={description} />
                        </div>
                    )}
                </header>
            </div>

            <WhatsOnClient 
                items={items} 
                locale={locale} 
                categories={["All", "Performances", "Screenings", "Events", "Talks"]}
                noticeBarSettings={pageData?.noticeBar}
            />
        </div>
    )
}
