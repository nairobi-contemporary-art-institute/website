import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMessages } from 'next-intl/server'
import { groq } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/client'
import { EXHIBITION_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import { LogoGrid } from '@/components/ui/LogoGrid'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { ExhibitHeroSplit } from '@/components/exhibitions/ExhibitHeroSplit'
import { HorizontalGallery } from '@/components/exhibitions/HorizontalGallery'
import { CinematicGallery } from '@/components/exhibitions/CinematicGallery'
import { WrittenPiece } from '@/components/exhibitions/WrittenPiece'
import { AccordionSection } from '@/components/ui/AccordionSection'
import { MediaModule } from '@/components/ui/MediaModule'
import { RelatedContentGrid } from '@/components/exhibitions/RelatedContentGrid'
import { GridSystem, GridRoot as Grid, Cell as GridCell } from '@/components/ui/Grid/Grid'
import { cn, formatExhibitionDate } from '@/lib/utils'
import { InPageNav } from '@/components/exhibitions/InPageNav'
import { ChannelCard } from '@/components/channel/ChannelCard'

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    const exhibition = await sanityFetch<any>({
        query: EXHIBITION_BY_SLUG_QUERY,
        params: { slug, locale },
        tags: [`exhibition:${slug}`]
    })

    if (!exhibition) {
        return {
            title: 'Exhibition Not Found',
        }
    }

    const title = getLocalizedValue(exhibition.title, locale)
    const descriptionBlocks = getLocalizedValue<any>(exhibition.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : `Exhibition: ${title}`)

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: exhibition.mainImage?.asset ? [urlFor(exhibition.mainImage).width(1200).height(630).url()] : [],
        },
    }
}

export default async function ExhibitionPage({ params }: Props) {
    const { locale, slug } = await params
    const exhibition = await sanityFetch<any>({
        query: EXHIBITION_BY_SLUG_QUERY,
        params: { slug, locale },
        tags: [`exhibition:${slug}`]
    })

    if (!exhibition) {
        notFound()
    }

    const t = await getMessages({ locale }) as any

    const settings = await sanityFetch<any>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings']
    });

    const artists = exhibition.artists || []
    
    // Background color processing
    const bgColor = exhibition.backgroundThemeColor?.hex || '#FDFBF7'
    const checkIsDark = (color: string) => {
        const hex = color.replace('#', '')
        if (hex.length !== 6) return false
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        return luma < 128
    }
    const isDark = checkIsDark(bgColor)

    // Related Content Hybrid Logic
    let relatedContentItems = exhibition.manualRelatedContent || []
    
    if (relatedContentItems.length === 0) {
        relatedContentItems = exhibition.relatedPosts || []
    }

    const title = getLocalizedValue(exhibition.title, locale)
    const intro = getLocalizedValue(exhibition.introDescription, locale)
    const description = getLocalizedValue(exhibition.description, locale)
    const artistNames = exhibition.artists?.map((a: any) => getLocalizedValue(a.name, locale)).filter(Boolean).join(', ')
    const locationName = getLocalizedValue(exhibition.location, locale)
    const admissionStatus = getLocalizedValue(exhibition.admission, locale)

    // Build Nav Items
    const navItems = [
        { id: 'overview', label: 'Overview' },
        artists.length > 0 && { id: 'artists', label: 'Artists' },
        { id: 'visitor-info', label: 'Visit' },
        exhibition.gallery?.length > 0 && { id: 'gallery', label: 'Gallery' },
        exhibition.mediaModule?.url && { id: 'media', label: exhibition.mediaModule.mediaType === 'video' ? 'Video' : 'Media' },
        // Add extra sections to navigation
        ...(exhibition.extraSections?.map((section: any) => {
            const sectionTitle = getLocalizedValue(section.title, locale)
            if (sectionTitle) {
                return { id: section._key, label: sectionTitle }
            }
            return null
        }).filter(Boolean) || []),
        relatedContentItems.length > 0 && { id: 'related', label: 'Related' }
    ].filter(Boolean) as { id: string, label: string }[]

    return (
        <main className="min-h-screen bg-[#F9F8F6]">
            {/* HERO SECTION */}
            {exhibition.heroLayout === 'split' ? (
                <ExhibitHeroSplit
                    title={title || 'Untitled'}
                    startDate={exhibition.startDate}
                    endDate={exhibition.endDate}
                    themeColor={bgColor}
                    heroImage={exhibition.mainImage}
                    locale={locale}
                    textArt={exhibition.heroTextArt}
                    intro={intro}
                    artistName={artistNames}
                    location={locationName}
                    admission={admissionStatus}
                    bookingUrl={exhibition.bookingUrl}
                    enquiryModule={exhibition.enquiryModule}
                />
            ) : (
                <section 
                    className="pt-40 md:pt-52 pb-20 px-6 md:px-12 transition-colors duration-500"
                    style={{ backgroundColor: bgColor }}
                >
                   <header className="max-w-4xl space-y-8">
                        <span className={cn(
                            "inline-block px-3 py-1 border text-xs font-bold tracking-[0.2em] uppercase transition-colors",
                            isDark ? "border-white/20 text-white/60" : "border-charcoal/20 text-charcoal/60"
                        )}>
                            {t.Pages?.exhibitions?.label || 'Exhibition'}
                        </span>

                        <h1 className={cn(
                            "text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] transition-colors",
                            isDark ? "text-white" : "text-charcoal"
                        )}>
                            {title || 'Untitled'}
                        </h1>

                        <div className={cn(
                            "flex items-center space-x-6 text-lg md:text-xl font-medium transition-colors",
                            isDark ? "text-white/90" : "text-charcoal"
                        )}>
                            {formatExhibitionDate(exhibition.startDate, exhibition.endDate, locale)}
                        </div>
                    </header>
                </section>
            )}

            {/* IN-PAGE NAV (Sticky) */}
            {exhibition.showInternalNavigation !== false && navItems.length > 0 && (
                <InPageNav items={navItems} />
            )}

            {/* MAIN CONTENT GRID */}
            <div id="overview" className="scroll-mt-32">
                <GridSystem unstable_useContainer={false} className="px-6 md:px-12 py-20">
                    <Grid columns={{ sm: 1, md: 12 }} gap={16}>
                    {/* Sticky Sidebar / Meta */}
                    <GridCell column={{ sm: 1, md: 4 }} className="flex flex-col items-start justify-start p-0">
                        <div className="md:sticky md:top-32 space-y-16">

                             {/* Artists Profile Section */}
                             {artists.length > 0 && (
                                <div className="space-y-12" id="artists">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40 border-b border-charcoal/5 pb-4">
                                        {artists.length === 1 ? 'Participating Artist' : 'Participating Artists'}
                                    </h4>
                                    <div className="flex flex-col gap-16">
                                        {artists.map((artist: any) => {
                                            const artistBio = getLocalizedValue(artist.bio, locale)
                                            const portraitCaption = getLocalizedValue(artist.image?.caption, locale)
                                            const portraitCredit = getLocalizedValue(artist.image?.imageCredit?.name, locale)
                                            const portraitCreditSlug = artist.image?.imageCredit?.slug
                                            const portraitCreditHasProfile = artist.image?.imageCredit?.hasProfile !== false

                                            return (
                                                <div key={artist._id} className="space-y-6">
                                                    {artist.image?.asset && (
                                                        <div className="space-y-3">
                                                            <div className="aspect-[4/5] relative overflow-hidden bg-stone-100">
                                                                <Image
                                                                    src={urlFor(artist.image).width(800).height(1000).url()}
                                                                    alt={getLocalizedValue(artist.name, locale) ?? ''}
                                                                    fill
                                                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                                                />
                                                            </div>
                                                            {(portraitCaption || portraitCredit) && (
                                                                <div className="space-y-1">
                                                                    {portraitCaption && <p className="text-[10px] text-charcoal/60 leading-tight italic">{portraitCaption}</p>}
                                                                    {portraitCredit && (
                                                                        <p className="text-[8px] uppercase tracking-[0.2em] text-charcoal/40 font-bold">
                                                                            Image credit: {(portraitCreditSlug && portraitCreditHasProfile) ? (
                                                                                <Link 
                                                                                    href={`/${locale}/about/team#${portraitCreditSlug}`}
                                                                                    className="hover:text-ochre transition-colors underline decoration-charcoal/10 underline-offset-4"
                                                                                >
                                                                                    {portraitCredit}
                                                                                </Link>
                                                                            ) : (
                                                                                portraitCredit
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="space-y-4">
                                                        <Link 
                                                            href={`/${locale}/artists/${artist.slug}`}
                                                            className="text-2xl font-medium tracking-tight hover:text-ochre transition-colors uppercase block"
                                                        >
                                                            {getLocalizedValue(artist.name, locale)}
                                                        </Link>
                                                        {artistBio && (
                                                            <div className="text-sm text-stone-500 leading-relaxed font-serif max-w-sm">
                                                                <PortableText value={artistBio} locale={locale} />
                                                            </div>
                                                        )}
                                                            <div className="flex flex-col gap-2">
                                                                <Link 
                                                                    href={`/${locale}/artists/${artist.slug}`}
                                                                    className="text-[10px] items-center gap-2 font-bold uppercase tracking-widest text-charcoal inline-flex hover:text-ochre transition-colors group"
                                                                >
                                                                    View Artist Profile <span className="transition-transform group-hover:translate-x-1">→</span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        
                                                        {artist.portraitPost && (
                                                            <div className="pt-6 border-t border-stone-200/50">
                                                                <div className="mb-4">
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ochre">FEATURED PORTRAIT</span>
                                                                </div>
                                                                <div className="bg-stone-50/50 p-2">
                                                                    <ChannelCard 
                                                                        post={artist.portraitPost}
                                                                        locale={locale}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                        })}
                                    </div>
                                </div>
                            )}

                             {/* Curators */}
                             {exhibition.curators?.length > 0 && (
                                <div className="space-y-6 border-t border-stone-200/50 pt-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40">Curated By</h4>
                                    <div className="flex flex-col gap-4">
                                        {exhibition.curators.map((curator: any) => {
                                            const name = getLocalizedValue(curator.name, locale)
                                            const isArtist = curator._type === 'artist'
                                            const hasProfile = isArtist || curator.hasProfile !== false
                                            
                                            // Handle roles (e.g., Assistant Curator)
                                            const roles = curator.roles || [];
                                            const translatedRoles = roles.map((role: string) => {
                                                if (role === 'curator') return locale === 'en' ? 'Curator' : 'Curateur';
                                                if (role === 'assistant-curator') return locale === 'en' ? 'Assistant Curator' : 'Assistant Curateur';
                                                return role;
                                            });
                                            const roleDisplay = translatedRoles.join(', ');
                                            
                                            if (hasProfile && curator.slug) {
                                                const profileUrl = isArtist 
                                                    ? `/${locale}/artists/${curator.slug}`
                                                    : `/${locale}/about/team#${curator.slug}`
 
                                                return (
                                                <div key={curator._id} className="space-y-1">
                                                    <Link 
                                                        href={profileUrl}
                                                        className="text-lg font-medium tracking-tight text-charcoal hover:text-ochre transition-colors underline decoration-charcoal/10 underline-offset-8 uppercase block"
                                                    >
                                                        {name}
                                                    </Link>
                                                    {roleDisplay && (
                                                        <span className="text-[10px] uppercase tracking-widest text-charcoal/40 block">
                                                            {roleDisplay}
                                                        </span>
                                                    )}
                                                </div>
                                                )
                                            }

                                            return (
                                                <div key={curator._id} className="space-y-1">
                                                    <span className="text-lg font-medium tracking-tight text-charcoal/80 uppercase block">
                                                        {name}
                                                    </span>
                                                    {roleDisplay && (
                                                        <span className="text-[10px] uppercase tracking-widest text-charcoal/40 block">
                                                            {roleDisplay}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                             {/* Enquiry Button (Admin controlled) */}
                             {exhibition.enquiryModule?.enabled && (
                                <div className="pt-8 border-t border-charcoal/5">
                                    <Link
                                        href={exhibition.enquiryModule.url || `/${locale}/contact?subject=Enquiry: ${title}`}
                                        target={exhibition.enquiryModule.openInNewTab ? "_blank" : "_self"}
                                        rel={exhibition.enquiryModule.openInNewTab ? "noopener noreferrer" : undefined}
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-charcoal text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ochre transition-all"
                                    >
                                        {getLocalizedValue(exhibition.enquiryModule.label, locale) || 'Enquire'}
                                    </Link>
                                    {exhibition.bookingUrl && (
                                        <p className="mt-4 text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">
                                            Tickets available now
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </GridCell>

                    {/* Main Description & Accordions */}
                    <GridCell column={{ sm: 1, md: '7 / span 6' }} className="flex flex-col items-start justify-start p-0">
                        <div className="space-y-16 p-4">
                            <div className="text-base md:text-lg font-serif text-charcoal/90 leading-relaxed max-w-2xl">
                                <PortableText value={description} locale={locale} />
                            </div>

                            <div className="pt-8 space-y-4">
                                <AccordionSection id="visitor-info" title="Visitor Information">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-charcoal/70 leading-relaxed">
                                        <div className="space-y-4">
                                            <h5 className="font-black uppercase tracking-widest text-[10px]">Location</h5>
                                            <p className="whitespace-pre-line">{locationName || settings?.contactInfo?.address}</p>
                                            <Link href={settings?.contactInfo?.googleMapsUrl || '#'} target="_blank" className="underline underline-offset-4 font-bold">View Map</Link>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="font-black uppercase tracking-widest text-[10px]">Information</h5>
                                            <p className="flex flex-col gap-2">
                                                <span>Hours: 10:00am – 6:00pm</span>
                                                {admissionStatus && <span>Admission: {admissionStatus}</span>}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionSection>

                                {(exhibition.pressKitUrl || exhibition.exhibitionGuideUrl) && (
                                    <AccordionSection title="Press & Resources">
                                        <div className="flex flex-col gap-4">
                                            {exhibition.pressKitUrl && (
                                                <a 
                                                    href={exhibition.pressKitUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-left py-2 flex items-center gap-4 group"
                                                >
                                                    <span className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all">↓</span>
                                                    <span className="text-lg font-medium tracking-tight">Download Press Release</span>
                                                </a>
                                            )}
                                            {exhibition.exhibitionGuideUrl && (
                                                <a 
                                                    href={exhibition.exhibitionGuideUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-left py-2 flex items-center gap-4 group"
                                                >
                                                    <span className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-all">↓</span>
                                                    <span className="text-lg font-medium tracking-tight">Exhibition Guide</span>
                                                </a>
                                            )}
                                        </div>
                                    </AccordionSection>
                                )}
                            </div>
                        </div>
                    </GridCell>
                </Grid>
            </GridSystem>
        </div>

            {/* HORIZONTAL GALLERY (Root) */}
            {exhibition.gallery && exhibition.gallery.length > 0 && (
                <div id="gallery" className="scroll-mt-32">
                    {exhibition.galleryLayout !== 'accordion' ? (
                        <CinematicGallery 
                            images={exhibition.gallery}
                            locale={locale}
                        />
                    ) : (
                        <HorizontalGallery 
                            images={exhibition.gallery} 
                            locale={locale} 
                            className="py-12"
                        />
                    )}
                </div>
            )}

            {/* EXTRA DYNAMIC SECTIONS */}
            {exhibition.extraSections?.map((section: any) => {
                if (section._type === 'horizontalGallery') {
                    const sectionTitle = getLocalizedValue(section.title, locale)
                    const isCinema = section.layoutType === 'cinema'
                    
                    return (
                        <div key={section._key} id={section._key} className="scroll-mt-32">
                            {isCinema ? (
                                <CinematicGallery 
                                    title={sectionTitle}
                                    images={section.images}
                                    locale={locale}
                                />
                            ) : (
                                <HorizontalGallery 
                                    title={sectionTitle}
                                    images={section.images} 
                                    locale={locale} 
                                    className="py-12"
                                />
                            )}
                        </div>
                    )
                }
                if (section._type === 'editorialBlock') {
                    const sectionTitle = getLocalizedValue(section.title, locale)
                    const sectionContent = getLocalizedValue(section.content, locale)
                    return (
                        <div key={section._key} id={section._key} className="px-6 md:px-12 py-12 scroll-mt-32 bg-stone-50/50">
                             <GridSystem unstable_useContainer={false}>
                                <Grid columns={{ sm: 1, md: 12 }}>
                                    <GridCell column={{ sm: 1, md: '7 / span 6' }} className="p-4">
                                        <div className="space-y-8">
                                            {sectionTitle && (
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/40 border-b border-charcoal/5 pb-4">
                                                    {sectionTitle}
                                                </h4>
                                            )}
                                            <div className="text-base md:text-lg font-serif text-charcoal/90 leading-relaxed max-w-2xl">
                                                <PortableText value={sectionContent} locale={locale} />
                                            </div>
                                        </div>
                                    </GridCell>
                                </Grid>
                             </GridSystem>
                        </div>
                    )
                }
                if (section._type === 'writtenPiece') {
                    const sectionTitle = getLocalizedValue(section.title, locale)
                    const sectionContent = getLocalizedValue(section.content, locale)
                    const sectionAuthor = getLocalizedValue(section.author, locale)
                    return (
                        <div key={section._key} id={section._key} className="scroll-mt-32">
                            <WrittenPiece 
                                title={sectionTitle}
                                content={sectionContent}
                                author={sectionAuthor}
                                locale={locale}
                            />
                        </div>
                    )
                }
                return null
            })}

            {/* MEDIA MODULE (Listen Back etc) */}
            {exhibition.mediaModule?.url && (
                <div className="px-6 md:px-12 py-12 scroll-mt-32" id="media">
                    <MediaModule 
                        title={getLocalizedValue(exhibition.mediaModule.title, locale) || (exhibition.mediaModule.mediaType === 'audio' ? "Listen Back" : "Watch")}
                        label={getLocalizedValue(exhibition.mediaModule.label, locale) || (exhibition.mediaModule.mediaType === 'audio' ? "SOUNDCLOUD" : "VIDEO")}
                        url={exhibition.mediaModule.url}
                        bgImage={exhibition.mediaModule.image}
                        bgColor={exhibition.mediaModule.backgroundColor?.hex}
                    />
                </div>
            )}

            <div className="px-6 md:px-12 pb-24 space-y-12">
                {/* Partners */}
                {exhibition.partners?.length > 0 && (
                    <div className="py-20 border-t border-charcoal/5">
                        <LogoGrid
                            partners={exhibition.partners}
                            locale={locale}
                            title={t.Common?.partners || 'Exhibition Partners'}
                        />
                    </div>
                )}

                {/* Related Content */}
                <div id="related" className="border-t border-charcoal/5 pt-20">
                    <RelatedContentGrid 
                        items={relatedContentItems}
                        locale={locale}
                        title="Associated Programming"
                    />
                </div>

                <footer className="pt-20 flex justify-between items-center border-t border-charcoal/5">
                    <Link href={`/${locale}/exhibitions`} className="text-xs font-black uppercase tracking-[0.2em] text-charcoal hover:translate-x-[-8px] transition-transform inline-flex items-center gap-4">
                        ← Back to Exhibitions
                    </Link>
                </footer>
            </div>
        </main>
    )
}
