import { client, sanityFetch } from '@/sanity/lib/client'
import { EDUCATION_PAGE_QUERY, PROGRAMS_QUERY } from '@/sanity/lib/queries'
import { EducationFilter } from '@/components/education/EducationFilter'
import { getTranslations } from 'next-intl/server'
import { getLocalizedValue, portableTextToPlainText, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'
import Image from 'next/image'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const data = await sanityFetch<any>({
        query: EDUCATION_PAGE_QUERY,
        tags: ['educationPage']
    })
    const t = await getTranslations({ locale, namespace: 'Pages.education' })

    if (!data) {
        return {
            title: t('title'),
            description: t('description')
        }
    }

    const descriptionBlocks = getLocalizedValue<any>(data.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title: getLocalizedValueAsString(data.title, locale) || t('title'),
        description
    }
}

export default async function EducationPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.education' })

    const [pageData, programs] = await Promise.all([
        sanityFetch<any>({ query: EDUCATION_PAGE_QUERY, tags: ['educationPage'] }),
        sanityFetch<any[]>({ query: PROGRAMS_QUERY, tags: ['program'] })
    ])

    const title = getLocalizedValueAsString(pageData?.header?.headline, locale) || getLocalizedValueAsString(pageData?.title, locale) || t('title')
    const description = getLocalizedValue(pageData?.header?.description, locale)

    return (
        <div className="min-h-screen bg-stone-50/20 pb-32">
            <header className="container mx-auto px-section-clamp pt-24 pb-20">
                <div className="max-w-4xl">
                    <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                        {title}
                    </h1>
                    {description ? (
                        <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            <PortableText value={description} locale={locale} />
                        </div>
                    ) : (
                        <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            {t('description')}
                        </p>
                    )}
                    <div className="h-px w-24 bg-charcoal/20 mt-12" />
                </div>
            </header>

            {/* Pillars Section */}
            {pageData?.pillars && pageData.pillars.length > 0 && (
                <section className="px-section-clamp container mx-auto px-section-clamp mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {pageData.pillars.map((pillar: any, i: number) => (
                            <div key={i} className="group flex flex-col space-y-6">
                                {pillar.image?.asset && (
                                    <div className="relative aspect-[4/5] bg-stone-200 overflow-hidden">
                                        <Image
                                            src={pillar.image.asset.url}
                                            alt={getLocalizedValue(pillar.title, locale) || 'Pillar'}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            placeholder="blur"
                                            blurDataURL={pillar.image.asset.metadata?.lqip}
                                        />
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-charcoal tracking-tight">
                                        {getLocalizedValue(pillar.title, locale)}
                                    </h2>
                                    <p className="text-sm text-charcoal/60 leading-relaxed font-mono capitalize tracking-wider">
                                        {getLocalizedValue(pillar.description, locale)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="container mx-auto px-section-clamp">
                <div className="mb-12">
                    <h2 className="text-xs font-bold capitalize tracking-[0.3em] text-umber border-b border-umber/10 pb-4 inline-block mb-12">
                        {t('allPrograms')}
                    </h2>
                    <EducationFilter programs={programs} locale={locale} />
                </div>
            </div>
        </div>
    )
}
