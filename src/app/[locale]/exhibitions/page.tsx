import { type Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, EXHIBITIONS_PAGE_QUERY } from '@/sanity/lib/queries'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { ExhibitionCard } from '@/components/exhibitions/ExhibitionCard'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { PortableTextComponent } from '@/components/ui/PortableText'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.exhibitions' })

    const pageData = await sanityFetch<any>({
        query: EXHIBITIONS_PAGE_QUERY,
        tags: ['exhibitionsPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const descriptionBlocks = getLocalizedValue<any>(pageData?.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    }
}

export default async function ExhibitionsPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Navigation' })
    const messages = await getMessages({ locale }) as any

    const [exhibitions, pageData] = await Promise.all([
        client.fetch(EXHIBITIONS_QUERY),
        sanityFetch<any>({ query: EXHIBITIONS_PAGE_QUERY, tags: ['exhibitionsPage'] })
    ])

    const now = new Date()

    const categorized = exhibitions.reduce((acc: any, exh: any) => {
        const start = new Date(exh.startDate)
        const end = exh.endDate ? new Date(exh.endDate) : null

        if (start > now) {
            acc.upcoming.push(exh)
        } else if (end && end < now) {
            acc.past.push(exh)
        } else {
            acc.current.push(exh)
        }
        return acc
    }, { current: [], upcoming: [], past: [] })

    const header = pageData?.header
    const headline = getLocalizedValue(header?.headline, locale) || t('exhibitions')

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-4xl mb-24 space-y-8">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-charcoal uppercase leading-[0.85]">
                    {headline}
                </h1>
                {header?.description && (
                    <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                        <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                    </div>
                )}
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <div className="space-y-32">
                {/* Current Exhibitions */}
                {categorized.current.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-umber/60">Current</h2>
                            <div className="h-px flex-1 bg-charcoal/10" />
                        </div>
                        <div className="grid gap-12">
                            {categorized.current.map((exh: any) => (
                                <ExhibitionCard key={exh._id} exhibition={exh} locale={locale} variant="featured" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Exhibitions */}
                {categorized.upcoming.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-umber/60">Upcoming</h2>
                            <div className="h-px flex-1 bg-charcoal/10" />
                        </div>
                        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {categorized.upcoming.map((exh: any) => (
                                <ExhibitionCard key={exh._id} exhibition={exh} locale={locale} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Past Exhibitions */}
                {categorized.past.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-umber/60">Past</h2>
                            <div className="h-px flex-1 bg-charcoal/10" />
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {categorized.past.map((exh: any) => (
                                <ExhibitionCard key={exh._id} exhibition={exh} locale={locale} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {exhibitions.length === 0 && (
                <div className="py-40 text-center text-umber/30 font-mono uppercase tracking-[0.3em] text-xs">
                    No exhibitions found.
                </div>
            )}
        </div>
    )
}
