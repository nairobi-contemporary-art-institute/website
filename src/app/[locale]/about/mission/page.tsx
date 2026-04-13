import { sanityFetch } from "@/sanity/lib/client"
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid"
import { PortableText } from "@/components/ui/PortableText"
import { Metadata } from 'next'
import Image from 'next/image'
import { urlFor } from "@/sanity/lib/image"

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    return {
        title: `${locale === 'en' ? 'Mission & Vision' : 'Malengo na Maono'} | NCAI`,
        description: 'Our commitment to the growth and preservation of contemporary art in East Africa.',
    }
}

export default async function MissionPage({ params }: Props) {
    const { locale } = await params
    const aboutData = await sanityFetch<any>({ query: ABOUT_PAGE_QUERY, tags: ["aboutPage"] })

    const missionSections = aboutData?.sections?.filter((s: any) => {
        const title = getLocalizedValue(s.title, locale)?.toLowerCase() || ''
        return title.includes('mission') || title.includes('vision') || title.includes('values') || title.includes('who we are')
    }) || []

    return (
        <GridSystem unstable_useContainer className="pt-32 pb-40 min-h-screen bg-ivory">
            <header className="mb-32 max-w-4xl">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-charcoal capitalize leading-[0.9] mb-8">
                    {locale === 'en' ? 'Mission & Vision' : 'Malengo na Maono'}
                </h1>
            </header>

            <div className="space-y-40">
                {missionSections.map((section: any, idx: number) => {
                    const title = getLocalizedValue(section.title, locale)
                    const content = getLocalizedValue(section.content, locale)
                    const isEven = idx % 2 === 0

                    return (
                        <section key={idx} className="px-section-clamp relative">
                            <Grid columns={{ sm: 1, md: 12 }} gap={48} className="items-center">
                                <GridCell column={{ sm: 1, md: 6 }} className={`${isEven ? 'order-1' : 'order-1 md:order-2'} items-start justify-start p-0`}>
                                    <div className="space-y-8">
                                        {title && (
                                            <h2 className="text-4xl md:text-6xl font-bold capitalize tracking-tighter text-charcoal leading-none">
                                                {title}
                                            </h2>
                                        )}
                                        {content && (
                                            <div className="prose prose-xl max-w-none text-charcoal/80">
                                                <PortableText value={content} locale={locale} />
                                            </div>
                                        )}
                                    </div>
                                </GridCell>

                                {section.image && (
                                    <GridCell column={{ sm: 1, md: 6 }} className={`${isEven ? 'order-2' : 'order-2 md:order-1'} p-0`}>
                                        <div className="relative aspect-square w-full bg-charcoal/5 overflow-hidden group shadow-2xl">
                                            <Image
                                                src={urlFor(section.image).width(1200).url()}
                                                alt={title || ''}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                        </div>
                                    </GridCell>
                                )}
                            </Grid>
                        </section>
                    )
                })}
            </div>
        </GridSystem>
    )
}
