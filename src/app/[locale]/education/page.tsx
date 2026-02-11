import { getTranslations, getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { PROGRAMS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link } from '@/i18n'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

// Types for this page
interface Program {
    _id: string
    title: { _key: string; value: string }[]
    slug: string
    programType: string
    audience: string
    startDate: string
    endDate: string
    mainImage?: { asset: { _ref: string } }
    tags?: any[]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages = await getMessages({ locale }) as Record<string, Record<string, Record<string, string>>>
    return {
        title: messages.Pages.education.title,
        description: messages.Pages.education.description
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

export default async function EducationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.education' })
    const programs: Program[] = await client.fetch(PROGRAMS_QUERY)

    const now = new Date()
    const upcoming = programs.filter((p) => new Date(p.startDate) >= now)
    const past = programs.filter((p) => new Date(p.startDate) < now)

    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <p className="text-xl text-umber/90 mb-8">{t('description')}</p>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            {upcoming.length > 0 && (
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-charcoal mb-8">Upcoming</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {upcoming.map((prog) => (
                            <div key={prog._id} className="group flex flex-col gap-4">
                                <Link href={`/education/${prog.slug}`} className="block">
                                    <ProgramCard program={prog} locale={locale} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {past.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-charcoal mb-8">Past Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-70">
                        {past.map((prog) => (
                            <div key={prog._id} className="group flex flex-col gap-4">
                                <Link href={`/education/${prog.slug}`} className="block">
                                    <ProgramCard program={prog} locale={locale} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {programs.length === 0 && (
                <div className="py-20 text-center text-umber/40 italic">
                    No programs found.
                </div>
            )}
        </div>
    )
}

function ProgramCard({ program, locale }: { program: Program; locale: string }) {
    const title = getLocalizedValue(program.title, locale)
    const imageProps = program.mainImage ? urlFor(program.mainImage).width(600).height(400).url() : null
    const typeLabel = TYPE_LABELS[program.programType] || program.programType

    return (
        <>
            <div className="aspect-[4/3] bg-charcoal/5 relative overflow-hidden rounded-sm mb-4">
                {imageProps ? (
                    <Image
                        src={imageProps}
                        alt={title || 'Program image'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-umber/20 italic">
                        No Image
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">
                    {typeLabel}
                </span>
                <h3 className="text-lg font-bold text-charcoal group-hover:text-amber-800 transition-colors leading-tight">
                    {title || 'Untitled'}
                </h3>
                <span className="text-sm text-umber/90">
                    {program.startDate && new Date(program.startDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {program.tags && program.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-1">
                        {program.tags.slice(0, 3).map((tag: any) => (
                            <span key={tag._id || Math.random()} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                {getLocalizedValue(tag.title, locale)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
