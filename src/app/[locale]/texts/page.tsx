import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import { TEXTS_QUERY } from '@/sanity/lib/queries'
import { Link } from '@/i18n'
import { isTextType, TEXTS_PAGE_SIZE, type TextType } from '@/lib/texts'
import { TextCard } from '@/components/texts/TextCard'
import { TextTypeFilter } from '@/components/texts/TextTypeFilter'

type SearchParams = Promise<{ type?: string | string[]; page?: string | string[] }>

function parseParams(sp: Awaited<SearchParams>) {
    const type: TextType | null = isTextType(sp.type) ? sp.type : null
    const page = Math.max(1, parseInt(String(sp.page ?? '1'), 10) || 1)
    return { type, page }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SearchParams }) {
    const { locale } = await params
    const { type } = parseParams(await searchParams)
    const t = await getTranslations({ locale, namespace: 'Pages.texts' })
    return {
        title: type ? `${t(`types.${type}.plural`)} — ${t('title')}` : t('title'),
        description: t('description'),
    }
}

export default async function TextsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SearchParams }) {
    const { locale } = await params
    const { type, page } = parseParams(await searchParams)
    const t = await getTranslations({ locale, namespace: 'Pages.texts' })

    const start = (page - 1) * TEXTS_PAGE_SIZE
    const { items = [], total = 0 } =
        (await sanityFetch<{ items: any[]; total: number }>({
            query: TEXTS_QUERY,
            params: { type, start, end: start + TEXTS_PAGE_SIZE },
            tags: ['textPiece'],
        })) || {}

    if (page > 1 && items.length === 0) notFound()

    const totalPages = Math.max(1, Math.ceil(total / TEXTS_PAGE_SIZE))
    const [feature, ...rest] = page === 1 ? items : [null, ...items]
    const pageHref = (p: number) => ({
        pathname: '/texts' as const,
        query: { ...(type ? { type } : {}), ...(p > 1 ? { page: String(p) } : {}) },
    })

    return (
        <div className="container mx-auto pt-40 md:pt-52 pb-24 min-h-screen">
            <header className="mb-12 md:mb-16 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-light tracking-tight text-charcoal">{t('title')}</h1>
                <p className="mt-6 text-lg md:text-xl font-normal leading-relaxed text-umber">{t('description')}</p>
            </header>

            <TextTypeFilter active={type} />

            {items.length === 0 ? (
                <p className="py-24 text-center text-umber">{type ? t('noContentForType') : t('noContent')}</p>
            ) : (
                <>
                    {feature && (
                        <div className="mt-12 md:mt-16 pb-12 md:pb-16 border-b border-charcoal/15">
                            <TextCard text={feature} locale={locale} variant="feature" />
                        </div>
                    )}
                    {rest.length > 0 && (
                        <ul className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                            {rest.map((text: any) => (
                                <li key={text._id}>
                                    <TextCard text={text} locale={locale} />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {totalPages > 1 && (
                <nav aria-label={t('pagination')} className="mt-20 flex items-center justify-between border-t border-charcoal/15 pt-6 text-sm">
                    {page > 1 ? (
                        <Link href={pageHref(page - 1)} rel="prev" className="text-charcoal underline underline-offset-4">
                            <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> {t('newer')}
                        </Link>
                    ) : <span />}
                    <span className="text-umber">{t('pageOf', { page, total: totalPages })}</span>
                    {page < totalPages ? (
                        <Link href={pageHref(page + 1)} rel="next" className="text-charcoal underline underline-offset-4">
                            {t('older')} <span aria-hidden="true" className="inline-block rtl:-scale-x-100">→</span>
                        </Link>
                    ) : <span />}
                </nav>
            )}
        </div>
    )
}
