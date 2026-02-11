import { client } from '@/sanity/lib/client'
import { PROGRAMS_QUERY } from '@/sanity/lib/queries'
import { EducationFilter } from '@/components/education/EducationFilter'
import { getTranslations } from 'next-intl/server'

// Ensure dynamic rendering
export const revalidate = 60

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.education' })
    return {
        title: t('title'),
        description: t('description')
    }
}

export default async function EducationPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.education' })
    const programs = await client.fetch(PROGRAMS_QUERY)

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="mb-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-8">
                    {t('title')}
                </h1>
                <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                    {t('description')}
                </p>
                <div className="h-px w-24 bg-charcoal mt-8" />
            </header>

            <EducationFilter programs={programs} locale={locale} />
        </div>
    )
}
