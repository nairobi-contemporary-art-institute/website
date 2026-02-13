"use client"

import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PortableText } from "@/components/ui/PortableText"

interface EducationCardProps {
    program: any
    locale: string
}

const AUDIENCE_LABELS: Record<string, string> = {
    all: 'All Ages',
    adults: 'Adults',
    youth: 'Youth',
    children: 'Children & Families',
    professionals: 'Professional Development',
}

const TYPE_LABELS: Record<string, string> = {
    workshop: 'Workshop',
    talk: 'Talk',
    tour: 'Tour',
    screening: 'Screening',
    course: 'Course',
    other: 'Resource',
}

export function EducationCard({ program, locale }: EducationCardProps) {
    const title = getLocalizedValue(program.title, locale)
    const audience = AUDIENCE_LABELS[program.audience] || program.audience
    const type = TYPE_LABELS[program.programType] || program.programType

    const startDate = program.startDate ? new Date(program.startDate) : null
    const isUpcoming = startDate && startDate > new Date()

    return (
        <Link
            href={`/${locale}/education/${program.slug}`}
            className="group block h-full flex flex-col"
        >
            <div className="relative aspect-[3/2] bg-stone-100 overflow-hidden mb-6">
                {program.mainImage?.asset ? (
                    <Image
                        src={urlFor(program.mainImage).width(800).height(600).url()}
                        alt={program.mainImage.alt || title || 'Program Image'}
                        fill
                        className="object-cover contrast-[0.95] group-hover:contrast-100"
                        placeholder="blur"
                        blurDataURL={program.mainImage.asset?.metadata?.lqip}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-umber/20 font-mono text-xs">
                        NO IMAGE
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-0 left-0 flex flex-col items-start gap-1 p-3">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest font-medium border border-charcoal/5 shadow-sm">
                        {audience}
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-umber border-b border-umber/10 pb-2">
                    <span>{type}</span>
                    {startDate && (
                        <span>
                            {startDate.toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-medium text-charcoal group-hover:text-umber transition-colors leading-snug">
                    {title}
                </h3>

                {program.excerpt && (
                    <div className="text-sm text-charcoal/60 line-clamp-3 mt-auto leading-relaxed prose-sm">
                        {typeof getLocalizedValue(program.excerpt, locale) === 'string' ? (
                            <p>{getLocalizedValue(program.excerpt, locale) as unknown as string}</p>
                        ) : (
                            <PortableText value={getLocalizedValue(program.excerpt, locale)} locale={locale} />
                        )}
                    </div>
                )}
            </div>
        </Link>
    )
}
