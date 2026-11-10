'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollFadeProps {
    children: ReactNode
    /** Element that scrolls (default div); keeps `aria-label` etc. on the scroller. */
    as?: ElementType
    /** Classes for the scrolling element (layout, gaps, height). */
    className?: string
    /** Classes for the outer wrapper. */
    wrapperClassName?: string
    /** Gradient start colour, matching the surface behind the scroller (a `from-*` class). */
    fadeFrom?: string
    'aria-label'?: string
}

/**
 * Horizontal scroller with no visible scrollbar that shows a soft fade on whichever
 * edge still has content, so cut-off tabs read as "scroll for more". Fades only appear
 * while there is overflow, and use logical edges so right-to-left locales work.
 */
export function ScrollFade({
    children,
    as: Tag = 'div',
    className,
    wrapperClassName,
    fadeFrom = 'from-ivory',
    ...rest
}: ScrollFadeProps) {
    const ref = useRef<HTMLElement | null>(null)
    const [edges, setEdges] = useState({ start: false, end: false })

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const update = () => {
            const max = el.scrollWidth - el.clientWidth
            const pos = Math.abs(el.scrollLeft) // negative in RTL
            setEdges({ start: pos > 4, end: max - pos > 4 })
        }
        update()
        el.addEventListener('scroll', update, { passive: true })
        const ro = new ResizeObserver(update)
        ro.observe(el)
        window.addEventListener('resize', update)
        document.fonts?.ready.then(update)
        return () => {
            el.removeEventListener('scroll', update)
            ro.disconnect()
            window.removeEventListener('resize', update)
        }
    }, [])

    const fade = 'pointer-events-none absolute inset-y-0 w-10 from-0% to-100% to-transparent transition-opacity duration-200'

    return (
        <div className={cn('relative', wrapperClassName)}>
            <Tag ref={ref} className={cn('overflow-x-auto no-scrollbar scroll-smooth', className)} {...rest}>
                {children}
            </Tag>
            <span
                aria-hidden
                className={cn(fade, fadeFrom, 'start-0 bg-gradient-to-r rtl:bg-gradient-to-l', edges.start ? 'opacity-100' : 'opacity-0')}
            />
            <span
                aria-hidden
                className={cn(fade, fadeFrom, 'end-0 bg-gradient-to-l rtl:bg-gradient-to-r', edges.end ? 'opacity-100' : 'opacity-0')}
            />
        </div>
    )
}
