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
                unstable_useContainer && "container",
                className
            )}>
                {debug && (
                    <div className="absolute -top-6 right-0 flex gap-4 text-[10px] font-mono text-rich-blue/40 capitalize tracking-widest pointer-events-none">
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
    hideGuides = 'none',
    className,
}: GridProps) {
    const { guideWidth } = useContext(GridSystemContext);

    // Dynamic styles for the grid
    const gridStyles = useMemo(() => {
        const colCount = getResponsiveValue(columns, 12);
        const rowCount = getResponsiveValue(rows, 1);
        const gapVal = getResponsiveValue(gap, 0);

        const styles: React.CSSProperties = {
            '--grid-columns': colCount,
            '--grid-rows': rowCount,
            '--grid-guide-width': `${guideWidth}px`,
            display: 'grid',
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gridTemplateRows: `repeat(${rowCount}, 1fr)`,
            gap: gapVal ? `${gapVal}px` : '0px',
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
        const parseValue = (v: ResponsiveValue<string | number> | undefined) => {
            if (v === undefined) return undefined;
            const val = getResponsiveValue(v, '');
            return typeof val === 'number' ? `span ${val}` : val;
        };

        return {
            gridColumn: parseValue(column),
            gridRow: parseValue(row),
        } as React.CSSProperties;
    }, [column, row]);

    return (
        <div
            style={cellStyles}
            className={cn(
                "relative h-full w-full flex items-center justify-center p-4",
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
