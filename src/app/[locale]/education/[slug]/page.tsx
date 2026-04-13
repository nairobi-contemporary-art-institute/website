import { client, sanityFetch } from "@/sanity/lib/client"
import { PROGRAM_BY_SLUG_QUERY } from "@/sanity/lib/queries"
import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import { notFound } from "next/navigation"
import { PortableTextComponent } from "@/components/ui/PortableText"
import { portableTextToPlainText } from "@/sanity/lib/utils"
import Link from "next/link"
import { ResourceList } from "@/components/education/ResourceList"
import { LogoGrid } from "@/components/ui/LogoGrid"

// Ensure dynamic rendering
// export const revalidate = 60

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

const TYPE_LABELS: Record<string, string> = {
    workshop: 'Workshop',
    talk: 'Talk',
    tour: 'Tour',
    screening: 'Screening',
    course: 'Course',
    other: 'Resource',
}

const AUDIENCE_LABELS: Record<string, string> = {
    all: 'All Ages',
    ujuzi: 'UJUZI (Professionals)',
    youth: 'Schools & Youth',
    children: 'Children & Families',
    adults: 'Adults & Public',
}
import { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    const program = await sanityFetch<any>({
        query: PROGRAM_BY_SLUG_QUERY,
        params: { slug },
        tags: [`program:${slug}`]
    })

    if (!program) {
        return {}
    }

    const title = getLocalizedValue(program.title, locale)
    const descriptionBlocks = getLocalizedValue<any>(program.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : 'Education program at NCAI')

    const ogImage = program.mainImage ? urlFor(program.mainImage).width(1200).height(630).url() : undefined

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: ogImage ? [{ url: ogImage }] : [],
        },
    }
}

export default async function ProgramPage({ params }: Props) {
    const { locale, slug } = await params
    const program = await sanityFetch<any>({
        query: PROGRAM_BY_SLUG_QUERY,
        params: { slug },
        tags: [`program:${slug}`]
    })

    if (!program) {
        notFound()
    }

    const title = getLocalizedValue(program.title, locale)
    const description = getLocalizedValue(program.description, locale) || []

    // Fallback for description if it's empty (e.g. legacy data)
    // If description is array of blocks, it should have _type: block. 
    // If it's empty array, PortableText handles it.

    const typeLabel = TYPE_LABELS[program.programType] || program.programType
    const audienceLabel = AUDIENCE_LABELS[program.audience] || program.audience

    const startDate = program.startDate ? new Date(program.startDate) : null
    const endDate = program.endDate ? new Date(program.endDate) : null

    const isUpcoming = !startDate || (startDate && startDate >= new Date()) || (endDate && endDate >= new Date())

    return (
        <div className="container mx-auto px-section-clamp py-20 min-h-screen bg-stone-50/30">
            <Link
                href={`/${locale}/education`}
                className="inline-flex items-center gap-2 text-xs font-mono capitalize tracking-widest text-umber hover:text-charcoal mb-12 transition-colors"
            >
                ← Back to Education
            </Link>

            <div className="max-w-6xl mx-auto">
                <header className="mb-16 border-b border-charcoal/10 pb-12">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono capitalize tracking-widest text-umber mb-6">
                        <span className="px-2 py-1 bg-umber/10">{typeLabel}</span>
                        <span className="px-2 py-1 bg-stone-200 text-stone-600">{audienceLabel}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter text-charcoal mb-8 leading-[0.95]">
                        {title}
                    </h1>

                    {startDate && (
                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-lg text-charcoal/80">
                            <div className="flex items-start gap-4">
                                <span className="font-mono text-xs capitalize tracking-widest text-umber mt-1.5 w-16">Dates</span>
                                <div>
                                    <p className="font-medium">
                                        {startDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        {endDate && ` — ${endDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24">
                    {/* Main Content */}
                    <article className="space-y-12">
                        {program.mainImage && (
                            <div className="relative aspect-[16/9] w-full bg-stone-200 overflow-hidden">
                                    <Image
                                        src={urlFor(program.mainImage).width(1200).height(675).url()}
                                        alt={program.mainImage.alt || title || 'Program Image'}
                                        fill
                                        className="object-cover"
                                        placeholder="blur"
                                        blurDataURL={program.mainImage.asset?.metadata?.lqip}
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                    />
                            </div>
                        )}

                        <PortableTextComponent value={description} />
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-12 lg:pt-0">
                        {/* Registration */}
                        {isUpcoming && program.registrationUrl && (
                            <div className="bg-white p-6 border border-charcoal/5 shadow-sm space-y-4">
                                <h3 className="font-mono text-xs capitalize tracking-widest text-charcoal/60">Participation</h3>
                                <p className="text-sm text-charcoal/80 mb-4">
                                    Register to participate in this program.
                                </p>
                                <a
                                    href={program.registrationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 bg-charcoal text-off-white text-center font-medium tracking-wide hover:bg-umber transition-colors"
                                >
                                    Register Now
                                </a>
                            </div>
                        )}

                        {/* Resources */}
                        {program.resources && program.resources.length > 0 && (
                            <ResourceList resources={program.resources} />
                        )}

                        {/* Educators */}
                        {program.educators && program.educators.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-mono text-xs capitalize tracking-widest text-umber border-b border-umber/20 pb-2">Facilitators</h3>
                                <div className="space-y-6">
                                    {program.educators.map((person: any) => (
                                        <div key={person._id} className="flex items-center gap-4 group">
                                            {person.image && (
                                                <div className="relative w-12 h-12 overflow-hidden bg-stone-100 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                                    <Image
                                                        src={urlFor(person.image).width(100).height(100).url()}
                                                        alt={getLocalizedValue(person.name, locale) || 'Facilitator'}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-charcoal">{getLocalizedValue(person.name, locale)}</p>
                                                {person.roles && (
                                                    <p className="text-xs text-charcoal/60">{person.roles.join(', ')}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {program.tags && program.tags.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-mono text-xs capitalize tracking-widest text-umber border-b border-umber/20 pb-2">Related Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {program.tags.map((tag: any) => (
                                        <span key={tag._id} className="px-2 py-1 bg-stone-100 text-charcoal/70 text-[10px] capitalize tracking-wider">
                                            {getLocalizedValue(tag.title, locale)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {program.relatedExhibitions && program.relatedExhibitions.length > 0 && (
                <section className="px-section-clamp mt-24 pt-24 border-t border-charcoal/10">
                    <h2 className="text-3xl font-light tracking-tight mb-12">Related Exhibition</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {program.relatedExhibitions.map((exh: any) => (
                            <Link
                                key={exh._id}
                                href={`/${locale}/exhibitions/${exh.slug}`}
                                className="group flex gap-6 items-center bg-white border border-charcoal/5 p-4 hover:border-umber/20 transition-all"
                            >
                                <div className="relative w-32 aspect-[4/3] bg-stone-100 flex-shrink-0 overflow-hidden">
                                    {exh.mainImage && (
                                        <Image
                                            src={urlFor(exh.mainImage).width(300).height(225).url()}
                                            alt={getLocalizedValue(exh.title, locale) || 'Exhibition Image'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="128px"
                                        />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] capitalize tracking-widest text-umber font-bold">Exhibition</span>
                                    <h3 className="text-xl font-bold text-charcoal group-hover:text-umber transition-colors">
                                        {getLocalizedValue(exh.title, locale)}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <LogoGrid
                partners={program.partners}
                locale={locale}
                title="Program Partners"
            />
        </div>
    )
}
