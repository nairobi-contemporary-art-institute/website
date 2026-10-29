import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { TEXT_TYPES, type TextType } from '@/lib/texts'
import { cn } from '@/lib/utils'

/**
 * Type filter for /texts. Plain links (no client JS): each type has its own
 * crawlable URL and works without JavaScript.
 */
export function TextTypeFilter({ active }: { active: TextType | null }) {
    const t = useTranslations('Pages.texts')
    const options: { label: string; type: TextType | null }[] = [
        { label: t('filterAll'), type: null },
        ...TEXT_TYPES.map((type) => ({ label: t(`types.${type}.plural`), type })),
    ]

    return (
        <nav aria-label={t('filterLabel')} className="border-b border-charcoal/15">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {options.map(({ label, type }) => {
                    const isActive = type === active
                    return (
                        <li key={type ?? 'all'}>
                            <Link
                                href={type ? { pathname: '/texts', query: { type } } : '/texts'}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'inline-block py-4 text-sm border-b-2 -mb-px transition-colors',
                                    isActive
                                        ? 'border-charcoal font-bold text-charcoal'
                                        : 'border-transparent text-umber hover:text-charcoal'
                                )}
                            >
                                {label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
