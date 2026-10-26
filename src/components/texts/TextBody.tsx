import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Link } from '@/i18n'
import { internalPath } from '@/lib/texts'
import { TextFigure, type FigureSize } from './TextFigure'

const linkClass =
    'underline decoration-1 underline-offset-[0.2em] decoration-charcoal/50 hover:decoration-charcoal transition-colors'

/**
 * Serializer for a Text body. Separate from components/ui/PortableText on
 * purpose: every block sets its own width (reading column, wide, or full
 * bleed) and type size, so the parent must be full width.
 */
const components: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="measure mb-6">{children}</p>,
        h2: ({ children }) => (
            <h2 className="measure mt-14 mb-5 text-2xl md:text-[1.75rem] font-bold leading-tight tracking-tight">
                {children}
            </h2>
        ),
        h3: ({ children }) => <h3 className="measure mt-10 mb-4 text-xl font-bold leading-snug">{children}</h3>,
        blockquote: ({ children }) => (
            <blockquote className="measure my-8 border-s-2 border-charcoal ps-6 text-umber">{children}</blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="measure mb-6 list-disc ps-6 space-y-2">{children}</ul>,
        number: ({ children }) => <ol className="measure mb-6 list-decimal ps-6 space-y-2">{children}</ol>,
    },
    listItem: ({ children }) => <li className="ps-1">{children}</li>,
    marks: {
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        speaker: ({ children }) => (
            <span className="font-bold uppercase tracking-[0.06em] text-[0.8em]">{children}</span>
        ),
        link: ({ children, value }) => {
            const external = value?.blank !== false
            return (
                <a
                    href={value?.href}
                    className={linkClass}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                    {children}
                </a>
            )
        },
        internalLink: ({ children, value }) => {
            const href = internalPath(value?.type, value?.slug)
            if (!href) return <>{children}</>
            return (
                <Link href={href} className={linkClass}>
                    {children}
                </Link>
            )
        },
    },
    types: {
        textFigure: ({ value }) => (
            <TextFigure
                image={value}
                caption={value?.caption}
                size={(value?.size as FigureSize) || 'column'}
                className="my-10 md:my-14"
            />
        ),
        imagePair: ({ value }) => (
            <div className="measure-wide my-10 md:my-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 items-start">
                {(value?.images || []).map((image: any) => (
                    <TextFigure key={image._key} image={image} caption={image.caption} size="cell" />
                ))}
            </div>
        ),
        pullQuote: ({ value }) => (
            <figure className="measure my-12 md:my-16 border-y border-charcoal/20 py-8">
                <blockquote className="text-2xl md:text-3xl font-light leading-snug text-charcoal">
                    <p>{value?.quote}</p>
                </blockquote>
                {value?.attribution && (
                    <figcaption className="mt-4 text-sm text-umber">{value.attribution}</figcaption>
                )}
            </figure>
        ),
    },
}

export function TextBody({ value }: { value: any[] | undefined }) {
    if (!value?.length) return null
    return (
        <div className="text-reading md:text-reading-lg font-normal text-charcoal">
            <PortableText value={value} components={components} />
        </div>
    )
}
