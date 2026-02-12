import { notFound } from 'next/navigation'
import { client, sanityFetch } from '@/sanity/lib/client'
import { POST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/i18n'
import { PortableTextComponent } from '@/components/ui/PortableText'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { MediaPlayer } from '@/components/channel/MediaPlayer'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const post = await sanityFetch<any>({
        query: POST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`post:${slug}`]
    })

    if (!post) return { title: 'Not Found' }

    const title = getLocalizedValue(post.title, locale)
    const description = post.excerpt || title
    const ogImage = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ogImage ? [{ url: ogImage }] : [],
            type: 'article',
        },
    }
}

export default async function ChannelPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const post = await sanityFetch<any>({
        query: POST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`post:${slug}`]
    })

    if (!post) notFound()

    const title = getLocalizedValue(post.title, locale)
    const imageProps = post.mainImage ? urlFor(post.mainImage).width(1200).height(700).url() : null

    // Media props
    const mediaType = post.mediaType || 'article'
    const videoUrl = post.videoUrl
    const audioUrl = post.audioUrl

    return (
        <article className="container mx-auto px-6 py-20">
            <header className="max-w-3xl mx-auto mb-16 space-y-6 text-center">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-3 justify-center flex-wrap">
                        {post.tags.map((tag: any, i: number) => (
                            <span key={i} className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-bold bg-amber-50 px-3 py-1">
                                {getLocalizedValue(tag.title, locale)}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-charcoal leading-tight">
                    {title || 'Untitled'}
                </h1>

                <div className="flex items-center justify-center gap-6 text-sm text-umber/80">
                    {post.publishedAt && (
                        <span className="font-medium tracking-wide">
                            {new Date(post.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    )}

                    {post.author && (
                        <div className="flex items-center gap-2 pl-6 border-l border-umber/20">
                            {post.author.image && (
                                <div className="relative w-8 h-8 overflow-hidden bg-charcoal/5">
                                    <Image
                                        src={urlFor(post.author.image).width(64).height(64).url()}
                                        alt={getLocalizedValue(post.author.name, locale) || 'Author'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="text-left leading-tight">
                                <span className="block font-bold text-charcoal text-xs uppercase tracking-wider">
                                    {getLocalizedValue(post.author.name, locale)}
                                </span>
                                {post.author.roles && (
                                    <span className="block text-[10px] text-umber/60">
                                        {post.author.roles[0]}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-8">
                    <ResponsiveDivider variant="curved" weight="medium" className="text-umber/10" />
                </div>
            </header>

            {/* Media Player or Main Image */}
            <div className="w-full max-w-4xl mx-auto mb-12">
                {mediaType === 'video' || mediaType === 'audio' ? (
                    <MediaPlayer
                        type={mediaType}
                        url={videoUrl}
                        audioUrl={audioUrl}
                        thumbnail={imageProps || undefined}
                    />
                ) : imageProps ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden shadow-xl">
                        <Image
                            src={imageProps}
                            alt={title || post.mainImage?.alt || 'Channel post image'}
                            fill
                            className="object-cover"
                            priority
                            placeholder="blur"
                            blurDataURL={post.mainImage?.asset?.metadata?.lqip}
                        />
                    </div>
                ) : null}
            </div>

            <div className="prose prose-lg max-w-3xl mx-auto text-charcoal">
                {post.body && <PortableTextComponent value={post.body} locale={locale} />}
            </div>

            <footer className="max-w-3xl mx-auto mt-16">
                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20 mb-8" />
                <Link href="/channel" className="inline-block text-sm font-bold uppercase tracking-widest text-umber/50 hover:text-amber-800 transition-colors">
                    ← Back to Channel
                </Link>
            </footer>
        </article>
    )
}
