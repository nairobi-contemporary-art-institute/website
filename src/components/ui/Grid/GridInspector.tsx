'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Grid } from './Grid';

/**
 * GridInspector: A development utility to overlay the global grid system
 * on any page. Triggered by 'Shift + G'.
 */
export function GridInspector() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle visibility with Shift + G
            if (e.shiftKey && e.key.toLowerCase() === 'g') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Only render in development/staging (usually via env var, but for now we'll keep it simple)
    // if (process.env.NODE_ENV !== 'development') return null;

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Global Grid Overlay */}
            <div className="container mx-auto px-6 h-full">
                <div
                    className="w-full h-full relative grid-guide-lines grid-guide-lines-rows"
                    style={{
                        '--grid-columns': 12,
                        '--grid-rows': 12,
                        '--grid-guide-width': '1px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridTemplateRows: 'repeat(12, 1fr)',
                        opacity: 0.3,
                    } as React.CSSProperties}
                >
                    {/* Visual Indicators for columns */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-full border-x border-rich-blue/20 bg-rich-blue/5 flex items-start justify-center pt-2"
                        >
                            <span className="text-[10px] font-mono text-rich-blue/40 font-bold">{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Indicator */}
            <div className="fixed bottom-4 right-4 bg-charcoal text-white px-3 py-1.5 rounded-full text-[10px] font-mono shadow-2xl flex items-center gap-2 pointer-events-auto border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GRID INSPECTOR ACTIVE (Shift + G to toggle)
            </div>
        </div>
    );
}
