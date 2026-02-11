import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n'

export default async function NotFound() {
    const t = await getTranslations('NotFound')

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <h1 className="text-8xl font-bold tracking-tighter text-umber mb-6">404</h1>
            <h2 className="text-2xl font-bold text-charcoal mb-4 uppercase tracking-widest italic">
                {t('title')}
            </h2>
            <p className="text-umber/90 max-w-md mx-auto mb-10">
                {t('description')}
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-charcoal text-ivory text-xs font-bold uppercase tracking-widest hover:bg-amber-900 transition-colors"
            >
                {t('goHome')}
            </Link>
        </div>
    )
}
