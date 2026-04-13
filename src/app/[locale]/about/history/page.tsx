import { sanityFetch } from "@/sanity/lib/client"
import { ABOUT_PAGE_QUERY, TIMELINE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { GridSystem } from "@/components/ui/Grid/Grid"
import { HistoryTimeline } from "@/components/about/HistoryTimeline"
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.about' })

    return {
        title: `${locale === 'en' ? 'Our History' : 'Historia Yetu'} | NCAI`,
        description: 'Discover the journey and milestones of the Nairobi Contemporary Art Institute.',
    }
}

export default async function HistoryPage({ params }: Props) {
    const { locale } = await params
    const [aboutData, timelineEvents] = await Promise.all([
        sanityFetch<any>({ query: ABOUT_PAGE_QUERY, tags: ["aboutPage"] }),
        sanityFetch<any[]>({ query: TIMELINE_QUERY, tags: ["timelineEvent"] })
    ])

    const historySection = aboutData?.sections?.find((s: any) =>
        getLocalizedValue(s.title, locale)?.toLowerCase().includes('history') ||
        s.layout === 'history-timeline'
    )

    const title = getLocalizedValue(historySection?.title, locale) || (locale === 'en' ? 'Our History' : 'Historia Yetu')
    const description = getLocalizedValue(historySection?.content, locale)

    return (
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-24 min-h-screen bg-ivory">
                <header className="mb-20 max-w-4xl">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9] mb-8">
                        {title}
                    </h1>
                    {description && (
                        <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            {/* Simple text or portable text if needed, but HistoryTimeline has its own headers usually */}
                        </div>
                    )}
                </header>

                <HistoryTimeline events={timelineEvents} locale={locale} />
            </main>
        </GridSystem>
    )
}
