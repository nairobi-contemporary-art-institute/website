/**
 * Utility to extract a localized string from a Sanity internationalizedArray.
 * Falls back to 'en' if the requested locale is not found.
 */
export function getLocalizedValue<T = string>(
    array?: { _key: string; value?: T; text?: T }[],
    locale: string = 'en'
): T | undefined {
    if (!array || !Array.isArray(array)) return undefined

    // Try finding the exact locale
    const localized = array.find((item) => item._key === locale)
    if (localized) return (localized.value ?? localized.text) as T

    // Fallback to English
    const fallback = array.find((item) => item._key === 'en')
    if (fallback) return (fallback.value ?? fallback.text) as T

    // Final fallback to the first available item
    const first = array[0]
    return (first?.value ?? first?.text) as T || undefined
}

/**
 * Utility to convert Portable Text (blocks) to plain text for metadata.
 */
export function portableTextToPlainText(blocks: any[]): string {
    if (!blocks || !Array.isArray(blocks)) return ''
    return blocks
        .map(block => {
            if (block._type !== 'block' || !block.children) return ''
            return block.children.map((child: any) => child.text).join('')
        })
        .join('\n\n')
}
