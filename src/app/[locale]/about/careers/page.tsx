import { sanityFetch } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { GridSystem } from "@/components/ui/Grid/Grid"
import { PortableText } from "@/components/ui/PortableText"
import { Metadata } from 'next'

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

    if (!page) {
        return {
            title: `Careers | NCAI`,
        }
    }

    return {
        title: `${getLocalizedValue(page.title, locale)} | NCAI`,
    }
}

export default async function CareersPage({ params }: Props) {
    const { locale } = await params
    const page = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug: 'careers' },
        tags: ['page']
    })

    if (!page) {
        return (
            <GridSystem unstable_useContainer>
                <main className="pt-32 pb-24 min-h-screen bg-ivory">
                    <header className="mb-12">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9]">
                            {locale === 'en' ? 'Careers' : 'Kazi'}
                        </h1>
                    </header>
                    <div className="py-20 text-center text-charcoal/40 font-mono capitalize tracking-widest text-sm">
                        No current openings found.
                    </div>
                </main>
            </GridSystem>
        )
    }

    const title = getLocalizedValue(page.title, locale)
    const body = getLocalizedValue(page.body, locale)

    return (
        <GridSystem unstable_useContainer>
            <main className="pt-32 pb-40 min-h-screen bg-ivory">
                <header className="mb-20 max-w-4xl">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9]">
                        {title}
                    </h1>
                </header>

                {body && (
                    <div className="max-w-3xl">
                        <PortableText value={body} locale={locale} />
                    </div>
                )}
            </main>
        </GridSystem>
    )
}
