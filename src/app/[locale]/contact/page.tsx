import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.contact.title,
    }
}

export default function ContactPage() {
    const t = useTranslations('Pages.contact')

    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <section className="max-w-xl text-umber/80 space-y-12">
                <p>We welcome inquiries regarding our exhibitions, research, and programming.</p>

                <div className="grid gap-6">
                    <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-1">Email</h2>
                        <a href="mailto:info@ncai254.com" className="hover:text-amber-800 transition-colors">info@ncai254.com</a>
                    </div>
                    <div>
                        <h2 className="text-xs uppercase tracking-widest font-bold text-charcoal mb-1">Phone</h2>
                        <p>+254 000 000 000</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
