import { portableTextToPlainText } from '../sanity/lib/utils'

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
