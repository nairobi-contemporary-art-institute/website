'use client'

import React from 'react'
import Image from 'next/image'
import { getLocalizedValue } from '@/sanity/lib/utils'

interface Partner {
    _id: string
    name: any
    logo: {
        asset: {
            url: string
            metadata?: {
                lqip?: string
            }
        }
    }
    website?: string
}

interface LogoGridProps {
    partners: Partner[]
    locale: string
    title?: string
}

export function LogoGrid({ partners, locale, title }: LogoGridProps) {
    if (!partners || partners.length === 0) return null

    return (
        <section className="py-24 w-full">
            {title && (
                <h2 className="text-2xl font-semibold tracking-tight text-charcoal mb-12">
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl">
                {partners.map((partner) => {
                    const name = getLocalizedValue(partner.name, locale)
                    const content = (
                        <div className="relative group bg-white p-10 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                            {/* Logo Layer */}
                            <div className="relative w-full aspect-[3/2] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-4">
                                <div className="relative w-full h-full max-w-[160px]">
                                    <Image
                                        src={partner.logo.asset.url}
                                        alt={name || 'Partner Logo'}
                                        fill
                                        className="object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                        placeholder={partner.logo.asset.metadata?.lqip ? "blur" : undefined}
                                        blurDataURL={partner.logo.asset.metadata?.lqip}
                                    />
                                </div>
                            </div>

                            {/* Text Layer (Starts below/outside and slides in) */}
                            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center px-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                                <p className="text-[10px] font-bold tracking-[0.2em] capitalize text-charcoal text-center leading-tight max-w-[80%]">
                                    {name}
                                </p>
                            </div>
                        </div>
                    )

                    if (partner.website) {
                        return (
                            <a
                                key={partner._id}
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                {content}
                            </a>
                        )
                    }

                    return (
                        <div key={partner._id}>
                            {content}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
