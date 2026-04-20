import { sanityFetch } from '@/sanity/lib/client'
import { TIMELINE_QUERY } from '@/sanity/lib/queries'
import { TimelineTeaser } from './TimelineTeaser'

interface TimelineTeaserBlockProps {
    value: {
        show?: boolean
        headline?: any
    }
    locale: string
}

export async function TimelineTeaserBlock({ value, locale }: TimelineTeaserBlockProps) {
    if (value.show === false) return null

    // Fetch the timeline events directly in the block component
    const events = await sanityFetch<any[]>({ 
        query: TIMELINE_QUERY, 
        tags: ['timelineEvent'] 
    })

    return (
        <TimelineTeaser 
            events={events} 
            locale={locale} 
            headline={value.headline} 
        />
    )
}
