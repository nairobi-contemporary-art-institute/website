import { sanityFetch } from "@/sanity/lib/client"
import { ACCESSIBILITY_PAGE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { Metadata } from "next"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })

    const pageData = await sanityFetch<any>({
        query: ACCESSIBILITY_PAGE_QUERY,
        tags: ['accessibilityPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale) || t('description')

    return {
        title,
        description: typeof description === 'string' ? description : t('description'),
        openGraph: {
            title,
            description: typeof description === 'string' ? description : t('description'),
        }
    }
}

export default async function AccessibilityPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.accessibility' })

    const pageData = await sanityFetch<any>({
        query: ACCESSIBILITY_PAGE_QUERY,
        tags: ['accessibilityPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const header = pageData?.header
    const sections = pageData?.sections || []
    const venueGuide = pageData?.venueGuide
    const policies = pageData?.policies || []

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen bg-stone-50/20">
            <div className="max-w-5xl mx-auto">
                <header className="mb-24">
                    <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-charcoal mb-12">
                        {getLocalizedValue(header?.headline, locale) || title}
                    </h1>
                    <div className="max-w-2xl text-xl text-charcoal/70 leading-relaxed font-light">
                        {header?.description ? (
                            <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                        ) : (
                            <p>{t('intro')}</p>
                        )}
                    </div>
                    <div className="h-px w-24 bg-umber/30 mt-12" />
                </header>

                {/* Structured Sections from Sanity */}
                {sections.length > 0 ? (
                    <div className="grid gap-24 mb-32">
                        {sections.map((section: any, idx: number) => (
                            <section key={idx} className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
                                <div className="space-y-6">
                                    <h2 className="text-xs font-bold text-umber uppercase tracking-[0.3em] border-b border-umber/10 pb-4">
                                        {getLocalizedValue(section.title, locale)}
                                    </h2>
                                    {section.image && (
                                        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                                            <Image
                                                src={urlFor(section.image).width(600).url()}
                                                alt={getLocalizedValue(section.title, locale) || 'Access section'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="prose prose-lg prose-umber max-w-none pt-4">
                                    <PortableTextComponent value={getLocalizedValue(section.content, locale)} />
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    /* Existing Fallback UI */
                    <div className="space-y-24 mb-32">
                        <div className="grid md:grid-cols-2 gap-16">
                            <section className="space-y-8">
                                <h2 className="text-xs font-bold text-umber uppercase tracking-[0.3em] border-b border-umber/10 pb-4">Physical Access</h2>
                                <ul className="space-y-6">
                                    {[
                                        { l: "Entrance", v: "Ramped access is available at the main entrance." },
                                        { l: "Elevators", v: "All public levels are accessible via elevator." },
                                        { l: "Restrooms", v: "Accessible restrooms are located on the ground floor." },
                                        { l: "Seating", v: "Portable stools are available upon request at the front desk." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-6 items-start">
                                            <span className="font-bold text-charcoal min-w-[100px] text-sm uppercase tracking-wider">{item.l}</span>
                                            <span className="text-charcoal/80">{item.v}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-8">
                                <h2 className="text-xs font-bold text-umber uppercase tracking-[0.3em] border-b border-umber/10 pb-4">Sensory & Services</h2>
                                <ul className="space-y-6">
                                    {[
                                        { l: "Animals", v: "Service animals are welcome throughout the gallery." },
                                        { l: "Guides", v: "Large print exhibition guides are available at the reception." },
                                        { l: "Audio", v: "Audio descriptions are being developed for major exhibitions." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-6 items-start">
                                            <span className="font-bold text-charcoal min-w-[100px] text-sm uppercase tracking-wider">{item.l}</span>
                                            <span className="text-charcoal/80">{item.v}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                )}

                {/* Venue Guide Section */}
                {venueGuide && (
                    <section className="bg-charcoal text-off-white p-12 md:p-20 mb-32 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-light tracking-tight">
                                {getLocalizedValue(venueGuide.title, locale) || 'Venue Guide'}
                            </h2>
                            <p className="text-off-white/70 leading-relaxed">
                                {getLocalizedValue(venueGuide.description, locale)}
                            </p>
                            {venueGuide.guideUrl && (
                                <a
                                    href={venueGuide.guideUrl}
                                    target="_blank"
                                    className="inline-block px-8 py-4 border border-off-white/20 hover:bg-off-white hover:text-charcoal transition-all font-mono text-xs uppercase tracking-widest"
                                >
                                    Download Access Guide (PDF)
                                </a>
                            )}
                        </div>
                        {venueGuide.mapImage && (
                            <div className="relative aspect-square bg-white/5 border border-white/10 group overflow-hidden">
                                <Image
                                    src={urlFor(venueGuide.mapImage).width(800).url()}
                                    alt="Venue Map"
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </section>
                )}

                {/* Facility Policies from Sanity */}
                {policies.length > 0 && (
                    <section className="mb-32">
                        <h2 className="text-xs font-bold text-umber uppercase tracking-[0.3em] border-b border-umber/10 pb-8 mb-12">Facility Policies</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            {policies.map((policy: any, idx: number) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="font-bold text-lg text-charcoal">
                                        {getLocalizedValue(policy.policyName, locale)}
                                    </h3>
                                    <div className="text-charcoal/70 leading-relaxed text-sm">
                                        <PortableTextComponent value={getLocalizedValue(policy.description, locale)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Contact Footer */}
                <section className="bg-umber/5 p-12 text-center space-y-8 border border-umber/10">
                    <h2 className="text-xs font-bold text-umber uppercase tracking-[0.3em]">Contact Us</h2>
                    <p className="max-w-xl mx-auto text-charcoal/80 leading-relaxed">
                        For checking specific accessibility needs or to request accommodations, please contact us ensuring at least 48 hours notice for specific arrangements.
                    </p>
                    <a href="mailto:access@ncai.art" className="inline-block text-2xl font-light text-charcoal hover:text-ochre transition-colors underline decoration-1 underline-offset-[12px] decoration-umber/20">
                        access@ncai.art
                    </a>
                </section>
            </div>
        </div>
    )
}
