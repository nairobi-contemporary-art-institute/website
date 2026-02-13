import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { cn } from '@/lib/utils'

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
    const title = getLocalizedValue(exhibition.title, locale)
    const artistNames = exhibition.artistNames || []

    if (variant === 'featured') {
        return (
            <Link href={`/${locale}/exhibitions/${exhibition.slug}`} className="group block">
                <div className="relative bg-charcoal/5 mb-8">
                    {(exhibition.listImage?.asset || exhibition.mainImage?.asset) && (
                        <Image
                            src={urlFor(exhibition.listImage || exhibition.mainImage).width(1920).url()}
                            alt={title || 'Exhibition image'}
                            width={1920}
                            height={1080}
                            className="w-full h-auto block"
                        />
                    )}
                </div>
                <div className="flex flex-col gap-4 max-w-4xl">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-charcoal group-hover:text-amber-900 transition-colors uppercase leading-[0.9]">
                        {title || 'Untitled Exhibition'}
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        {artistNames.length > 0 && (
                            <p className="text-lg text-umber/80 font-medium">
                                {artistNames.join(', ')}
                            </p>
                        )}
                        <p className="text-sm text-umber font-mono uppercase tracking-widest">
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
                {exhibition.listImage?.asset || exhibition.mainImage?.asset ? (
                    <Image
                        src={urlFor(exhibition.listImage || exhibition.mainImage).width(800).url()}
                        alt={title || 'Exhibition Image'}
                        width={800}
                        height={1000}
                        className={cn(
                            "w-full h-auto block",
                            variant === 'compact' ? "h-full object-contain" : ""
                        )}
                    />
                ) : (
                    <div className="w-full aspect-[4/5] flex items-center justify-center text-umber/20">
                        No Image
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h2 className={cn(
                    "font-bold text-charcoal group-hover:text-amber-900 transition-colors uppercase tracking-tight",
                    variant === 'compact' ? "text-lg" : "text-xl"
                )}>
                    {title || 'Untitled'}
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
