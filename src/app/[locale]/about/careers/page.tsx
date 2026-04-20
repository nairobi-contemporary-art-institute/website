import { sanityFetch } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { GridSystem } from "@/components/ui/Grid/Grid"
import { PortableText } from "@/components/ui/PortableText"
import { Metadata } from 'next'
import { AboutSubNav } from "@/components/about/AboutSubNav"
import { getTranslations } from "next-intl/server"

const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    body
  }
`

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const page = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug: 'careers' },
        tags: ['page']
    })

    return {
        title: `${locale === 'en' ? 'Careers' : 'Kazi'} | NCAI`,
    }
}

export default async function CareersPage({ params }: Props) {
    const { locale } = await params
    const page = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug: 'careers' },
        tags: ['page']
    })

    const t = await getTranslations({ locale, namespace: 'Pages.about' })

    const title = page ? getLocalizedValue(page.title, locale) : (locale === 'en' ? 'Careers' : 'Kazi')
    const body = page ? getLocalizedValue(page.body, locale) : null

    return (
        <GridSystem>
            <main className="min-h-screen bg-ivory">
                <header className="page-header-padding pb-12 px-section-clamp">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9] mb-8">
                        {title}
                    </h1>
                </header>

                <AboutSubNav locale={locale} />

                <div className="py-24 px-section-clamp">
                    {body ? (
                        <div className="max-w-3xl">
                            <PortableText value={body} locale={locale} />
                        </div>
                    ) : (
                        <div className="max-w-2xl py-20 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tight text-charcoal">
                                    {t('careersTeaser.title')}
                                </h2>
                                <p className="text-xl text-charcoal/60 leading-relaxed font-light">
                                    {t('careersTeaser.empty')}
                                </p>
                            </div>
                            
                            <div className="pt-8 border-t border-charcoal/5">
                                <p className="text-sm font-mono uppercase tracking-widest text-umber/60">
                                    Stay Connected
                                </p>
                                <div className="mt-4 flex gap-6 text-charcoal/40 hover:text-charcoal transition-colors">
                                    <a href="#" className="hover:text-umber transition-colors">Instagram</a>
                                    <a href="#" className="hover:text-umber transition-colors">LinkedIn</a>
                                    <a href="#" className="hover:text-umber transition-colors">Newsletter</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </GridSystem>
    )
}
