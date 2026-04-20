/**
 * NCAI Branded Color Palettes
 * Centralized for use in EntranceAnimation and Styleguide
 */

// ── 12 Secondary Colors (Primary RGB triads cycling) ──
export const SECONDARY_COLORS = [
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
    '#E43D30', '#F9B233', '#2B5797',
]

// ── 24 Tertiary Colors (6 families × 4 shades) ──
export const TERTIARY_COLORS = [
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

// ── 48 Quaternary Colors (6 families × 8 fine-grained shades) ──
export const QUATERNARY_COLORS = [
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
    // 3F51B5 omitted to fit 48? No, let's keep it accurate to the styleguide
    '#3F51B5', '#5C6BC0', '#5E35B1', '#7E57C2',
    // Purple / Magenta family
    '#8E24AA', '#AB47BC', '#7B1FA2', '#9C27B0',
    '#D81B60', '#E91E63', '#C2185B', '#AD1457',
]

/**
 * Calculates the complimentary color of a hex value.
 * Shifts Hue by 180 degrees.
 */
export function getComplimentaryColor(hex: string): string {
    if (!hex) return '#FFFFFF'

    // Remove # if present
    const cleanHex = hex.replace('#', '')

    // Parse RGB
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255

    // RGB to HSL
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0;
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }

    // Shift Hue by 180 (0.5 in 0-1 range)
    h = (h + 0.5) % 1

    // HSL back to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    const finalR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
    const finalG = Math.round(hue2rgb(p, q, h) * 255)
    const finalB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)

    const toHex = (n: number) => n.toString(16).padStart(2, '0')
    return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`
}
