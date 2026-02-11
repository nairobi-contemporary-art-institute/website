/**
 * Utility to extract a localized string from a Sanity internationalizedArray.
 * Falls back to 'en' if the requested locale is not found.
 */
export function getLocalizedValue<T = string>(
    array?: { _key: string; value: T }[],
    locale: string = 'en'
): T | undefined {
    if (!array || !Array.isArray(array)) return undefined

    // Try finding the exact locale
    const localized = array.find((item) => item._key === locale)
    if (localized) return localized.value

    // Fallback to English
    const fallback = array.find((item) => item._key === 'en')
    if (fallback) return fallback.value

    // Final fallback to the first available item
    return array[0]?.value || undefined
}
