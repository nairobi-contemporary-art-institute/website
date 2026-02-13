"use client"

import { getLocalizedValue } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import Link from "next/link"
import { PlayCircle, Headphones, BookOpen } from "lucide-react"
import { PortableText } from "@/components/ui/PortableText"

interface ChannelCardProps {
    post: any
    locale: string
}

export function ChannelCard({ post, locale }: ChannelCardProps) {
    const title = getLocalizedValue(post.title, locale)

    // Determine type label and icon
    const type = post.mediaType || 'article'

    const Icon = {
        video: PlayCircle,
        audio: Headphones,
        article: BookOpen
    }[type as 'video' | 'audio' | 'article'] || BookOpen

    const typeLabel = {
        video: 'Watch',
        audio: 'Listen',
        article: 'Read'
    }[type as 'video' | 'audio' | 'article'] || 'Read'

    return (
        <Link
            href={`/${locale}/channel/${post.slug}`}
            className="group block h-full flex flex-col"
        >
            <div className="relative aspect-[16/10] bg-charcoal/5 overflow-hidden mb-5 group">
                {post.mainImage?.asset ? (
                    <Image
                        src={urlFor(post.mainImage).width(800).height(500).url()}
                        alt={post.mainImage.alt || title || 'Post Image'}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={post.mainImage.asset?.metadata?.lqip}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-umber/20">
                        <Icon className="w-12 h-12 opacity-50" />
                    </div>
                )}

                {/* Media Indicator Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    {(type === 'video' || type === 'audio') && (
                        <div className="w-12 h-12 bg-white/90 backdrop-blur text-charcoal flex items-center justify-center shadow-lg transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                            <Icon className="w-6 h-6 fill-current" />
                        </div>
                    )}
                </div>

                {/* Duration Badge */}
                {post.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] font-mono tracking-wider">
                        {post.duration}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-umber">
                    <Icon className="w-3 h-3" />
                    <span>{typeLabel}</span>
                    {post.publishedAt && (
                        <>
                            <span className="text-umber/30 mx-1">/</span>
                            <span>
                                {new Date(post.publishedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </>
                    )}
                </div>

                <h3 className="text-xl font-bold text-charcoal group-hover:text-amber-800 transition-colors leading-tight">
                    {title}
                </h3>

                {post.excerpt && (
                    <div className="text-sm text-charcoal/60 line-clamp-2 mt-auto leading-relaxed prose-sm">
                        {typeof getLocalizedValue(post.excerpt, locale) === 'string' ? (
                            <p>{getLocalizedValue(post.excerpt, locale) as unknown as string}</p>
                        ) : (
                            <PortableText value={getLocalizedValue(post.excerpt, locale)} locale={locale} />
                        )}
                    </div>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2">
                        {post.tags.slice(0, 3).map((tag: any) => (
                            <span key={tag._id || Math.random()} className="text-[10px] uppercase tracking-widest text-amber-800/60 font-bold bg-amber-50 px-2 py-0.5">
                                {getLocalizedValue(tag.title, locale)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    )
}
