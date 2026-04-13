import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

// ── 48 Quaternary Colors (6 families × 8 fine-grained shades) ──
const QUATERNARY_COLORS = [
    // Red / Orange family
    '#B71C1C', '#D32F2F', '#E53935', '#FF5252',
    '#FF6E40', '#FF7043', '#FF8A65', '#FFAB91',
    // Orange / Yellow family
    '#FF6D00', '#FF9100', '#FFA000', '#FFB300',
    '#FFC107', '#FFD54F', '#FFEB3B', '#FDD835',
    // Lime / Green family
    '#C0CA33', '#9CCC65', '#8BC34A', '#7CB342',
    '#66BB6A', '#4CAF50', '#43A047', '#2E7D32',
    // Teal / Cyan family
    '#00897B', '#009688', '#00ACC1', '#00BCD4',
    '#0097A7', '#0288D1', '#039BE5', '#03A9F4',
    // Blue / Indigo family
    '#1E88E5', '#1976D2', '#1565C0', '#3949AB',
    '#3F51B5', '#5C6BC0', '#5E35B1', '#7E57C2',
    // Purple / Magenta family
    '#8E24AA', '#AB47BC', '#7B1FA2', '#9C27B0',
    '#D81B60', '#E91E63', '#C2185B', '#AD1457',
]

// ── 24 Tertiary Colors (6 families × 4 shades) ──
const TERTIARY_COLORS = [
    // Red Family
    '#E53935', '#FF7043', '#FB8C00', '#FF9800',
    // Yellow Family
    '#FDD835', '#C0CA33', '#7CB342', '#43A047',
    // Green Family
    '#2E7D32', '#388E3C', '#00897B', '#00ACC1',
    // Cyan/Blue Family
    '#00BCD4', '#039BE5', '#1E88E5', '#3949AB',
    // Violet/Purple Family
    '#5E35B1', '#8E24AA', '#7B1FA2', '#AB47BC',
    // Magenta/Rose Family
    '#D81B60', '#E91E63', '#C2185B', '#AD1457',
]

// ── 12 Secondary Colors (Primary RGB triads cycling) ──
const SECONDARY_COLORS = [
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
]

// ── Primary ──
const PRIMARY_COLORS = ['#000000', '#ffffff']

export function BackgroundColors() {
    return (
        <section className="space-y-16">
            <header className="space-y-4">
                <p className="text-[10px] font-bold tracking-widest text-deep-umber/50 uppercase">16. Background Colors</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-charcoal capitalize">Page Background Colors</h2>
                <div className="max-w-3xl space-y-6 text-charcoal/80 leading-relaxed font-serif text-lg md:text-xl">
                    <p>
                        This section outlines the extensive palette designed for the entrance animation and meant for reuse by admins as rich background colors across different sections.
                    </p>
                    <p>
                        These colors are grouped into four tiers: Primary (monochrome), Secondary (vibrant triads), Tertiary (brand derivatives), and Quaternary (fine gradations).
                    </p>
                </div>
            </header>

            <div className="space-y-12">
                <ColorTier
                    title="Primary Backgrounds"
                    description="The foundational black and white. Used for the dramatic phase 1 of the entrance animation."
                    colors={PRIMARY_COLORS}
                />
                
                <ColorTier
                    title="Secondary Backgrounds (12 Colors)"
                    description="A tight triad of primary digital colors for major transitions. These cycle repeatedly to create visual impact."
                    colors={SECONDARY_COLORS}
                    columns="grid-cols-3 md:grid-cols-6"
                />

                <ColorTier
                    title="Tertiary Backgrounds (24 Colors)"
                    description="Expanded into 6 families to provide brand depth and color sweeps."
                    colors={TERTIARY_COLORS}
                    columns="grid-cols-4 md:grid-cols-8"
                />

                <ColorTier
                    title="Quaternary Backgrounds (48 Colors)"
                    description="The finest gradations. Used for the final curtain animation sweep to emulate the full spectrum before revealing content. Admins can select any of these for specific page atmospheres."
                    colors={QUATERNARY_COLORS}
                    columns="grid-cols-6 md:grid-cols-12 md:gap-2"
                />
            </div>
        </section>
    )
}

function ColorTier({ title, description, colors, columns = 'grid-cols-2 md:grid-cols-4' }: { title: string, description: string, colors: string[], columns?: string }) {
    // Determine uniqueness to avoid listing redundant colors in Secondary
    const uniqueColors = Array.from(new Set(colors));
    const showUniqueCount = uniqueColors.length !== colors.length;
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (color: string, index: number) => {
        navigator.clipboard.writeText(color);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tighter text-charcoal">{title}</h3>
                <p className="text-deep-umber/70 mt-2 font-serif text-lg">{description}</p>
                {showUniqueCount && (
                    <p className="text-sm text-ochre/80 mt-1">*{uniqueColors.length} unique values shown cycling in animation.</p>
                )}
            </div>
            <div className={`grid ${columns} gap-4`}>
                {colors.map((color, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <div 
                            className="aspect-square w-full rounded shadow-sm border border-black/5"
                            style={{ backgroundColor: color }}
                        />
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-mono tracking-wider text-charcoal/60 uppercase">{color}</span>
                            <button 
                                onClick={() => handleCopy(color, index)}
                                className="p-1 hover:bg-black/5 rounded text-charcoal/60 transition-colors"
                                title="Copy hex code"
                            >
                                {copiedIndex === index ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                    <Copy className="w-3 h-3" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
