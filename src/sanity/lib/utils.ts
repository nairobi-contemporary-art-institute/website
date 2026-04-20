/**
 * Utility to extract a localized string from a Sanity internationalizedArray.
 * Falls back to 'en' if the requested locale is not found.
 */
export function getLocalizedValue<T = string>(
    array: any,
    locale: string = 'en'
): T | undefined {
    if (typeof array === 'string') return array as unknown as T
    if (!array || !Array.isArray(array)) return undefined

    // Try finding the exact locale
    const localized = array.find((item: any) => item._key === locale)
    const result = localized ? (localized.value ?? localized.text) : undefined

    if (result !== undefined) return result as T

    // Fallback to English
    const fallback = array.find((item: any) => item._key === 'en')
    const fallbackResult = fallback ? (fallback.value ?? fallback.text) : undefined

    if (fallbackResult !== undefined) return fallbackResult as T

    // Final fallback to the first available item
    const first = array[0]
    return (first?.value ?? first?.text) as T || undefined
}

/**
 * Utility to convert Portable Text (blocks) to plain text for metadata.
 */
export function portableTextToPlainText(blocks: any[]): string {
    if (!blocks || !Array.isArray(blocks)) {
        if (typeof blocks === 'string') return blocks;
        return '';
    }
    return blocks
        .map(block => {
            if (block._type !== 'block' || !block.children) return ''
            return block.children.map((child: any) => child.text).join('')
        })
        .join('\n\n')
}

/**
 * Safely get a localized value as a string, even if it is stored as Portable Text.
 */
export function getLocalizedValueAsString(
    array: any,
    locale: string = 'en'
): string {
    if (typeof array === 'string') return array
    if (!array) return ''

    const val = getLocalizedValue<any>(array, locale);
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return portableTextToPlainText(val);
    if (typeof val === 'object' && val._type === 'block') return portableTextToPlainText([val]);
    return String(val);
}
