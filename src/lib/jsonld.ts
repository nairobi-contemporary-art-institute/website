import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { TEXT_TYPE_LABELS, isTextType, type Speaker } from '@/lib/texts'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ncai254.com'

const ORGANIZATION = {
    '@type': 'Organization',
    name: 'Nairobi Contemporary Art Institute',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
}

/** Serialise for a <script type="application/ld+json"> without allowing `</script>` breakouts. */
export function jsonLdString(data: unknown): string {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}

const roleTitle = (role: string) => role.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/**
 * schema.org Person for a `person` or `artist` document, or a typed-in name.
 * Properties: name, url, image, sameAs, jobTitle, worksFor (staff only).
 * address/alumniOf are deliberately omitted (privacy; no data).
 */
export function personJsonLd(profile: any, locale: string, fallbackName?: string): Record<string, unknown> | null {
    const name = (fallbackName || getLocalizedValue<string>(profile?.name, locale) || '').trim()
    if (!name) return null

    const url =
        profile?._type === 'artist' && profile.slug
            ? `${SITE_URL}/${locale}/artists/${profile.slug}`
            : profile?._type === 'person' && profile.hasProfile
              ? `${SITE_URL}/${locale}/about/team#person-${profile._id}`
              : undefined
    const sameAs = (profile?.sameAs || []).filter((u: unknown) => typeof u === 'string' && u)
    const jobTitle =
        profile?._type === 'artist' ? 'Artist' : profile?.roles?.[0] ? roleTitle(profile.roles[0]) : undefined

    return {
        '@type': 'Person',
        name,
        ...(url && { url }),
        ...(profile?.image?.asset && { image: urlFor(profile.image).width(800).url() }),
        ...(sameAs.length > 0 && { sameAs }),
        ...(jobTitle && { jobTitle }),
        ...(profile?._type === 'person' && profile.category === 'staff' && { worksFor: ORGANIZATION }),
    }
}

/** schema.org Article for a Text: authors, other speakers as contributors, interviewees as `about`. */
export function textArticleJsonLd({
    text,
    locale,
    title,
    description,
    bodyLocale,
    speakers,
}: {
    text: any
    locale: string
    title?: string
    description?: string
    bodyLocale?: string
    speakers: Map<string, Speaker>
}) {
    const url = `${SITE_URL}/${locale}/texts/${text.slug}`
    const textType: unknown = text.textType
    const authors = (text.authorProfiles || [])
        .map((a: any) => personJsonLd(a, locale))
        .filter(Boolean) as Record<string, unknown>[]
    const authorIds = new Set((text.authorProfiles || []).map((a: any) => a?._id).filter(Boolean))

    const others = [...speakers.values()].filter((s) => !(s.person?._id && authorIds.has(s.person._id)))
    const contributors = others.map((s) => personJsonLd(s.person, locale, s.name)).filter(Boolean)
    const about = [...speakers.values()]
        .filter((s) => s.role === 'interviewee')
        .map((s) => personJsonLd(s.person, locale, s.name))
        .filter(Boolean)

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: (title || '').slice(0, 110),
        ...(description && { description }),
        ...(text.leadImage?.asset && { image: [urlFor(text.leadImage).width(1200).url()] }),
        ...(text.publishedAt && { datePublished: text.publishedAt }),
        ...(text._updatedAt && { dateModified: text._updatedAt }),
        inLanguage: bodyLocale || locale,
        ...(isTextType(textType) && { articleSection: TEXT_TYPE_LABELS[textType].singular }),
        author: authors.length > 0 ? authors : ORGANIZATION,
        ...(contributors.length > 0 && { contributor: contributors }),
        ...(about.length > 0 && { about }),
        publisher: ORGANIZATION,
        mainEntityOfPage: url,
        url,
    }
}
