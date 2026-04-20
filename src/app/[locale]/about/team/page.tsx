import { sanityFetch } from "@/sanity/lib/client"
import { TEAM_QUERY, ABOUT_PAGE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { GridSystem } from "@/components/ui/Grid/Grid"
import { AboutSubNav } from "@/components/about/AboutSubNav"
import { TeamGrid } from "@/components/about/TeamGrid"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    return {
        title: `${locale === 'en' ? 'Team' : 'Timu'} | NCAI`,
        description: 'Meet the curators, educators, and visionaries behind NCAI.',
    }
}

export default async function TeamPage({ params }: Props) {
    const { locale } = await params
    const [people, aboutData] = await Promise.all([
        sanityFetch<any[]>({ query: TEAM_QUERY, tags: ["person"] }),
        sanityFetch<any>({ query: ABOUT_PAGE_QUERY, tags: ["aboutPage"] })
    ])

    const t = await getTranslations({ locale, namespace: 'Pages.about' })

    return (
        <GridSystem>
            <main className="min-h-screen bg-ivory">
                <header className="pt-32 pb-12 px-section-clamp">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9] mb-8">
                        {locale === 'en' ? 'Our Team' : 'Timu Yetu'}
                    </h1>
                    <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                        Meet the dedicated professionals working to preserve and grow contemporary art in East Africa.
                    </p>
                </header>

                <AboutSubNav locale={locale} />

                <div className="py-24 px-section-clamp">
                    <TeamGrid people={people} locale={locale} />
                </div>
            </main>
        </GridSystem>
    )
}
