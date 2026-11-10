'use client'

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * True when the full institute title (measured from an invisible `runwayRef` copy of
 * the logo + title) fits in the header row beside the navigation, with `gap` px spare.
 *
 * The title length changes per locale ("Instituto de Arte Contemporáneo de Nairobi"
 * is ~30% wider than the English) and the nav width changes with its labels and the
 * entry badge, so a fixed breakpoint cannot be right. Re-measures on resize, font load
 * and when `deps` change (locale). Never true below `minViewport` (the full wording is
 * a desktop-only treatment) or while the nav is hidden (phones).
 */
export function useTitleFits(
    rowRef: RefObject<HTMLElement | null>,
    navRef: RefObject<HTMLElement | null>,
    runwayRef: RefObject<HTMLElement | null>,
    deps: unknown[] = [],
    gap = 32,
    minViewport = 1280
): boolean {
    const [fits, setFits] = useState(false)

    useIsoLayoutEffect(() => {
        const row = rowRef.current
        const nav = navRef.current
        const runway = runwayRef.current
        if (!row || !nav || !runway) return

        const measure = () => {
            const navW = nav.offsetWidth
            if (navW === 0 || window.innerWidth < minViewport) return setFits(false)
            const cs = getComputedStyle(row)
            const rowW = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
            setFits(runway.offsetWidth + navW + gap <= rowW)
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

    return fits
}
