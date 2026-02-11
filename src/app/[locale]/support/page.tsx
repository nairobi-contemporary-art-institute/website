import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.support.title,
    }
}

export default function SupportPage() {
    const t = useTranslations('Pages.support')

    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <section className="prose prose-lg max-w-3xl text-umber/80 space-y-8">
                <p>
                    NCAI relies on the generosity of individuals and organizations to continue our mission
                    of celebrating and preserving the artistic heritage of East Africa.
                </p>
                <div className="mt-12 bg-charcoal text-ivory p-8 md:p-12 rounded-sm text-center">
                    <h3 className="text-2xl font-bold mb-4">Become a Supporter</h3>
                    <p className="mb-8 opacity-80">Join us in shaping the future of contemporary art in Nairobi.</p>
                    <button className="bg-ivory text-charcoal px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-ochre hover:text-ivory transition-all cursor-pointer">
                        Donate Now
                    </button>
                </div>
            </section>
        </div>
    )
}
