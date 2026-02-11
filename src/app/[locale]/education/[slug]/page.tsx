import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PROGRAM_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/i18n'
import { PortableTextComponent } from '@/components/ui/PortableText'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const program = await client.fetch(PROGRAM_BY_SLUG_QUERY, { slug })

    if (!program) return { title: 'Not Found' }

    const title = getLocalizedValue(program.title, locale)
    return {
        title,
        description: title,
    }
}

const TYPE_LABELS: Record<string, string> = {
    workshop: 'Workshop',
    talk: 'Talk',
    tour: 'Tour',
    screening: 'Screening',
    course: 'Course',
    other: 'Other',
}

const AUDIENCE_LABELS: Record<string, string> = {
    all: 'All Ages',
    adults: 'Adults',
    youth: 'Youth',
    children: 'Children',
    professionals: 'Professionals',
}

export default async function EducationDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const program = await client.fetch(PROGRAM_BY_SLUG_QUERY, { slug })

    if (!program) notFound()

    const title = getLocalizedValue(program.title, locale)
    const imageProps = program.mainImage ? urlFor(program.mainImage).width(1200).height(700).url() : null
    const typeLabel = TYPE_LABELS[program.programType] || program.programType
    const audienceLabel = AUDIENCE_LABELS[program.audience] || program.audience

    return (
        <article className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mx-auto mb-12">
                <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-3 inline-block">
                    {typeLabel}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4 leading-tight">
                    {title || 'Untitled'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-umber/90 mb-6">
                    {program.startDate && (
                        <span>
                            {new Date(program.startDate).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                            {program.endDate && program.endDate !== program.startDate && (
                                <> – {new Date(program.endDate).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}</>
                            )}
                        </span>
                    )}
                    {audienceLabel && (
                        <>
                            <span className="text-umber/20">|</span>
                            <span>{audienceLabel}</span>
                        </>
                    )}
                </div>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            {imageProps && (
                <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto mb-12 overflow-hidden rounded-sm">
                    <Image
                        src={imageProps}
                        alt={title || 'Program image'}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg max-w-3xl mx-auto text-charcoal">
                {program.description && <PortableTextComponent value={program.description} locale={locale} />}
            </div>

            <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {program.educators && program.educators.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-umber/50 mb-4 border-b border-umber/10 pb-2">Facilitators</h3>
                        <ul className="space-y-4">
                            {program.educators.map((person: any) => (
                                <li key={person._id} className="flex items-center gap-3">
                                    {person.image && (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-charcoal/5 flex-shrink-0">
                                            <Image
                                                src={urlFor(person.image).width(100).height(100).url()}
                                                alt={getLocalizedValue(person.name, locale) || 'Facilitator'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-sm text-charcoal">{getLocalizedValue(person.name, locale)}</p>
                                        {person.roles && <p className="text-xs text-umber/60">{person.roles[0]}</p>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {program.tags && program.tags.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-umber/50 mb-4 border-b border-umber/10 pb-2">Related Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {program.tags.map((tag: any) => (
                                <span key={tag._id} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-bold bg-amber-50 px-2 py-1 rounded-sm">
                                    {getLocalizedValue(tag.title, locale)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {program.registrationUrl && (
                <div className="max-w-3xl mx-auto mt-12">
                    <a
                        href={program.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-amber-700 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-amber-800 transition-colors"
                    >
                        Register Now
                    </a>
                </div>
            )}

            <footer className="max-w-3xl mx-auto mt-16">
                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20 mb-8" />
                <Link href="/education" className="inline-block text-sm font-bold uppercase tracking-widest text-umber/50 hover:text-amber-800 transition-colors">
                    ← Back to Education
                </Link>
            </footer>
        </article>
    )
}
