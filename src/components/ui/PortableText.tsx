import { PortableText as PortableTextReact } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { ArtCaption } from './ArtCaption'

export const components = (locale?: string) => ({
    types: {
        image: ({ value }: any) => {
            if (!value?.asset) return null
            const caption = locale ? getLocalizedValue(value.caption, locale) : null
            return (
                <figure className="my-8 space-y-3">
                    <div className="relative aspect-video overflow-hidden bg-charcoal/5">
                        <Image
                            src={urlFor(value).width(1200).url()}
                            alt={value.alt || ''}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 1200px"
                        />
                    </div>
                    {caption && (
                        <figcaption className="text-sm text-umber/60 leading-relaxed border-l-2 border-umber/10 pl-4 mt-2">
                            <ArtCaption content={caption} />
                        </figcaption>
                    )}
                </figure>
            )
        },
    },
    block: {
        h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-12 mb-6 tracking-tighter">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-10 mb-5 tracking-tight">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-xl font-bold mt-6 mb-3 tracking-tight capitalize tracking-wider">{children}</h4>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-umber/20 pl-6 py-2 my-8 italic text-xl text-umber/80">
                {children}
            </blockquote>
        ),
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = value.blank ? 'noopener noreferrer' : undefined
            const target = value.blank ? '_blank' : undefined
            return (
                <a
                    href={value.href}
                    target={target}
                    rel={rel}
                    className="underline decoration-umber/30 hover:decoration-umber transition-all"
                >
                    {children}
                </a>
            )
        },
    },
})

export function PortableText({ value, locale }: { value: any; locale?: string }) {
    if (!value) return null

    if (typeof value === 'string') {
        return (
            <div className="prose prose-lg prose-umber max-w-none">
                <p>{value}</p>
            </div>
        )
    }

    return (
        <div className="prose prose-lg prose-umber max-w-none">
            <PortableTextReact value={value} components={components(locale)} />
        </div>
    )
}

// Alias for consistent naming in pages
export const PortableTextComponent = PortableText
