import { Suspense } from 'react'
import { getTranslations, getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { ChannelFilter } from '@/components/channel/ChannelFilter'

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
    const posts = await sanityFetch<any[]>({
        query: POSTS_QUERY,
        tags: ['post']
    })

    return (
        <div className="container mx-auto px-section-clamp pt-52 pb-20 min-h-screen">
            <header className="mb-20">
                <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-charcoal mb-4">
                    {t('title')}
                </h1>
                <p className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                    {t('description')}
                </p>
                <div className="h-px w-24 bg-charcoal mt-8" />
            </header>

            <Suspense fallback={<div className="animate-pulse bg-stone-100 h-96 w-full" />}>
                <ChannelFilter posts={posts} locale={locale} />
            </Suspense>
        </div>
    )
}
