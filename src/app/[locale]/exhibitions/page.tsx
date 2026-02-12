import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY } from '@/sanity/lib/queries'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { ExhibitionCard } from '@/components/exhibitions/ExhibitionCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.exhibitions?.title || 'Exhibitions',
    }
}

export default async function ExhibitionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getMessages({ locale }) as any
    const exhibitions = await client.fetch(EXHIBITIONS_QUERY)

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

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-3xl mb-16">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal mb-8 uppercase leading-[0.9]">
                    {t.Navigation?.exhibitions || 'Exhibitions'}
                </h1>
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
                <div className="py-20 text-center text-umber/40 italic">
                    No exhibitions found.
                </div>
            )}
        </div>
    )
}
