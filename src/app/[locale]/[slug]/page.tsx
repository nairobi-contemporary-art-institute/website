import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/client"
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { PortableText } from "@/components/ui/PortableText"
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"
import { ResponsiveDivider } from "@/components/ui/ResponsiveDivider"

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const data = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug },
        tags: [`page:${slug}`],
    })

    if (!data) return {}

    return { title: getLocalizedValue(data.title, locale) || "NCAI" }
}

export default async function GenericPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params

    const data = await sanityFetch<any>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug },
        tags: [`page:${slug}`],
    })

    if (!data) notFound()

    const title = getLocalizedValue(data.title, locale)
    const body = getLocalizedValue(data.body, locale)

    return (
        <main className="bg-ivory min-h-screen page-header-padding">
            <GridSystem unstable_useContainer className="py-24 px-section-clamp">
                <Grid columns={{ sm: 1, md: 12 }} gap={64}>
                    <GridCell column={{ sm: 1, md: 12 }} className="p-0 items-start justify-start">
                        <div className="max-w-4xl space-y-12">
                            {title && (
                                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9]">
                                    {title}
                                </h1>
                            )}
                            {body && (
                                <div className="prose prose-lg md:prose-xl max-w-none text-charcoal/80">
                                    <PortableText value={body} locale={locale} />
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
