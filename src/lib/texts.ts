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
