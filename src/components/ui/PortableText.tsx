import { PortableText as PortableTextReact } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'

const components = {
    types: {
        image: ({ value }: any) => {
            return (
                <div className="my-8 relative aspect-video overflow-hidden rounded-sm bg-charcoal/5">
                    <Image
                        src={urlFor(value).width(1200).url()}
                        alt={value.alt || ''}
                        fill
                        className="object-cover"
                    />
                </div>
            )
        },
    },
    block: {
        h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
        normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    },
}

export function PortableText({ value, locale }: { value: any; locale?: string }) {
    return (
        <div className="prose prose-lg prose-umber max-w-none">
            <PortableTextReact value={value} components={components} />
        </div>
    )
}

// Alias for consistent naming in pages
export const PortableTextComponent = PortableText
