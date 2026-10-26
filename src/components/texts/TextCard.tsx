import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { isTextType } from '@/lib/texts'
import { cn } from '@/lib/utils'

export function formatTextDate(date: string | undefined, locale: string) {
    if (!date) return ''
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}

export function authorNames(authors: any[] | undefined, locale: string) {
    const names = (authors || [])
        .map((a) => getLocalizedValue<string>(a?.name, locale))
        .filter((n): n is string => Boolean(n))
    return names.length ? new Intl.ListFormat(locale, { type: 'conjunction' }).format(names) : ''
}

/**
 * Listing card for a Text. Sync (useTranslations) so it also renders inside
 * client components such as RelatedContentGrid.
 */
export function TextCard({
    text,
    locale,
    variant = 'default',
    headingLevel = 'h2',
}: {
    text: any
    locale: string
    variant?: 'default' | 'feature'
    headingLevel?: 'h2' | 'h3'
}) {
    const t = useTranslations('Pages.texts')
    const Heading = headingLevel
    const title = getLocalizedValue<string>(text?.title, locale)
    const standfirst = getLocalizedValue<string>(text?.standfirst, locale)
    const authors = authorNames(text?.authors, locale)
    const typeLabel = isTextType(text?.textType) ? t(`types.${text.textType}.singular`) : null
    const image = text?.leadImage?.asset ? text.leadImage : null
    const feature = variant === 'feature'

    if (!text?.slug) return null

    return (
        <Link
            href={`/texts/${text.slug}`}
            className={cn('group block', feature && 'md:grid md:grid-cols-12 md:gap-10 md:items-center')}
        >
            <div className={cn('relative aspect-[4/3] overflow-hidden bg-charcoal/5', feature && 'md:col-span-7')}>
                {image && (
                    <Image
                        src={urlFor(image).width(feature ? 1600 : 1000).height(feature ? 1200 : 750).fit('crop').auto('format').url()}
                        alt={image.alt || ''}
                        fill
                        sizes={feature ? '(max-width: 768px) 100vw, 58vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                        placeholder={image.asset?.metadata?.lqip ? 'blur' : 'empty'}
                        blurDataURL={image.asset?.metadata?.lqip}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                )}
            </div>
            <div className={cn('mt-5', feature && 'md:col-span-5 md:mt-0')}>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                    {typeLabel && <span className="font-bold uppercase tracking-[0.14em] text-ochre-dark">{typeLabel}</span>}
                    {text.publishedAt && (
                        <time dateTime={text.publishedAt} className="text-umber">
                            {formatTextDate(text.publishedAt, locale)}
                        </time>
                    )}
                </p>
                <Heading
                    className={cn(
                        'mt-3 font-bold leading-snug tracking-tight text-charcoal decoration-1 underline-offset-4 group-hover:underline',
                        feature ? 'text-3xl md:text-5xl md:leading-[1.08]' : 'text-xl md:text-2xl'
                    )}
                >
                    {title}
                </Heading>
                {authors && <p className="mt-2 text-sm text-umber">{authors}</p>}
                {standfirst && (
                    <p className={cn('mt-3 font-normal text-charcoal leading-relaxed', feature ? 'text-lg' : 'text-base line-clamp-3')}>
                        {standfirst}
                    </p>
                )}
            </div>
        </Link>
    )
}
