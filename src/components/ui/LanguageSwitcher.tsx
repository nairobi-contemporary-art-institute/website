'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter, languages } from '@/i18n'
import { cn } from '@/lib/utils'

/**
 * A minimalist language switcher component that allows users to toggle
 * between the site's supported locales.
 */
export function LanguageSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    // Key languages to show directly
    const primaryLocales = ['en', 'sw', 'ar']

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-umber/90 leading-none" aria-label="Language selection">
            {languages.filter(lang => primaryLocales.includes(lang.id)).map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => handleLocaleChange(lang.id)}
                    className={cn(
                        'hover:text-umber transition-colors cursor-pointer',
                        locale === lang.id && 'text-umber underline underline-offset-4'
                    )}
                    aria-current={locale === lang.id ? 'page' : undefined}
                >
                    {lang.id}
                </button>
            ))}
        </nav>
    )
}
