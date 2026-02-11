import { getTranslations, getMessages } from 'next-intl/server'
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { Link } from '@/i18n'
import Image from 'next/image'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const messages = await getMessages({ locale }) as Record<string, Record<string, Record<string, string>>>
    return {
        title: messages.Pages.channel.title,
        description: messages.Pages.channel.description
    }
}

export default async function ChannelPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.channel' })
    const posts = await client.fetch(POSTS_QUERY)


    return (
        <div className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-charcoal mb-4">
                    {t('title')}
                </h1>
                <p className="text-xl text-umber/90 mb-8">{t('description')}</p>
                <ResponsiveDivider variant="curved" weight="medium" className="text-umber/20" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {posts.map((post: any) => {
                    const title = getLocalizedValue(post.title, locale)
                    const imageProps = post.mainImage ? urlFor(post.mainImage).width(800).height(500).url() : null

                    return (
                        <Link
                            key={post._id}
                            href={`/channel/${post.slug}`}
                            className="group flex flex-col gap-4"
                        >
                            <div className="aspect-[16/10] bg-charcoal/5 relative overflow-hidden rounded-sm">
                                {imageProps ? (
                                    <Image
                                        src={imageProps}
                                        alt={title || 'Post image'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-umber/20 italic">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {post.tags.slice(0, 3).map((tag: any) => (
                                            <span key={tag._id || Math.random()} className="text-[10px] uppercase tracking-widest text-amber-800/70 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                                {getLocalizedValue(tag.title, locale)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <h2 className="text-xl font-bold text-charcoal group-hover:text-amber-800 transition-colors leading-tight">
                                    {title || 'Untitled'}
                                </h2>
                                <div className="text-xs text-umber/80 flex items-center gap-3 font-medium">
                                    {post.publishedAt && (
                                        <span>{new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    )}
                                    {post.author && (
                                        <>
                                            <span className="text-umber/20">|</span>
                                            <span className="text-charcoal flex items-center gap-1">
                                                {getLocalizedValue(post.author.name, locale)}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {post.excerpt && (
                                    <p className="text-sm text-umber/60 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>

            {posts.length === 0 && (
                <div className="py-20 text-center text-umber/40 italic">
                    No posts found.
                </div>
            )}
        </div>
    )
}
