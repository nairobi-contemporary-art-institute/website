/**
 * Build-time feature flags (NEXT_PUBLIC_* are inlined by Next). Flip in Vercel env
 * and redeploy; no code change. Defaults match the conservative first sign-off.
 */
const on = (v: string | undefined, fallback: boolean) => (v === undefined ? fallback : v === 'true')

/** Per-work "Enquire" mailto buttons on artist pages. Client: likely don't belong. */
export const SHOW_ENQUIRE = on(process.env.NEXT_PUBLIC_SHOW_ENQUIRE, false)

/** Header language switcher. Turn off (false) at go-live. */
export const SHOW_LANGUAGE_SWITCHER = on(process.env.NEXT_PUBLIC_SHOW_LANGUAGE_SWITCHER, true)

/** Past exhibitions as one horizontal carousel per year instead of a grid. */
export const ARCHIVE_CAROUSEL = on(process.env.NEXT_PUBLIC_ARCHIVE_CAROUSEL, false)
