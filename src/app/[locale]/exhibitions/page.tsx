import { type Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { client, sanityFetch } from '@/sanity/lib/client'
import { EXHIBITIONS_QUERY, EXHIBITIONS_PAGE_QUERY } from '@/sanity/lib/queries'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'
import { PortableTextComponent } from '@/components/ui/PortableText'
import { MuseumCardData } from '@/lib/types/museum-card'
import { WhatsOnClient } from '@/components/whatson/WhatsOnClient'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Pages.exhibitions' })

    const pageData = await sanityFetch<any>({
        query: EXHIBITIONS_PAGE_QUERY,
        tags: ['exhibitionsPage']
    })

    const title = getLocalizedValue(pageData?.title, locale) || t('title')
    const descriptionBlocks = getLocalizedValue<any>(pageData?.header?.description, locale)
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : (descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : t('description'))

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    }
}

export default async function ExhibitionsPage({ params }: Props) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Navigation' })
    const te = await getTranslations({ locale, namespace: 'Pages.exhibitions' })
    const messages = await getMessages({ locale }) as any

    const [exhibitions, pageData] = await Promise.all([
        sanityFetch<any[]>({ query: EXHIBITIONS_QUERY, tags: ['exhibition'] }),
        sanityFetch<any>({ query: EXHIBITIONS_PAGE_QUERY, tags: ['exhibitionsPage'] })
    ])

    const items: MuseumCardData[] = (exhibitions || []).map((exh: any): MuseumCardData => ({
        id: exh._id || exh.slug,
        href: `/exhibitions/${exh.slug}`,
        label: 'Exhibitions',
        title: getLocalizedValue(exh.title, locale) || 'Untitled',
        date: exh.startDate ? new Date(exh.startDate).getFullYear().toString() : '',
        image: exh.listImage || exh.homepageImage || exh.mainImage,
        tags: ['Exhibitions'],
        rawStartDate: exh.startDate,
        rawEndDate: exh.endDate,
        backgroundColor: '#1a1a1a'
    }))

    const header = pageData?.header
    const headline = getLocalizedValue(header?.headline, locale) || t('exhibitions')

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="container mx-auto px-section-clamp page-header-padding pb-12">
                <header className="max-w-4xl space-y-8">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-charcoal capitalize leading-[0.85]">
                        {headline}
                    </h1>
                    {header?.description && (
                        <div className="text-xl md:text-2xl text-umber/80 font-light max-w-2xl leading-relaxed">
                            <PortableTextComponent value={getLocalizedValue(header.description, locale)} />
                        </div>
                    )}
                </header>
            </div>
            
            <WhatsOnClient 
                items={items}
                locale={locale}
                categories={["All", "Exhibitions"]}
                noticeBarSettings={pageData?.noticeBar}
            />
        </div>
    )
}
