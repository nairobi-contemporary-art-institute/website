import { notFound } from 'next/navigation'
import { client, sanityFetch } from '@/sanity/lib/client'
import { POST_BY_SLUG_QUERY, RELATED_ARTIST_PORTRAITS_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue, getLocalizedValueAsString, portableTextToPlainText } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { Link } from '@/i18n'
import { cn } from '@/lib/utils'
import { PortableTextComponent } from '@/components/ui/PortableText'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { MediaPlayer } from '@/components/channel/MediaPlayer'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { ChannelCard } from '@/components/channel/ChannelCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params
    const post = await sanityFetch<any>({
        query: POST_BY_SLUG_QUERY,
        params: { slug },
        tags: [`post:${slug}`]
    })

    if (!post) return { title: 'Not Found' }

    const title = getLocalizedValue(post.title, locale)
    const excerptBlocks = getLocalizedValue<any[]>(post.excerpt, locale)
    const description = excerptBlocks ? portableTextToPlainText(excerptBlocks) : title
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

    const isArtistPortrait = slug.startsWith('artist-portrait-')

    // Fetch related portraits if it's an artist portrait post
    let otherPortraits = []
    if (isArtistPortrait) {
        otherPortraits = await sanityFetch<any[]>({
            query: RELATED_ARTIST_PORTRAITS_QUERY,
            params: { slug },
            tags: ['post']
        })
    }

    const artist = post.relatedArtist
    const title = getLocalizedValue(post.title, locale)
    const imageProps = post.mainImage ? urlFor(post.mainImage).width(1200).height(700).url() : null

    // Media props
    const mediaType = post.mediaType || 'article'
    const videoUrl = post.videoUrl
    const audioUrl = post.audioUrl
    
    return (
        <>
            <article className={cn("container mx-auto px-section-clamp pb-20", isArtistPortrait ? "pt-32 md:pt-48" : "pt-20")}>
            <header className="max-w-3xl mx-auto mb-16 space-y-6 text-center">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-3 justify-center flex-wrap">
                        {post.tags.map((tag: any, i: number) => (
                            <span key={i} className="text-[10px] capitalize tracking-[0.2em] text-amber-800 font-bold bg-amber-50 px-3 py-1">
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

                    {post.authors && post.authors.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 pl-6 border-l border-umber/20">
                            {post.authors.map((author: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    {author.image && (
                                        <div className="relative w-8 h-8 overflow-hidden bg-charcoal/5 rounded-full">
                                            <Image
                                                src={urlFor(author.image).width(64).height(64).url()}
                                                alt={getLocalizedValue(author.name, locale) || 'Author'}
                                                fill
                                                className="object-cover"
                                                sizes="32px"
                                            />
                                        </div>
                                    )}
                                    <div className="text-left leading-tight">
                                        <span className="block font-bold text-charcoal text-[10px] capitalize tracking-wider">
                                            {getLocalizedValue(author.name, locale)}
                                        </span>
                                        {author.roles && (
                                            <span className="block text-[9px] text-umber/60 capitalize tracking-tight">
                                                {author.roles[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-8">
                    <ResponsiveDivider variant="curved" weight="medium" className="text-umber/10" />
                </div>
            </header>

            {/* Media Player or Main Image */}
            <div className="w-full max-w-4xl mx-auto mb-16 space-y-6">
                {(mediaType === 'video' && videoUrl) || (mediaType === 'audio' && audioUrl) ? (
                    <div className="space-y-4">
                        <MediaPlayer
                            type={mediaType}
                            url={videoUrl}
                            audioUrl={audioUrl}
                            thumbnail={imageProps || undefined}
                        />
                        {(mediaType === 'video' ? post.videoCaption : post.audioCaption) && (
                            <div className="text-sm text-umber/60 leading-relaxed border-l-2 border-umber/10 pl-4 mt-2">
                                <ArtCaption content={getLocalizedValue(mediaType === 'video' ? post.videoCaption : post.audioCaption, locale)} />
                            </div>
                        )}
                    </div>
                ) : imageProps ? (
                    <div className="space-y-4">
                        <div className="relative aspect-[16/9] w-full overflow-hidden shadow-xl">
                            <Image
                                src={imageProps}
                                alt={title || post.mainImage?.alt || 'Channel post image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 896px"
                                priority
                                placeholder="blur"
                                blurDataURL={post.mainImage?.asset?.metadata?.lqip}
                            />
                        </div>
                        {post.mainImage?.caption && (
                            <div className="text-sm text-umber/60 leading-relaxed border-l-2 border-umber/10 pl-4 mt-2">
                                <ArtCaption content={getLocalizedValue(post.mainImage.caption, locale)} />
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            <div className="prose prose-lg max-w-3xl mx-auto text-charcoal">
                {post.body && <PortableTextComponent value={post.body} locale={locale} />}
            </div>

            {/* Artist Detail Section (if linked) */}
            {artist && (
                <section className="max-w-4xl mx-auto mt-24 pt-24 border-t border-umber/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Bio & Link */}
                        <div className="md:col-span-4 space-y-6">
                            {artist.image && (
                                <div className="relative aspect-[4/5] w-full max-w-[280px] grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden shadow-lg border border-umber/5 bg-charcoal/5">
                                    <Image
                                        src={urlFor(artist.image).width(600).height(750).url()}
                                        alt={getLocalizedValueAsString(artist.name, locale) || 'Artist'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        placeholder="blur"
                                        blurDataURL={artist.image.asset?.metadata?.lqip}
                                    />
                                </div>
                            )}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold tracking-tight text-charcoal">
                                    {getLocalizedValue(artist.name, locale)}
                                </h3>
                                <div className="text-sm text-umber/70 leading-relaxed line-clamp-6 prose-sm">
                                    {artist.bio && <PortableTextComponent value={getLocalizedValue(artist.bio, locale)} locale={locale} />}
                                </div>
                                <Link 
                                    href={`/artists/${artist.slug}`}
                                    className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-ochre hover:text-amber-900 transition-colors group"
                                >
                                    Full Artist Profile
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Works Gallery */}
                        <div className="md:col-span-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-umber/40 mb-8">
                                Featured Works
                            </h4>
                            {artist.works && artist.works.length > 0 ? (
                                <div className="grid grid-cols-2 gap-6">
                                    {artist.works.map((work: any) => (
                                        <div key={work._id} className="group">
                                            <Link href={`/artists/${artist.slug}`} className="block">
                                                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/5 mb-3 rounded-sm">
                                                    {work.image && (
                                                        <Image
                                                            src={urlFor(work.image).width(500).height(400).url()}
                                                            alt={getLocalizedValueAsString(work.title, locale) || 'Artwork'}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                            sizes="(max-width: 768px) 45vw, 400px"
                                                            placeholder="blur"
                                                            blurDataURL={work.image.asset?.metadata?.lqip}
                                                        />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-charcoal truncate uppercase tracking-wider group-hover:text-ochre transition-colors">
                                                        {getLocalizedValue(work.title, locale)}
                                                    </p>
                                                    {work.year && (
                                                        <p className="text-[9px] text-umber/50 font-mono">
                                                            {work.year}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-[16/9] bg-charcoal/5 flex items-center justify-center border border-dashed border-umber/10">
                                    <p className="text-[10px] uppercase tracking-widest text-umber/30">Works gallery arriving soon</p>
                                </div>
                            )}
                            
                            {/* Exhibitions List */}
                            {artist.featuredExhibitions && artist.featuredExhibitions.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-umber/5">
                                    <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-umber/30 mb-5">Exhibitions</h5>
                                    <div className="flex flex-wrap gap-3">
                                        {artist.featuredExhibitions.map((exh: any) => (
                                            <Link 
                                                key={exh._id} 
                                                href={`/exhibitions/${exh.slug}`}
                                                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-umber/[0.03] text-umber/60 hover:bg-umber/[0.08] hover:text-charcoal transition-all border border-umber/5 rounded-full"
                                            >
                                                {getLocalizedValue(exh.title, locale)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <footer className="max-w-3xl mx-auto mt-16">
                <ResponsiveDivider variant="straight" weight="thin" className="text-umber/20 mb-8" />
                <Link href="/channel" className="inline-block text-sm font-bold capitalize tracking-widest text-umber/50 hover:text-amber-800 transition-colors">
                    ← Back to Channel
                </Link>
            </footer>

        </article>

        {isArtistPortrait && otherPortraits && otherPortraits.length > 0 && (
            <section className="bg-background-dark text-sun-bleached-paper mt-32 py-24">
                <div className="container mx-auto px-section-clamp">
                    <h2 className="text-2xl font-bold tracking-tighter mb-16 text-white text-center">
                        Other Artist Portraits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {otherPortraits.map((p: any) => (
                            <ChannelCard key={p._id} post={p} locale={locale} variant="dark" />
                        ))}
                    </div>
                </div>
            </section>
        )}
    </>
)
}
