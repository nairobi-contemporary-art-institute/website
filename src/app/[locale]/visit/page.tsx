import { getTranslations, getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { VISIT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { MapFrame } from '@/components/ui/MapFrame'
import { LucideClock, LucideMapPin, LucidePhone, LucideMail, LucideInfo } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.visit.title,
    }
}

export default async function VisitPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.visit' })

    const [visitData, siteSettings] = await Promise.all([
        client.fetch(VISIT_PAGE_QUERY),
        client.fetch(SITE_SETTINGS_QUERY)
    ])

    const { hours, contactInfo } = siteSettings || {}
    const announcement = visitData?.announcement

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Header Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-end">
                {visitData?.heroImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={urlFor(visitData.heroImage).width(1920).height(1080).url()}
                            alt="Visit NCAI"
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    </div>
                )}

                <div className="container mx-auto px-6 pb-12 relative z-10">
                    <div className="max-w-4xl space-y-4">
                        {visitData?.label && (
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/90 bg-white/10 backdrop-blur-md px-4 py-1.5 inline-block border-l-2 border-white/40">
                                {getLocalizedValue(visitData.label, locale)}
                            </span>
                        )}
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white">
                            {getLocalizedValue(visitData?.title, locale) || t('title')}
                        </h1>
                        {visitData?.introText && (
                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl">
                                {getLocalizedValue(visitData.introText, locale)}
                            </p>
                        )}
                    </div>
                </div>

                {visitData?.heroImage?.caption && (
                    <div className="absolute bottom-6 right-6 hidden md:block">
                        <div className="text-[10px] uppercase tracking-widest text-white/50 bg-black/20 backdrop-blur-sm px-3 py-1">
                            <ArtCaption content={getLocalizedValue(visitData.heroImage.caption, locale)} />
                        </div>
                    </div>
                )}
            </section>

            {/* Announcement Banner */}
            {announcement?.show && (
                <div className="bg-amber-50 border-y border-amber-200 py-4 px-6">
                    <div className="container mx-auto flex items-start gap-4 text-amber-900">
                        <LucideInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-wider mb-1">
                                {getLocalizedValue(announcement.title, locale)}
                            </h3>
                            <p className="text-base opacity-90">
                                {getLocalizedValue(announcement.message, locale)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Navigation / Anchor Links */}
            <div className="sticky top-[var(--header-height,64px)] z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 py-4 overflow-x-auto scrollbar-hide">
                <div className="container mx-auto px-6">
                    <nav className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-charcoal/60">
                        <a href="#find-us" className="hover:text-charcoal transition-colors whitespace-nowrap">Find Us</a>
                        <a href="#directions" className="hover:text-charcoal transition-colors whitespace-nowrap">Directions</a>
                        <a href="#info" className="hover:text-charcoal transition-colors whitespace-nowrap">Information</a>
                        {visitData?.sections?.map((s: any, i: number) => (
                            <a
                                key={i}
                                href={`#section-${i}`}
                                className="hover:text-charcoal transition-colors whitespace-nowrap"
                            >
                                {getLocalizedValue(s.title, locale)}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <main className="container mx-auto px-6 py-20 space-y-32">

                {/* Find Us Section */}
                <section id="find-us" className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        <MapFrame className="aspect-[16/9] shadow-inner border border-black/5" />
                    </div>
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-amber-800">
                                <LucideMapPin className="w-5 h-5" />
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">{t('location') || 'Location'}</h2>
                            </div>
                            <div className="text-xl text-umber/90 leading-relaxed font-serif italic border-l-2 border-umber/10 pl-6">
                                <p className="font-bold text-charcoal not-italic font-sans mb-2">{contactInfo?.name || 'NCAI'}</p>
                                <p className="whitespace-pre-line">{contactInfo?.address}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-amber-800">
                                <LucideClock className="w-5 h-5" />
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em]">{t('hours') || 'Opening Hours'}</h2>
                            </div>
                            {siteSettings?.specialStatus?.isActive ? (
                                <div className="p-6 bg-charcoal text-white rounded-sm">
                                    <p className="text-lg font-light leading-relaxed">
                                        {getLocalizedValue(siteSettings.specialStatus.message, locale)}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 text-sm text-umber/80 border-t border-black/5 pt-4">
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                        const dayHours = hours?.[day as keyof typeof hours]
                                        return (
                                            <div key={day} className="flex justify-between items-center py-2 border-b border-black/5 last:border-0 hover:bg-black/[0.02] px-2 -mx-2 transition-colors">
                                                <span className="capitalize font-bold text-charcoal">{day}</span>
                                                <span className="font-light">
                                                    {dayHours?.open && dayHours?.close
                                                        ? `${dayHours.open} – ${dayHours.close}`
                                                        : <span className="text-umber/40 italic">Closed</span>}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-4">
                            <a href={`tel:${contactInfo?.phone}`} className="flex flex-col items-center justify-center p-4 border border-black/5 rounded-sm hover:bg-black/5 transition-colors text-charcoal grayscale">
                                <LucidePhone className="w-5 h-5 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Call Us</span>
                            </a>
                            <a href={`mailto:${contactInfo?.email}`} className="flex flex-col items-center justify-center p-4 border border-black/5 rounded-sm hover:bg-black/5 transition-colors text-charcoal grayscale">
                                <LucideMail className="w-5 h-5 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Email Us</span>
                            </a>
                        </div>
                    </div>
                </section>

                <ResponsiveDivider variant="wavy" weight="thin" className="text-charcoal/10" />

                {/* Directions Section */}
                {visitData?.directions && visitData.directions.length > 0 && (
                    <section id="directions" className="grid lg:grid-cols-12 gap-16">
                        <header className="lg:col-span-4">
                            <h2 className="text-5xl font-bold tracking-tighter text-charcoal mb-4">How to get here</h2>
                            <p className="text-lg text-umber/60 leading-relaxed font-light">
                                Nairobi Contemporary Art Institute is conveniently located in the Kuona Artists Collective.
                            </p>
                        </header>
                        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
                            {visitData.directions.map((d: any, i: number) => (
                                <div key={i} className="space-y-4 p-8 bg-charcoal/[0.02] border border-black/5 rounded-sm transition-transform hover:-translate-y-1">
                                    <h3 className="text-xl font-bold text-charcoal flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-800 rounded-full" />
                                        {getLocalizedValue(d.method, locale)}
                                    </h3>
                                    <div className="prose prose-sm prose-umber max-w-none prose-p:leading-relaxed">
                                        <PortableText value={getLocalizedValue(d.description, locale)} locale={locale} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Information Grid Section */}
                {visitData?.visitorCards && visitData.visitorCards.length > 0 && (
                    <section id="info" className="space-y-12">
                        <header className="max-w-3xl">
                            <h2 className="text-5xl font-bold tracking-tighter text-charcoal mb-4">Visitor Information</h2>
                            <p className="text-xl text-umber/60 leading-relaxed font-light">
                                Plan your visit with ease. Find details on admission, accessibility, and our guided tours.
                            </p>
                        </header>

                        <div className="grid md:grid-cols-3 gap-8">
                            {visitData.visitorCards.map((card: any, i: number) => (
                                <div key={i} className="group relative aspect-square p-8 bg-charcoal text-white flex flex-col justify-end overflow-hidden">
                                    {/* Decorative gradient overlay */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50" />

                                    <div className="relative z-10 space-y-4">
                                        <h3 className="text-3xl font-bold tracking-tight">{getLocalizedValue(card.title, locale)}</h3>
                                        <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                                            {getLocalizedValue(card.description, locale)}
                                        </p>
                                        {card.ctaUrl && (
                                            <Link
                                                href={card.ctaUrl}
                                                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:gap-4 transition-all pt-4"
                                            >
                                                {getLocalizedValue(card.ctaLabel, locale) || 'Learn More'}
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current">
                                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="1.5" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>

                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Flexible Sections */}
                <div className="space-y-32">
                    {visitData?.sections?.map((section: any, idx: number) => (
                        <section
                            key={idx}
                            id={`section-${idx}`}
                            className="grid lg:grid-cols-12 gap-16 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000"
                            style={{ transitionDelay: `${idx * 200}ms` }}
                        >
                            <div className="lg:col-span-4 space-y-6">
                                <h2 className="text-5xl font-bold tracking-tighter text-charcoal">
                                    {getLocalizedValue(section.title, locale)}
                                </h2>
                                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20" />
                            </div>

                            <div className="lg:col-span-8 space-y-12">
                                {section.image && (
                                    <div className="space-y-4">
                                        <div className="relative aspect-video overflow-hidden bg-charcoal/5 group">
                                            <Image
                                                src={urlFor(section.image).width(1200).height(675).url()}
                                                alt={getLocalizedValue(section.title, locale) || 'Visit section image'}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            {section.image.caption && (
                                                <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="text-[10px] uppercase tracking-widest text-white bg-black/40 backdrop-blur-md px-3 py-1">
                                                        <ArtCaption content={getLocalizedValue(section.image.caption, locale)} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="prose prose-xl prose-umber max-w-none font-light prose-p:leading-relaxed">
                                    <PortableText
                                        value={getLocalizedValue(section.content, locale)}
                                        locale={locale}
                                    />
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Keep In Touch / Footer CTA */}
                <section className="bg-charcoal text-white py-32 -mx-6 px-6">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 border-l-2 border-white/20 pl-4">Stay Connected</span>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Join the community</h2>
                        </div>
                        <div className="space-y-8">
                            <p className="text-xl text-white/70 font-light leading-relaxed">
                                Receive regular updates on our exhibitions, public programs, and publications.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-white/40 transition-colors"
                                />
                                <button className="bg-white text-charcoal px-8 py-4 font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
