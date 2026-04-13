import { getTranslations, getMessages } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import { VISIT_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { HeroIMMA } from '@/components/ui/HeroIMMA'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { PortableText } from '@/components/ui/PortableText'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { MapFrame } from '@/components/ui/MapFrame'
import { LucideClock, LucideMapPin, LucidePhone, LucideMail, LucideInfo, LucideBus, LucideCar, LucideTrainFront } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArtTooltip } from '@/components/ui/ArtTooltip'

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
        sanityFetch<any>({ query: VISIT_PAGE_QUERY, tags: ['visitPage'] }),
        sanityFetch<any>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
    ])

    const { hours, contactInfo } = siteSettings || {}
    const announcement = visitData?.announcement
    const finalHeroImage = visitData?.heroImage
    const finalHeroCaption = visitData?.heroImage?.caption ? getLocalizedValueAsString(visitData.heroImage.caption, locale) : undefined

    return (
        <>
            {/* Hero Header Section */}
            <HeroIMMA 
                title={getLocalizedValueAsString(visitData?.title, locale) || t('title')}
                headline={getLocalizedValueAsString(visitData?.label, locale)}
                intro={getLocalizedValueAsString(visitData?.introText, locale)}
                caption={finalHeroCaption}
                image={finalHeroImage}
            />

            {/* Announcement Banner */}
            {announcement?.show && (
                <div className="bg-amber-50 border-y border-amber-200 py-4 px-section-clamp">
                    <div className="container mx-auto flex items-start gap-4 text-amber-900">
                        <LucideInfo className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-sm capitalize tracking-wider mb-1">
                                {getLocalizedValue(announcement.title, locale)}
                            </h3>
                            <p className="text-base opacity-90">
                                {getLocalizedValue(announcement.message, locale)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Sidebar & Main Content Wrapper */}
            <div className="container mx-auto px-section-clamp py-20 pt-8 lg:pt-20">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    
                    {/* Mobile Navigation (Horizontal Scroll) */}
                    <div className="lg:hidden col-span-12 -mx-section-clamp px-section-clamp overflow-x-auto scrollbar-hide pb-4 mb-4 border-b border-black/5">
                        <nav className="flex flex-nowrap items-center gap-6 text-[11px] font-bold capitalize tracking-widest text-charcoal/60">
                            <a href="#overview" className="hover:text-charcoal transition-colors whitespace-nowrap">{t('overviewLink') || 'Overview'}</a>
                            <a href="#opening-hours" className="hover:text-charcoal transition-colors whitespace-nowrap">{t('hours') || 'Opening Hours'}</a>
                            <a href="#directions-map" className="hover:text-charcoal transition-colors whitespace-nowrap">{t('directionsMapLink') || 'Directions & Map'}</a>
                            {visitData?.visitorCards && visitData.visitorCards.length > 0 && (
                                <a href="#info" className="hover:text-charcoal transition-colors whitespace-nowrap">{t('infoLink')}</a>
                            )}
                            {visitData?.sections?.map((s: any, i: number) => {
                                const title = getLocalizedValue(s.title, locale);
                                const slug = title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                return (
                                    <a
                                        key={i}
                                        href={`#${slug || `section-${i}`}`}
                                        className="hover:text-charcoal transition-colors whitespace-nowrap"
                                    >
                                        {title}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Desktop Navigation (Sticky Left Sidebar) */}
                    <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-[calc(var(--header-height,64px)+2rem)] space-y-8 pr-8">
                        <nav className="flex flex-col gap-4 text-xs font-bold capitalize tracking-widest text-charcoal/60">
                            <a href="#overview" className="hover:text-charcoal transition-colors py-2 border-b border-black/5">{t('overviewLink') || 'Overview'}</a>
                            <a href="#opening-hours" className="hover:text-charcoal transition-colors py-2 border-b border-black/5">{t('hours') || 'Opening Hours'}</a>
                            <a href="#directions-map" className="hover:text-charcoal transition-colors py-2 border-b border-black/5">{t('directionsMapLink') || 'Directions & Map'}</a>
                            {visitData?.visitorCards && visitData.visitorCards.length > 0 && (
                                <a href="#info" className="hover:text-charcoal transition-colors py-2 border-b border-black/5">{t('infoLink')}</a>
                            )}
                            {visitData?.sections?.map((s: any, i: number) => {
                                const title = getLocalizedValue(s.title, locale);
                                const slug = title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                return (
                                    <a
                                        key={i}
                                        href={`#${slug || `section-${i}`}`}
                                        className="hover:text-charcoal transition-colors py-2 border-b border-black/5"
                                    >
                                        {title}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content Column */}
                    <div className="col-span-12 lg:col-span-9 space-y-24 lg:space-y-32 overflow-visible">

                {/* Overview Anchor */}
                <div id="overview" className="scroll-mt-[120px]" />

                {/* Opening Hours Section */}
                <section id="opening-hours" className="grid lg:grid-cols-[1fr_2px_2.5fr] gap-12 lg:gap-24 items-start scroll-mt-[120px]">
                    <div className="pt-2">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal text-charcoal tracking-tighter capitalize leading-[0.9] lg:max-w-[320px]">
                                {visitData?.title ? getLocalizedValue(visitData.title, locale) : (locale === 'en' ? 'Admission & Hours' : 'Saa za Kufungua')}
                            </h2>
                        </div>
                    </div>

                    <div className="hidden lg:block h-full py-4">
                        <div className="w-[1px] h-full bg-black/10 mx-auto" />
                    </div>

                    <div className="space-y-16">
                        {visitData?.introText && (
                            <div className="prose prose-xl prose-umber max-w-none font-light prose-p:leading-relaxed">
                                <PortableText 
                                    value={getLocalizedValue(visitData.introText, locale)} 
                                />
                            </div>
                        )}

                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal/40">
                                    {t('normalOpeningHours')}
                                </h3>
                                <div className="h-px flex-1 bg-black/5" />
                            </div>

                            {siteSettings?.specialStatus?.isActive ? (
                                <div className="p-10 bg-charcoal text-white rounded-sm border border-black/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
                                    <div className="flex items-start gap-6 relative z-10">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                            <LucideClock className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div className="space-y-3">
                                             <p className="text-2xl font-normal leading-tight tracking-tight">
                                                {getLocalizedValue(siteSettings.specialStatus.message, locale)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {/* Primary Hours Card */}
                                    <div className="p-10 bg-[#FDFBF7] border border-black/5 rounded-sm space-y-8 shadow-sm">
                                        <div className="flex justify-between items-end border-b border-black/5 pb-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Galleries</h4>
                                            <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">Today</span>
                                        </div>
                                        <div className="space-y-4">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                const dayHours = hours?.[day as keyof typeof hours];
                                                const isClosed = !dayHours?.open || !dayHours.close;
                                                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                                                
                                                return (
                                                    <div key={day} className={cn(
                                                        "flex justify-between items-center text-sm transition-transform duration-300",
                                                        isToday && "scale-[1.02] origin-left"
                                                    )}>
                                                        <span className={cn(
                                                            "font-bold capitalize transition-colors",
                                                            isToday ? "text-charcoal" : "text-charcoal/40"
                                                        )}>{day}</span>
                                                        <span className={cn(
                                                            "font-light tracking-tight",
                                                            isClosed ? "text-umber/20 italic" : "text-umber/90",
                                                            isToday && "font-normal"
                                                        )}>
                                                            {isClosed ? (t('closed') || 'Closed') : `${dayHours.open} – ${dayHours.close}`}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Other/Admission Hours Card */}
                                    <div className="p-10 bg-[#1A1A1A] text-white rounded-sm space-y-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                                        <div className="space-y-6 relative z-10">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 border-b border-white/10 pb-4">NCAI Library</h4>
                                            <div className="space-y-4">
                                                <p className="text-lg font-light leading-relaxed text-white/70">
                                                    Accessible to student and researchers by scheduled appointment.
                                                </p>
                                                <Link href="/about/library" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors gap-3 group/link">
                                                    Request Access
                                                    <div className="w-8 h-px bg-amber-500/30 group-hover/link:w-12 group-hover/link:bg-white transition-all duration-500" />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-white/10 relative z-10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold mb-2">Admission</p>
                                            <p className="text-3xl font-normal tracking-tighter leading-none">Free entrance for everyone</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {visitData?.openingHoursNote && (
                                <div className="flex items-center gap-3 pt-4">
                                    <div className="w-4 h-[1px] bg-black/10" />
                                    <p className="text-[10px] text-umber/50 italic tracking-wide uppercase">
                                        {getLocalizedValue(visitData.openingHoursNote, locale)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/10" />

                <section id="directions-map" className="grid lg:grid-cols-[1fr_2px_2.5fr] gap-12 lg:gap-24 items-start scroll-mt-[120px]">
                    <div className="pt-2">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal text-charcoal tracking-tighter capitalize leading-[0.9] lg:max-w-[320px]">
                                {locale === 'en' ? 'Directions & Map' : 'Ramani & Maelekezo'}
                            </h2>
                        </div>
                    </div>

                    <div className="hidden lg:block h-full py-4">
                        <div className="w-[1px] h-full bg-black/10 mx-auto" />
                    </div>

                    <div className="space-y-20">
                         {/* Map View */}
                         <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden bg-stone-100 border border-black/5 group cursor-pointer shadow-2xl">
                            <MapFrame 
                                address={getLocalizedValue(siteSettings?.address, locale) || "Nairobi Contemporary Art Institute"}
                                className="grayscale hover:grayscale-0 transition-all duration-1000 w-full h-full scale-[1.01] group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out flex justify-center pointer-events-none">
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo?.address || 'NCAI Nairobi')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-[10px] font-bold uppercase tracking-[0.4em] bg-white/10 backdrop-blur-xl px-10 py-5 rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-500 pointer-events-auto"
                                >
                                    Launch Navigation
                                </a>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-16">
                            {visitData?.directions && visitData.directions.length > 0 ? (
                                visitData.directions.map((d: any, i: number) => {
                                    const methodValue = getLocalizedValue(d.method, locale) || '';
                                    const method = methodValue.toLowerCase();
                                    let Icon = LucideMapPin;
                                    if (method.includes('bus') || method.includes('basi') || method.includes('matatu')) Icon = LucideBus;
                                    if (method.includes('car') || method.includes('gari') || method.includes('parking')) Icon = LucideCar;
                                    if (method.includes('train') || method.includes('reli')) Icon = LucideTrainFront;

                                    return (
                                        <div key={i} className="space-y-8 group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-full border border-black/5 bg-white flex items-center justify-center transition-all duration-700 group-hover:bg-charcoal group-hover:text-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
                                                    <Icon className="w-7 h-7" strokeWidth={1} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-charcoal/40 group-hover:text-charcoal transition-colors">
                                                        {methodValue}
                                                    </h3>
                                                    <div className="h-px w-8 bg-black/10 group-hover:w-16 transition-all duration-700" />
                                                </div>
                                            </div>
                                            <div className="prose prose-lg prose-umber max-w-none text-charcoal/80 font-light leading-relaxed pl-1">
                                                <PortableText 
                                                    value={getLocalizedValue(d.description, locale)} 
                                                    locale={locale}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="col-span-full">
                                    <p className="text-umber/50 italic">{t('noDirections') || 'Directions coming soon.'}</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-20 border-t border-black/5 grid md:grid-cols-[1.5fr_1fr] gap-12 items-end">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/30">Registry</h3>
                                <div className="space-y-4">
                                    <p className="text-3xl font-normal tracking-tight text-charcoal leading-none">{contactInfo?.name || 'NCAI'}</p>
                                    <p className="text-xl text-umber/80 leading-snug font-serif italic max-w-sm">
                                        {contactInfo?.address}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <a href={`tel:${contactInfo?.phone}`} className="flex-1 h-20 border border-black/5 flex flex-col items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-700 group">
                                    <LucidePhone className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Call Us</span>
                                </a>
                                <a href={`mailto:${contactInfo?.email}`} className="flex-1 h-20 border border-black/5 flex flex-col items-center justify-center hover:bg-charcoal hover:text-white transition-all duration-700 group">
                                    <LucideMail className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Email</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/10" />

                {/* Information Grid Section */}
                {visitData?.visitorCards && visitData.visitorCards.length > 0 && (
                    <section id="info" className="scroll-mt-[120px]">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {visitData.visitorCards.map((card: any, i: number) => (
                                <div key={i} className="group p-10 bg-white border border-black/5 rounded-sm hover:border-black/10 hover:shadow-2xl transition-all duration-700 flex flex-col justify-between min-h-[400px]">
                                    <div className="space-y-6">
                                        <div className="w-12 h-[1px] bg-charcoal/20 group-hover:w-24 transition-all duration-700" />
                                        <h3 className="text-3xl font-normal tracking-tight text-charcoal leading-tight">
                                            {getLocalizedValue(card.title, locale)}
                                        </h3>
                                        <div className="prose prose-sm prose-umber font-light leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                                            <PortableText value={getLocalizedValue(card.description, locale)} />
                                        </div>
                                    </div>
                                    
                                    {(card.button?.link || card.ctaUrl) && (
                                        <div className="pt-10">
                                            <Link 
                                                href={card.button?.link || card.ctaUrl}
                                                className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal group-hover:text-amber-800 transition-colors"
                                            >
                                                {getLocalizedValue(card.button?.text || card.ctaLabel, locale) || t('learnMore')}
                                                <div className="ml-3 w-8 h-[1px] bg-charcoal/20 group-hover:bg-amber-800 transition-all duration-700 group-hover:w-12" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Flexible Sections */}
                <div className="space-y-32">
                    {visitData?.sections?.map((section: any, idx: number) => {
                        const title = getLocalizedValue(section.title, locale);
                        const slug = title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                        return (
                            <section
                                key={idx}
                                id={slug || `section-${idx}`}
                                className="grid lg:grid-cols-[1fr_2px_2.5fr] gap-12 lg:gap-24 items-start scroll-mt-[120px]"
                            >
                                <div className="pt-2">
                                     <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal text-charcoal tracking-tighter capitalize leading-[0.9] lg:max-w-[320px]">
                                        {getLocalizedValue(section.title, locale)}
                                    </h2>
                                </div>
                                
                                <div className="hidden lg:block h-full py-4">
                                    <div className="w-[1px] h-full bg-black/10 mx-auto" />
                                </div>

                                <div className="space-y-12">
                                    {section.image && (
                                        <div className="relative aspect-[16/9] w-full rounded-sm overflow-visible bg-stone-100 border border-black/5 group">
                                            {section.image.link ? (
                                                <Link href={section.image.link} className="block w-full h-full relative overflow-hidden group">
                                                        <Image
                                                            src={urlFor(section.image).width(1200).height(675).url()}
                                                            alt={getLocalizedValue(section.title, locale) || ""}
                                                            fill
                                                            className="object-cover transition-all duration-1000 group-hover:scale-105"
                                                            sizes="(max-width: 1024px) 100vw, 60vw"
                                                        />
                                                </Link>
                                            ) : (
                                                <Image
                                                    src={urlFor(section.image).width(1200).height(675).url()}
                                                    alt={getLocalizedValue(section.title, locale) || ""}
                                                    fill
                                                    className="object-cover rounded-sm grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
                                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                                />
                                            )}
                                            {section.image.caption && (
                                                <div className="absolute bottom-6 right-6 z-50">
                                                    <ArtTooltip 
                                                        content={<ArtCaption content={getLocalizedValue(section.image.caption, locale)} className="text-charcoal" />}
                                                        align="right"
                                                    />
                                                </div>
                                            )}
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
                        );
                    })}
                </div>
            </div>
        </div>
    </div>

            {/* Newsletter CTA / Keep in touch area */}
            <section className="bg-[#1C1C1C] text-white py-32 px-section-clamp mt-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none opacity-10">
                    <div className="w-full h-full border-l border-white/5 skew-x-[-20deg] translate-x-1/2" />
                </div>
                
                <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                         <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{t('stayConnected')}</h2>
                         <p className="text-5xl md:text-8xl font-normal tracking-tighter leading-[0.9]">
                            {locale === 'en' ? 'Keep in touch.' : 'Endelea kuwasiliana.'}
                         </p>
                    </div>
                    
                    <div className="space-y-12">
                        <p className="text-xl md:text-2xl font-light text-white/50 max-w-2xl leading-relaxed">
                            {t('subscribeText') || 'Sign up to our newsletter for the latest exhibition announcements, events, and NCAI news.'}
                        </p>

                        <div className="pt-8">
                            <Link 
                                href="/newsletter"
                                className="inline-flex items-center gap-6 group"
                            >
                                <span className="text-2xl font-normal tracking-tight border-b border-white/20 pb-2 group-hover:border-white transition-colors">Sign up now</span>
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                                    <div className="w-2 h-2 bg-white group-hover:bg-black rounded-full" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
