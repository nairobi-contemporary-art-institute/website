'use client'

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type TitleSize = 'lg' | 'sm' | false

/**
 * Picks how the full institute title is shown beside the navigation:
 *  - 'lg'  the large wordmark fits (`largeRef`, an invisible copy of logo + title)
 *  - 'sm'  only the smaller wordmark fits (`smallRef`)
 *  - false neither fits: keep the compact logomark
 *
 * Title length changes per locale ("Instituto de Arte Contemporáneo de Nairobi" is ~30%
 * wider than the English) and the nav width changes with its labels and the entry
 * badge, so a fixed breakpoint cannot be right. Re-measures on resize, font load and
 * when `deps` change (locale). Never shows the full wording below `minViewport` (a
 * desktop-only treatment) or while the nav is hidden (phones).
 */
export function useTitleFits(
    rowRef: RefObject<HTMLElement | null>,
    navRef: RefObject<HTMLElement | null>,
    largeRef: RefObject<HTMLElement | null>,
    smallRef: RefObject<HTMLElement | null>,
    deps: unknown[] = [],
    gap = 32,
    minViewport = 1280
): TitleSize {
    const [size, setSize] = useState<TitleSize>(false)

    useIsoLayoutEffect(() => {
        const row = rowRef.current
        const nav = navRef.current
        const large = largeRef.current
        const small = smallRef.current
        if (!row || !nav || !large || !small) return

        const measure = () => {
            const navW = nav.offsetWidth
            if (navW === 0 || window.innerWidth < minViewport) return setSize(false)
            const cs = getComputedStyle(row)
            const free = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - navW - gap
            setSize(large.offsetWidth <= free ? 'lg' : small.offsetWidth <= free ? 'sm' : false)
        }

        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(row)
        ro.observe(nav)
        window.addEventListener('resize', measure)
        document.fonts?.ready.then(measure)
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', measure)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return size
}
