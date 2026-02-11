
import { useTranslations } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import Image from 'next/image'
import Link from 'next/link'


// Placeholder for date formatting if not exists
const formatDateLocal = (dateString: string, locale: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages: any = await getMessages({ locale })
    return {
        title: messages.Pages.exhibitions?.title || 'Exhibitions',
    }
}

export default async function ExhibitionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getMessages({ locale }) as any // generic typing fallback
    const exhibitions = await client.fetch(EXHIBITIONS_QUERY)

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t.Pages?.exhibitions?.title || 'Exhibitions'}
                </h1>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
                {exhibitions.map((exhibition: any) => {
                    const title = getLocalizedValue(exhibition.title, locale)
                    const artistNames = exhibition.artistNames || []

                    return (
                        <Link
                            key={exhibition._id}
                            href={`/${locale}/exhibitions/${exhibition.slug}`}
                            className="group block space-y-4"
                        >
                            <div className="aspect-[4/5] relative bg-charcoal/5 overflow-hidden rounded-sm">
                                {exhibition.mainImage ? (
                                    <Image
                                        src={urlFor(exhibition.mainImage).width(800).height(1000).url()}
                                        alt={title || 'Exhibition Image'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-umber/20">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-charcoal group-hover:text-indigo-600 transition-colors">
                                    {title || 'Untitled'}
                                </h2>
                                {artistNames.length > 0 && (
                                    <p className="text-sm text-umber/60 font-medium">
                                        {artistNames.join(', ')}
                                    </p>
                                )}
                                <p className="text-sm text-umber space-x-2">
                                    <span>{formatDateLocal(exhibition.startDate, locale)}</span>
                                    {exhibition.endDate && (
                                        <>
                                            <span>—</span>
                                            <span>{formatDateLocal(exhibition.endDate, locale)}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {exhibitions.length === 0 && (
                <div className="py-20 text-center text-umber/40 italic">
                    No exhibitions found.
                </div>
            )}
        </div>
    )
}
