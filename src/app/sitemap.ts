import { locales } from '@/i18n'
import { client } from '@/sanity/lib/client'
import { SITEMAP_QUERY } from '@/sanity/lib/queries'
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ncai.art'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/visit',
        '/contact',
        '/exhibitions',
        '/artists',
        '/channel',
        '/education',
        '/collection',
        '/support',
    ]

    // 2. Dynamic Routes from Sanity
    const dynamicData = await client.fetch(SITEMAP_QUERY)

    interface SanitySitemapItem {
        _type: 'exhibition' | 'artist' | 'post' | 'program'
        slug: string
        _updatedAt: string
    }

    const dynamicRoutes = (dynamicData as SanitySitemapItem[]).map((item) => {
        let path = ''
        switch (item._type) {
            case 'exhibition': path = `/exhibitions/${item.slug}`; break;
            case 'artist': path = `/artists/${item.slug}`; break;
            case 'post': path = `/channel/${item.slug}`; break;
            case 'program': path = `/education/${item.slug}`; break;
        }
        return {
            path,
            lastModified: item._updatedAt
        }
    }).filter((route) => route.path !== '')

    const allPaths = [
        ...staticRoutes.map(s => ({ path: s, lastModified: undefined as string | undefined })),
        ...dynamicRoutes
    ]

    // 3. Generate for all locales
    const sitemapEntries: MetadataRoute.Sitemap = []

    for (const locale of locales) {
        for (const { path, lastModified } of allPaths) {
            sitemapEntries.push({
                url: `${SITE_URL}/${locale}${path}`,
                lastModified: lastModified || new Date(),
                changeFrequency: path === '' ? 'daily' : 'weekly',
                priority: path === '' ? 1 : 0.7,
            })
        }
    }

    return sitemapEntries
}
