import { getLocalizedValue, portableTextToPlainText } from '../sanity/lib/utils'

/**
 * Canonical vocabulary for Texts (see CONTEXT.md → Text).
 * Shared by the Sanity schema, Studio templates and the /texts routes.
 */
export const TEXT_TYPES = ['essay', 'interview', 'conversation', 'artistWriting'] as const
export type TextType = (typeof TEXT_TYPES)[number]

/** English labels for the Studio. Site labels live in messages → Pages.texts.types. */
export const TEXT_TYPE_LABELS: Record<TextType, { singular: string; plural: string }> = {
    essay: { singular: 'Essay', plural: 'Essays' },
    interview: { singular: 'Interview', plural: 'Interviews' },
    conversation: { singular: 'Conversation', plural: 'Conversations' },
    artistWriting: { singular: "Artist's writing", plural: "Artists' writings" },
}

export function isTextType(value: unknown): value is TextType {
    return typeof value === 'string' && (TEXT_TYPES as readonly string[]).includes(value)
}

export const TEXTS_PAGE_SIZE = 12

/** Estimated reading time in whole minutes (~200 wpm), minimum 1. */
export function readingTime(blocks: any[] | undefined): number {
    const words = portableTextToPlainText(blocks || []).split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
}

const TEXT_PATHS: Record<string, string> = {
    textPiece: '/texts/',
    exhibition: '/exhibitions/',
    artist: '/artists/',
}

/** Locale-less path for an internal link target, for use with Link from '@/i18n'. */
export function internalPath(type: string | undefined, slug: string | undefined): string | undefined {
    if (!type || !slug || !TEXT_PATHS[type]) return undefined
    return `${TEXT_PATHS[type]}${slug}`
}

/**
 * Related texts for a Text page: editor picks win; otherwise linked
 * (shared exhibition / artist / author) → same type → most recent, deduped.
 */
export function pickRelatedTexts(
    text: { relatedManual?: any[]; relatedLinked?: any[]; relatedSameType?: any[]; relatedRecent?: any[] },
    limit = 3
): any[] {
    const manual = (text.relatedManual || []).filter((t) => t?.slug)
    if (manual.length > 0) return manual.slice(0, limit)
    const seen = new Set<string>()
    return [...(text.relatedLinked || []), ...(text.relatedSameType || []), ...(text.relatedRecent || [])]
        .filter((t) => t?.slug && !seen.has(t._id) && seen.add(t._id))
        .slice(0, limit)
}

export type Speaker = { key: string; name: string; initials: string; role?: string; person?: any }

export function deriveInitials(name: string): string {
    return name
        .split(/[\s-]+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 4)
}

/** A Text's Speakers by key, with names resolved and ambiguous initials dropped. */
export function resolveSpeakers(participants: any[] | undefined, locale: string): Map<string, Speaker> {
    const list: Speaker[] = (participants || [])
        .filter((p) => p?._key)
        .map((p) => {
            const name = (p.name || getLocalizedValue<string>(p.person?.name, locale) || '').trim()
            return { key: p._key, name, initials: (p.initials || deriveInitials(name)).trim(), role: p.role, person: p.person }
        })
    const counts = new Map<string, number>()
    list.forEach((s) => counts.set(s.initials, (counts.get(s.initials) || 0) + 1))
    // Two speakers with the same initials would be ambiguous: use their full names throughout
    return new Map(list.map((s) => [s.key, (counts.get(s.initials) || 0) > 1 ? { ...s, initials: '' } : s]))
}

/**
 * Gives each inline speaker a `label`: full name on their first turn, initials
 * after. Also trims the space typed after the marker, since the label carries
 * its own spacing.
 */
export function labelSpeakerTurns(blocks: any[] | undefined, speakers: Map<string, Speaker>): any[] | undefined {
    if (!blocks) return blocks
    const seen = new Set<string>()
    return blocks.map((block) => {
        if (block?._type !== 'block' || !block.children?.some((c: any) => c?._type === 'speaker')) return block
        const children = block.children.map((child: any, i: number, all: any[]) => {
            if (child?._type === 'speaker') {
                const speaker = speakers.get(child.participant)
                if (!speaker?.name) return { ...child, label: child.label || '' }
                const label = seen.has(speaker.key) && speaker.initials ? speaker.initials : speaker.name
                seen.add(speaker.key)
                return { ...child, label }
            }
            if (child?._type === 'span' && all[i - 1]?._type === 'speaker' && typeof child.text === 'string') {
                return { ...child, text: child.text.replace(/^\s+/, '') }
            }
            return child
        })
        return { ...block, children }
    })
}
