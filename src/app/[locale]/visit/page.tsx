import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.visit.title,
    }
}

export default function VisitPage() {
    const t = useTranslations('Pages.visit')

    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <div className="grid md:grid-cols-2 gap-16">
                <section className="text-umber/80 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-charcoal mb-2">Location</h2>
                        <p>Nairobi Contemporary Art Institute</p>
                        <p>Godown Arts Centre</p>
                        <p>Nairobi, Kenya</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-charcoal mb-2">Hours</h2>
                        <p>Tuesday – Saturday: 10:00 AM – 6:00 PM</p>
                        <p>Sunday: 12:00 PM – 5:00 PM</p>
                        <p>Monday: Closed</p>
                    </div>
                </section>
                <div className="bg-charcoal/5 aspect-video flex items-center justify-center text-umber/40 italic">
                    Map integration placeholder
                </div>
            </div>
        </div>
    )
}
