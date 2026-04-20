import { sanityFetch } from "@/sanity/lib/client"
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"
import { HeroIMMA } from "@/components/ui/HeroIMMA"
import { AboutSubNav } from "@/components/about/AboutSubNav"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: ABOUT_PAGE_QUERY,
        tags: ["aboutPage"],
    })

    if (!data) return { title: 'About NCAI' }

    return {
        title: getLocalizedValue(data.title, locale) || 'About NCAI',
        description: getLocalizedValue(data.hero?.headline, locale)
    }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params

    const [aboutPageData, settings] = await Promise.all([
        sanityFetch<any>({
            query: ABOUT_PAGE_QUERY,
            tags: ["aboutPage"],
        }),
        sanityFetch<any>({
            query: SITE_SETTINGS_QUERY,
            tags: ["siteSettings"],
        })
    ])

    const t = await getTranslations({ locale, namespace: 'Pages.about' })
    const tNav = await getTranslations({ locale, namespace: 'Navigation' })

    const title = getLocalizedValue(aboutPageData?.title, locale) || t('title')
    const heroHeadline = getLocalizedValue(aboutPageData?.hero?.headline, locale) || t('description')
    const heroIntro = getLocalizedValue(aboutPageData?.hero?.intro, locale)
    
    // Check global style preference
    const headerStyle = settings?.headerStyle || 'ncai'

    const navItems = [
        { label: tNav('aboutOverview'), href: '/about' },
        { label: tNav('aboutMission'), href: '/about/mission' },
        { label: tNav('aboutHistory'), href: '/about/history' },
        { label: tNav('aboutTeam'), href: '/about/team' },
        { label: tNav('aboutCareers'), href: '/about/careers' },
    ]

    return (
        <main className="bg-ivory min-h-screen page-header-padding">
            {/* Hero Section - Full spanning width */}
            {headerStyle === 'ncai' ? (
                <HeroIMMA
                    title={title}
                    image={aboutPageData?.hero?.image}
                    headline={heroHeadline}
                    intro={heroIntro}
                    caption={aboutPageData?.hero?.image?.caption ? getLocalizedValue(aboutPageData.hero.image.caption, locale) : undefined}
                />
            ) : (
                <header className="relative py-20 overflow-hidden border-b border-charcoal/5">
                    <GridSystem unstable_useContainer>
                        <Grid columns={{ sm: 1, md: 12 }} gap={24}>
                            <GridCell column={{ sm: 1, md: 8 }} className="items-start justify-start p-0">
                                <div className="max-w-4xl space-y-8">
                                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9]">
                                        {title}
                                    </h1>
                                    {heroHeadline && (
                                        <p className="text-2xl md:text-4xl text-umber font-medium leading-tight tracking-tight">
                                            {heroHeadline}
                                        </p>
                                    )}
                                    {heroIntro && (
                                        <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl leading-relaxed">
                                            {heroIntro}
                                        </p>
                                    )}
                                </div>
                            </GridCell>

                            {aboutPageData?.hero?.image && (
                                <GridCell column={{ sm: 1, md: 4 }} className="hidden md:flex p-0 relative min-h-[400px]">
                                    <Image
                                        src={urlFor(aboutPageData.hero.image).width(800).url()}
                                        alt=""
                                        fill
                                        className="object-cover opacity-20 grayscale brightness-50"
                                    />
                                </GridCell>
                            )}
                        </Grid>
                    </GridSystem>
                </header>
            )}

            {/* Horizontal Sub-Navigation (Sticky) */}
            <AboutSubNav locale={locale} />

            {/* Main Content (Contained) */}
            <GridSystem unstable_useContainer className="py-24 px-section-clamp">
                <Grid columns={{ sm: 1, md: 12 }} gap={64}>
                    {/* Sidebar Column (3 columns) */}
                    <GridCell column={{ sm: 1, md: 3 }} className="p-0 hidden md:block">
                        <nav className="sticky top-[200px] space-y-2">
                            {navItems.map((item, idx) => {
                                const isActive = item.href === '/about'
                                return (
                                    <Link 
                                        key={idx} 
                                        href={item.href}
                                        className={cn(
                                            "block py-3 border-b border-charcoal/5 text-sm uppercase tracking-widest transition-all",
                                            isActive ? "text-umber font-bold" : "text-charcoal/40 hover:text-charcoal"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </GridCell>

                    {/* Main Content Column (9 columns) */}
                    <GridCell column={{ sm: 1, md: 9 }} className="p-0 items-start justify-start">
                        <div className="max-w-4xl space-y-24">
                            {/* Main About Title & Intro */}
                            <section className="space-y-12">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-charcoal leading-none">
                                    {title}
                                </h2>
                                
                                <div className="prose prose-xl prose-charcoal max-w-none space-y-8">
                                    <p className="text-2xl text-charcoal/70 leading-relaxed font-light">
                                        {aboutPageData?.hero?.intro ? getLocalizedValue(aboutPageData.hero.intro, locale) : heroHeadline}
                                    </p>
                                </div>
                            </section>

                            {/* Render Sanity Sections if they exist */}
                            {aboutPageData?.sections && aboutPageData.sections.length > 0 && (
                                <div className="space-y-32">
                                    {aboutPageData.sections.map((section: any, idx: number) => {
                                        const sectionTitle = getLocalizedValue(section.title, locale)
                                        const sectionContent = getLocalizedValue(section.content, locale)
                                        
                                        return (
                                            <section key={idx} className="space-y-10 group">
                                                {sectionTitle && (
                                                    <h3 className="text-4xl font-bold tracking-tighter text-charcoal group-hover:text-umber transition-colors duration-500">
                                                        {sectionTitle}
                                                    </h3>
                                                )}
                                                
                                                {section.image && (
                                                    <div className="relative aspect-[16/9] w-full bg-charcoal/5 overflow-hidden">
                                                        <Image
                                                            src={urlFor(section.image).width(1200).url()}
                                                            alt={sectionTitle || ''}
                                                            fill
                                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                                        />
                                                    </div>
                                                )}

                                                {sectionContent && (
                                                    <div className="prose prose-lg md:prose-xl max-w-none text-charcoal/80">
                                                        <PortableText value={sectionContent} locale={locale} />
                                                    </div>
                                                )}
                                                
                                                <ResponsiveDivider weight="thin" className="opacity-10 pt-16" />
                                            </section>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </GridCell>
                </Grid>

                <div className="mt-20">
                    <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
                </div>
            </GridSystem>
        </main>
    )
}
