/**
 * Taxonomy values (event types, audience tags) are stored in English and used as
 * match keys, so they must never be translated in place. This turns a value into a
 * message key ("Supported Access" -> "supportedAccess") so only the *displayed*
 * label is translated; unknown CMS values fall back to the raw text.
 */
export function labelKey(raw: string): string {
    return raw
        .replace(/[^a-zA-Z ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
        .join('')
}

export function translateLabel(t: { has: (k: string) => boolean; (k: string): string }, raw: string): string {
    const key = labelKey(raw)
    return key && t.has(key) ? t(key) : raw
}
