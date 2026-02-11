'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('Error')

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <h2 className="text-2xl font-bold text-charcoal mb-4 uppercase tracking-widest italic">
                {t('title')}
            </h2>
            <p className="text-umber/90 max-w-md mx-auto mb-10">
                {t('description')}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 border border-charcoal text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-ivory transition-all"
                >
                    {t('tryAgain')}
                </button>
                <Link
                    href="/"
                    className="px-8 py-3 bg-charcoal text-ivory text-xs font-bold uppercase tracking-widest hover:bg-amber-900 transition-colors"
                >
                    {t('goHome')}
                </Link>
            </div>
        </div>
    )
}
