'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue, getLocalizedValueAsString } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface ExhibitionCardProps {
    exhibition: any
    locale: string
    variant?: 'default' | 'compact' | 'featured'
}

const formatDateLocal = (dateString: string, locale: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export function ExhibitionCard({ exhibition, locale, variant = 'default' }: ExhibitionCardProps) {
    const t = useTranslations('Pages.exhibitions')
    const title = getLocalizedValueAsString(exhibition.title, locale)
    const artistNames = exhibition.artistNames || []

    const displayImage = exhibition.listImage?.asset
        ? exhibition.listImage
        : exhibition.mainImage?.asset
            ? exhibition.mainImage
            : null

    if (variant === 'featured') {
        return (
            <Link href={`/${locale}/exhibitions/${exhibition.slug}`} className="group block">
                <div className="relative bg-charcoal/5 mb-8">
                    {displayImage && (
                        <Image
                            src={urlFor(displayImage).width(1920).url()}
                            alt={title || t('untitledExhibition')}
                            width={1920}
                            height={1080}
                            className="w-full h-auto block"
                            sizes="100vw"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-4 max-w-4xl">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-charcoal group-hover:text-amber-900 transition-colors capitalize leading-[0.9]">
                        {title || t('untitledExhibition')}
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        {artistNames.length > 0 && (
                            <p className="text-lg text-umber/80 font-medium">
                                {artistNames.join(', ')}
                            </p>
                        )}
                        <p className="text-sm text-umber font-mono capitalize tracking-widest">
                            {formatDateLocal(exhibition.startDate, locale)}
                            {exhibition.endDate && (
                                <>
                                    <span className="mx-2">—</span>
                                    {formatDateLocal(exhibition.endDate, locale)}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link
            href={`/${locale}/exhibitions/${exhibition.slug}`}
            className={cn(
                "group block space-y-4",
                variant === 'compact' ? "flex gap-6 space-y-0 items-start" : ""
            )}
        >
            <div className={cn(
                "relative bg-charcoal/5",
                variant === 'compact' ? "w-32 aspect-square flex-shrink-0" : "w-full"
            )}>
                {displayImage ? (
                    <Image
                        src={urlFor(displayImage).width(800).url()}
                        alt={title || t('untitled')}
                        width={800}
                        height={1000}
                        className={cn(
                            "w-full h-auto block",
                            variant === 'compact' ? "h-full object-contain" : ""
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full aspect-[4/5] flex items-center justify-center text-umber/20">
                        {t('noImage')}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h2 className={cn(
                    "font-bold text-charcoal group-hover:text-amber-900 transition-colors capitalize tracking-tight",
                    variant === 'compact' ? "text-lg" : "text-xl"
                )}>
                    {title || t('untitled')}
                </h2>
                {artistNames.length > 0 && (
                    <p className="text-sm text-umber/60 font-medium">
                        {artistNames.join(', ')}
                    </p>
                )}
                <p className="text-xs text-umber font-mono tracking-tighter">
                    <span>{formatDateLocal(exhibition.startDate, locale)}</span>
                    {exhibition.endDate && (
                        <>
                            <span className="mx-1 opacity-50">—</span>
                            <span>{formatDateLocal(exhibition.endDate, locale)}</span>
                        </>
                    )}
                </p>
            </div>
        </Link>
    )
}
