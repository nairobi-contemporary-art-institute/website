import { client } from '@/sanity/lib/client'
import { TIMELINE_QUERY } from '@/sanity/lib/queries'
import { ImmersiveTimeline } from '@/components/timeline/ImmersiveTimeline'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Digital Wing | Immersive Art History',
    description: 'An immersive journey through the artistic heritage and evolution of East Africa.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function TimelinePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params

    // Fetch events, prioritizing those tagged as "immersive" or just everything for now
    const events = await client.fetch(TIMELINE_QUERY)

    return (
        <main className="min-h-screen bg-charcoal">
            <ImmersiveTimeline events={events} locale={locale} />
        </main>
    )
}
