import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import { SITEMAP_QUERY, TEXT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { getLocalizedEntry, getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link, locales } from '@/i18n'
import { isTextType, labelSpeakerTurns, pickRelatedTexts, readingTime, resolveSpeakers } from '@/lib/texts'
import { jsonLdString, textArticleJsonLd } from '@/lib/jsonld'
import { PortableText } from '@/components/ui/PortableText'
import { ExhibitionCard } from '@/components/exhibitions/ExhibitionCard'
import { TextBody } from '@/components/texts/TextBody'
import { TextCard, formatTextDate } from '@/components/texts/TextCard'
import { TextFigure } from '@/components/texts/TextFigure'

type Params = Promise<{ locale: string; slug: string }>

const RTL_LOCALES = new Set(['ar'])

/** lang/dir for content that fell back to another language than the page's. */
function langProps(entryLocale: string | undefined, locale: string) {
    if (!entryLocale || entryLocale === locale) return {}
    return { lang: entryLocale, dir: RTL_LOCALES.has(entryLocale) ? 'rtl' : 'ltr' } as const
}

async function getText(slug: string) {
    return sanityFetch<any>({
        query: TEXT_BY_SLUG_QUERY,
        params: { slug },
        tags: [`textPiece:${slug}`, 'textPiece'],
    })
}

export async function generateStaticParams() {
    const documents = await sanityFetch<any[]>({ query: SITEMAP_QUERY, tags: ['textPiece'] })
    const texts = (documents || []).filter((doc) => doc._type === 'textPiece' && doc.slug)
    return locales.flatMap((locale) => texts.map((text) => ({ locale, slug: text.slug })))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale, slug } = await params
    const text = await getText(slug)
    if (!text) return { title: 'Not Found' }

    const title = getLocalizedValue<string>(text.title, locale)
    const description = getLocalizedValue<string>(text.standfirst, locale)
    const ogImage = text.leadImage?.asset ? urlFor(text.leadImage).width(1200).height(630).fit('crop').url() : undefined
    const authors = (text.authors || [])
        .map((a: any) => getLocalizedValue<string>(a?.name, locale))
        .filter(Boolean) as string[]

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: text.publishedAt,
            authors,
            images: ogImage ? [{ url: ogImage, alt: text.leadImage?.alt || '' }] : [],
        },
    }
}

function AuthorLink({ author, locale }: { author: any; locale: string }) {
    const name = getLocalizedValue<string>(author?.name, locale)
    if (!name) return null
    const href =
        author._type === 'artist' && author.slug
            ? `/artists/${author.slug}`
            : author._type === 'person' && author.hasProfile
              ? `/about/team#person-${author._id}`
              : undefined
    if (!href) return <>{name}</>
    return (
        <Link href={href} className="text-charcoal underline decoration-1 underline-offset-4 decoration-charcoal/40 hover:decoration-charcoal">
            {name}
        </Link>
    )
}

export default async function TextPage({ params }: { params: Params }) {
    const { locale, slug } = await params
    const text = await getText(slug)
    if (!text) notFound()

    const t = await getTranslations({ locale, namespace: 'Pages.texts' })

    const titleEntry = getLocalizedEntry<string>(text.title, locale)
    const standfirst = getLocalizedValue<string>(text.standfirst, locale)
    const byline = getLocalizedValue<string>(text.byline, locale)
    const bodyEntry = getLocalizedEntry<any[]>(text.body, locale)
    const speakers = resolveSpeakers(text.participants, locale)
    const body = labelSpeakerTurns(bodyEntry?.value, speakers)
    const notes = getLocalizedValue<any[]>(text.notes, locale)
    const minutes = readingTime(bodyEntry?.value)
    const typeLabel = isTextType(text.textType) ? t(`types.${text.textType}.singular`) : null
    const authors: any[] = (text.authors || []).filter(Boolean)
    const showLead = text.leadLayout !== 'none' && text.leadImage?.asset
    const relatedExhibitions: any[] = (text.relatedExhibitions || []).filter((e: any) => e?.slug)
    const relatedTexts = pickRelatedTexts(text)
    const jsonLd = textArticleJsonLd({
        text,
        locale,
        title: titleEntry?.value,
        description: standfirst,
        bodyLocale: bodyEntry?.locale,
        speakers,
    })

    return (
        <article className="pt-36 md:pt-48 pb-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
            <header className="measure" {...langProps(titleEntry?.locale, locale)}>
                {typeLabel && (
                    <Link
                        href={{ pathname: '/texts', query: { type: text.textType } }}
                        className="text-xs font-bold uppercase tracking-[0.14em] text-ochre-dark hover:text-charcoal transition-colors"
                    >
                        {typeLabel}
                    </Link>
                )}
                <h1 className="mt-5 text-4xl md:text-6xl font-light leading-[1.08] tracking-tight text-charcoal text-balance">
                    {titleEntry?.value}
                </h1>
                {standfirst && (
                    <p className="mt-6 text-xl md:text-2xl font-light leading-snug text-umber">{standfirst}</p>
                )}
                <div className="mt-8 pt-6 border-t border-charcoal/15 space-y-1 text-sm text-umber">
                    {authors.length > 0 && (
                        <p>
                            {t('by')}{' '}
                            {authors.map((author, i) => (
                                <span key={author._id || i}>
                                    {i > 0 && (i === authors.length - 1 ? ' & ' : ', ')}
                                    <AuthorLink author={author} locale={locale} />
                                </span>
                            ))}
                        </p>
                    )}
                    {byline && <p>{byline}</p>}
                    <p>
                        {text.publishedAt && <time dateTime={text.publishedAt}>{formatTextDate(text.publishedAt, locale)}</time>}
                        {bodyEntry && <> · {t('minRead', { minutes })}</>}
                    </p>
                </div>
            </header>

            {showLead && (
                <TextFigure
                    image={text.leadImage}
                    caption={getLocalizedValue<string>(text.leadImage.caption, locale)}
                    size={text.leadLayout === 'full' ? 'full' : 'wide'}
                    priority
                    className="mt-12 md:mt-16"
                />
            )}

            <div className="mt-12 md:mt-16" {...langProps(bodyEntry?.locale, locale)}>
                <TextBody value={body} />
            </div>

            {notes?.length ? (
                <section aria-labelledby="text-notes" className="measure mt-16 pt-8 border-t border-charcoal/15">
                    <h2 id="text-notes" className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-umber">
                        {t('notes')}
                    </h2>
                    <PortableText value={notes} locale={locale} noProse className="text-sm leading-relaxed text-charcoal" />
                </section>
            ) : null}

            {(relatedExhibitions.length > 0 || relatedTexts.length > 0 || text.prev || text.next) && (
                <footer className="page-container mt-24">
                    <div className="border-t border-charcoal/15">
                        {relatedExhibitions.length > 0 && (
                            <section aria-labelledby="related-exhibitions" className="pt-16">
                                <h2 id="related-exhibitions" className="mb-8 text-2xl md:text-3xl font-light tracking-tight text-charcoal">
                                    {t('relatedExhibitions')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {relatedExhibitions.map((exhibition: any) => (
                                        <ExhibitionCard key={exhibition._id} exhibition={exhibition} locale={locale} variant="compact" />
                                    ))}
                                </div>
                            </section>
                        )}

                        {relatedTexts.length > 0 && (
                            <section aria-labelledby="related-texts" className="pt-16">
                                <h2 id="related-texts" className="mb-8 text-2xl md:text-3xl font-light tracking-tight text-charcoal">
                                    {t('relatedTexts')}
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                                    {relatedTexts.map((related: any) => (
                                        <li key={related._id}>
                                            <TextCard text={related} locale={locale} headingLevel="h3" />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {(text.prev || text.next) && (
                            <nav aria-label={t('textNavigation')} className="mt-16 pt-6 border-t border-charcoal/15 grid grid-cols-2 gap-8 text-sm">
                                <div>
                                    {text.prev && (
                                        <Link href={`/texts/${text.prev.slug}`} className="group block">
                                            <span className="block text-umber"><span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {t('previousText')}</span>
                                            <span className="mt-1 block font-bold text-charcoal group-hover:underline underline-offset-4">
                                                {getLocalizedValue<string>(text.prev.title, locale)}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                                <div className="text-end">
                                    {text.next && (
                                        <Link href={`/texts/${text.next.slug}`} className="group block">
                                            <span className="block text-umber">{t('nextText')} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span></span>
                                            <span className="mt-1 block font-bold text-charcoal group-hover:underline underline-offset-4">
                                                {getLocalizedValue<string>(text.next.title, locale)}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        )}

                        <p className="mt-12 text-center text-sm">
                            <Link href="/texts" className="text-charcoal underline underline-offset-4">
                                {t('viewAll')}
                            </Link>
                        </p>
                    </div>
                </footer>
            )}
        </article>
    )
}
