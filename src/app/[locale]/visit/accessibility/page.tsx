import { sanityFetch } from "@/sanity/lib/client"
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { getTranslations } from "next-intl/server"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })
    return {
        title: t('title'),
        description: t('description')
    }
}

export default async function AccessibilityPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })

    // Try to fetch from Sanity
    const page = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug: 'accessibility' },
        tags: ['page:accessibility']
    })

    const title = page ? getLocalizedValue(page.title, locale) : t('title')
    const body = page ? page.body : null

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen bg-off-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-charcoal mb-8">
                        {title}
                    </h1>
                    <div className="h-px w-24 bg-umber/30" />
                </header>

                {body ? (
                    <PortableTextComponent value={getLocalizedValue(body, locale)} />
                ) : (
                    <div className="space-y-16 text-lg text-charcoal/80 leading-relaxed">
                        <section>
                            <h2 className="text-xs font-bold text-umber uppercase tracking-widest mb-6">Our Commitment</h2>
                            <p className="max-w-2xl">
                                {t('intro')}
                            </p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-12">
                            <section>
                                <h2 className="text-xs font-bold text-umber uppercase tracking-widest mb-6 border-b border-umber/20 pb-2 inline-block">Physical Access</h2>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Entrance</span>
                                        <span>Ramped access is available at the main entrance.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Elevators</span>
                                        <span>All public levels are accessible via elevator.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Restrooms</span>
                                        <span>Accessible restrooms are located on the ground floor.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Seating</span>
                                        <span>Portable stools are available upon request at the front desk.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xs font-bold text-umber uppercase tracking-widest mb-6 border-b border-umber/20 pb-2 inline-block">Sensory & Services</h2>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Service Animals</span>
                                        <span>Service animals are welcome throughout the gallery.</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <span className="font-bold text-charcoal min-w-[120px]">Large Print</span>
                                        <span>Large print exhibition guides are available at the reception.</span>
                                    </li>
                                </ul>
                            </section>
                        </div>

                        <section className="bg-stone-100 p-8 rounded-sm">
                            <h2 className="text-xs font-bold text-umber uppercase tracking-widest mb-4">Contact Us</h2>
                            <p className="mb-4">
                                For checking specific accessibility needs or to request accommodations, please contact us ensuring at least 48 hours notice for specific arrangements.
                            </p>
                            <a href="mailto:access@ncai.art" className="text-charcoal font-bold hover:text-ochre transition-colors underline decoration-1 underline-offset-4">
                                access@ncai.art
                            </a>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
