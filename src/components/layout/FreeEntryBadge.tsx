'use client'

import { useId } from 'react'
import { Link, usePathname } from '@/i18n'
import { cn } from '@/lib/utils'

export interface FreeEntryBadgeProps {
    text: string
    colorHex?: string
    link?: string
    visiblePages: string[]
    curvedText?: boolean
    rotation?: number
}

const DEFAULT_COLOR = '#7FE0CE'
const SIZE = 88

export function FreeEntryBadge({ text, colorHex, link, visiblePages, curvedText = false, rotation = 0 }: FreeEntryBadgeProps) {
    const pathname = usePathname()
    const pathId = useId().replace(/:/g, '')

    if (!text || !visiblePages?.length) return null

    const isVisible = visiblePages.some((key) => {
        if (key === 'home') return pathname === '/'
        return pathname === `/${key}` || pathname.startsWith(`/${key}/`)
    })

    if (!isVisible) return null

    const bg = colorHex || DEFAULT_COLOR

    const badgeClasses = cn(
        'rounded-circle flex shrink-0 aspect-square items-center justify-center text-center',
        'transition-transform duration-300 hover:scale-105'
    )
    const wrapperStyle = {
        width: SIZE,
        height: SIZE,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
    }

    const inner = curvedText ? (
        <svg viewBox="0 0 100 100" width={SIZE} height={SIZE} className="text-charcoal">
            <circle cx="50" cy="50" r="50" fill={bg} />
            <defs>
                {/* circle path for text, radius 38, starting at top */}
                <path id={pathId} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            </defs>
            <text
                fill="currentColor"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1.5"
                style={{ textTransform: 'uppercase' }}
            >
                <textPath href={`#${pathId}`} startOffset="25%" textAnchor="middle">
                    {text}
                </textPath>
            </text>
        </svg>
    ) : (
        <div
            className={cn(badgeClasses, 'text-[11px] font-bold uppercase leading-tight tracking-wide text-charcoal px-3 shadow-sm')}
            style={{ ...wrapperStyle, backgroundColor: bg }}
        >
            <span>{text}</span>
        </div>
    )

    // For curved variant the SVG already carries the circle; wrap for rotation + link.
    const content = curvedText ? (
        <span
            className="inline-flex shrink-0 transition-transform duration-300 hover:scale-105"
            style={wrapperStyle}
        >
            {inner}
        </span>
    ) : (
        inner
    )

    if (link) {
        return (
            <Link href={link} aria-label={text} className="inline-flex shrink-0">
                {content}
            </Link>
        )
    }

    return content
}
