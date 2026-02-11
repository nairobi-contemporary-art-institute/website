import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages = await getMessages({ locale }) as any
    return {
        title: messages.Pages.about.title,
        description: messages.Pages.about.description
    }
}

export default function AboutPage() {
    const t = useTranslations('Pages.about')

    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <section className="prose prose-lg max-w-3xl text-umber/80">
                <p>{t('description')}</p>
                <div className="mt-8 grid gap-8">
                    <p>
                        The Nairobi Contemporary Art Institute (NCAI) is a non-profit visual arts space dedicated to
                        the growth and preservation of contemporary art in East Africa.
                    </p>
                    <p>
                        Established in 2020, NCAI focuses on exhibitions, research, and educational programming
                        that celebrates the region's diverse artistic heritage while fostering new experimental
                        practices.
                    </p>
                </div>
            </section>
        </div>
    )
}
