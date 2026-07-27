import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

/**
 * Minimal breadcrumb trail. The last item (no href) is treated as the current
 * page and rendered muted / non-interactive. Styling matches the site's
 * uppercase micro-label idiom.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const valid = items?.filter(Boolean) || []
    if (valid.length === 0) return null

    return (
        <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                {valid.map((item, i) => {
                    const isLast = i === valid.length - 1
                    return (
                        <li key={`${item.label}-${i}`} className="flex items-center gap-x-2">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-charcoal/50 hover:text-ochre transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={isLast ? 'page' : undefined} className="text-charcoal/80">
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <span className="text-charcoal/25" aria-hidden="true">/</span>}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
