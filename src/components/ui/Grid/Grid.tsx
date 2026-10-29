'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { cn } from '@/lib/utils';

// --- Types ---

type ResponsiveValue<T> = T | {
    sm?: T;
    md?: T;
    lg?: T;
};

function getResponsiveValue<T>(v: ResponsiveValue<T> | undefined, fallback: T): T {
    if (v === undefined) return fallback;
    if (typeof v !== 'object' || v === null) return v as T;
    const val = v as { sm?: T; md?: T; lg?: T };
    return (val.lg ?? val.md ?? val.sm ?? fallback) as T;
}

/** Mobile-first per-breakpoint values: md inherits sm, lg inherits md; a missing sm takes the smallest set value. */
function getBreakpoints<T>(v: ResponsiveValue<T> | undefined, fallback: T): { sm: T; md: T; lg: T } {
    if (v === undefined) return { sm: fallback, md: fallback, lg: fallback };
    if (typeof v !== 'object' || v === null) return { sm: v as T, md: v as T, lg: v as T };
    const val = v as { sm?: T; md?: T; lg?: T };
    const sm = (val.sm ?? val.md ?? val.lg ?? fallback) as T;
    const md = (val.md ?? sm) as T;
    return { sm, md, lg: (val.lg ?? md) as T };
}

interface GridSystemContextType {
    debug: boolean;
    guideWidth: number;
}

const GridSystemContext = createContext<GridSystemContextType>({
    debug: false,
    guideWidth: 1,
});

// --- Components ---

/**
 * Grid.System: The root provider for grid settings and container constraints.
 */
interface GridSystemProps {
    children: React.ReactNode;
    debug?: boolean;
    guideWidth?: number;
    unstable_useContainer?: boolean;
    className?: string;
}

export function GridSystem({
    children,
    debug = false,
    guideWidth = 1,
    unstable_useContainer = false,
    className,
}: GridSystemProps) {
    return (
        <GridSystemContext.Provider value={{ debug, guideWidth }}>
            <div className={cn(
                "relative transition-all duration-300",
                unstable_useContainer && "page-container",
                className
            )}>
                {debug && (
                    <div className="absolute -top-6 right-0 flex gap-4 text-xs font-mono text-rich-blue/40 capitalize tracking-widest pointer-events-none">
                        <span>Grid Debug Mode</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-rich-blue/10 outline outline-1 outline-rich-blue/20" />
                            <span>Cell Boundary</span>
                        </div>
                    </div>
                )}
                {children}
            </div>
        </GridSystemContext.Provider>
    );
}

/**
 * Grid: The grid container that manages columns, rows, and background guides.
 */
interface GridProps {
    children?: React.ReactNode;
    columns?: ResponsiveValue<number>;
    rows?: ResponsiveValue<number>;
    gap?: ResponsiveValue<number>;
    height?: string | 'preserve-aspect-ratio';
    hideGuides?: 'row' | 'column' | 'both' | 'none';
    className?: string;
}

export function GridRoot({
    children,
    columns = 12,
    rows = 1,
    gap = 0,
    height,
    hideGuides = 'both',
    className,
}: GridProps) {
    const { guideWidth } = useContext(GridSystemContext);

    // Dynamic styles for the grid
    const gridStyles = useMemo(() => {
        const colCount = getResponsiveValue(columns, 12);
        const rowCount = getResponsiveValue(rows, 1);
        const cols = getBreakpoints(columns, 12);
        const rowBp = getBreakpoints(rows, 1);
        const gaps = getBreakpoints(gap, 0);

        // Per-breakpoint values go in custom properties; the classes below switch between them.
        const styles: React.CSSProperties = {
            '--grid-columns': colCount,
            '--grid-rows': rowCount,
            '--grid-guide-width': `${guideWidth}px`,
            '--gc-sm': cols.sm, '--gc-md': cols.md, '--gc-lg': cols.lg,
            '--gr-sm': rowBp.sm, '--gr-md': rowBp.md, '--gr-lg': rowBp.lg,
            '--gg-sm': `${gaps.sm}px`, '--gg-md': `${gaps.md}px`, '--gg-lg': `${gaps.lg}px`,
            display: 'grid',
        } as any;

        if (height === 'preserve-aspect-ratio') {
            styles.aspectRatio = `${colCount} / ${rowCount}`;
        } else if (height) {
            styles.height = height;
        }

        return styles;
    }, [columns, rows, gap, height, guideWidth]);

    return (
        <div
            style={gridStyles}
            className={cn(
                "w-full relative",
                "[grid-template-columns:repeat(var(--gc-sm),minmax(0,1fr))] md:[grid-template-columns:repeat(var(--gc-md),minmax(0,1fr))] lg:[grid-template-columns:repeat(var(--gc-lg),minmax(0,1fr))]",
                "[grid-template-rows:repeat(var(--gr-sm),1fr)] md:[grid-template-rows:repeat(var(--gr-md),1fr)] lg:[grid-template-rows:repeat(var(--gr-lg),1fr)]",
                "[gap:var(--gg-sm)] md:[gap:var(--gg-md)] lg:[gap:var(--gg-lg)]",
                hideGuides !== 'column' && hideGuides !== 'both' && "grid-guide-lines",
                hideGuides !== 'row' && hideGuides !== 'both' && "grid-guide-lines-rows",
                className
            )}
        >
            {children}
        </div>
    );
}

/**
 * Grid.Cell: A child component of Grid for precise placement and guide occlusion.
 */
interface CellProps {
    children?: React.ReactNode;
    column?: ResponsiveValue<string | number>;
    row?: ResponsiveValue<string | number>;
    solid?: boolean;
    className?: string;
}

export function Cell({
    children,
    column,
    row,
    solid = false,
    className,
}: CellProps) {
    const { debug } = useContext(GridSystemContext);

    const cellStyles = useMemo(() => {
        const toCss = (val: string | number) => (typeof val === 'number' ? `span ${val}` : val);
        const vars = (prefix: string, v: ResponsiveValue<string | number> | undefined) => {
            if (v === undefined) return {};
            const bp = getBreakpoints(v, '');
            return { [`--${prefix}-sm`]: toCss(bp.sm), [`--${prefix}-md`]: toCss(bp.md), [`--${prefix}-lg`]: toCss(bp.lg) };
        };

        return { ...vars('cc', column), ...vars('cr', row) } as React.CSSProperties;
    }, [column, row]);

    return (
        <div
            style={cellStyles}
            className={cn(
                "relative h-full w-full flex items-center justify-center p-4 min-w-0",
                column !== undefined && "[grid-column:var(--cc-sm)] md:[grid-column:var(--cc-md)] lg:[grid-column:var(--cc-lg)]",
                row !== undefined && "[grid-row:var(--cr-sm)] md:[grid-row:var(--cr-md)] lg:[grid-row:var(--cr-lg)]",
                "transition-all duration-300 min-h-[4rem]",
                solid ? "bg-white z-10" : "bg-transparent",
                debug && "bg-rich-blue/5 outline outline-1 outline-rich-blue/20",
                className
            )}
        >
            {children}
        </div>
    );
}

// Attach sub-components to Grid for the Geist-like API
export const Grid = Object.assign(GridRoot, {
    System: GridSystem,
    Cell: Cell,
});
