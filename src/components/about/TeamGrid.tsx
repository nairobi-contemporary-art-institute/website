import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { PortableText } from '@/components/ui/PortableText'

interface Person {
    _id: string
    name: any
    slug: string
    roles?: string[]
    image?: any
    bio?: any
}

interface TeamGridProps {
    people: Person[]
    locale: string
}

export function TeamGrid({ people, locale }: TeamGridProps) {
    if (!people || people.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {people.map((person) => {
                const name = getLocalizedValue(person.name, locale)
                const bio = getLocalizedValue(person.bio, locale)

                return (
                    <div key={person._id} className="group space-y-6">
                        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 group-hover:shadow-2xl transition-all duration-700">
                            {person.image ? (
                                <Image
                                    src={urlFor(person.image).width(800).height(1000).url()}
                                    alt={name || 'Team Member'}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL={person.image.asset.metadata?.lqip}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-charcoal/10 font-black text-9xl capitalize transform -rotate-12">
                                    NCAI
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-charcoal tracking-tight group-hover:text-umber transition-colors">
                                    {name}
                                </h3>
                                {person.roles && person.roles.length > 0 && (
                                    <p className="text-xs font-mono capitalize tracking-[0.2em] text-umber/60 mt-2">
                                        {person.roles.join(' / ')}
                                    </p>
                                )}
                            </div>

                            {bio && (
                                <div className="prose prose-sm text-charcoal/70 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                    <PortableText value={bio} locale={locale} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
