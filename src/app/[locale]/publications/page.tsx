import { Book } from '@/components/ui/Book';
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider';
import { sanityFetch } from '@/sanity/lib/client';
import { PUBLICATIONS_PAGE_QUERY } from '@/sanity/lib/queries';
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@/components/ui/PortableText';

interface PublicationsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function PublicationsPage({ params }: PublicationsPageProps) {
    const { locale } = await params;

    const data = await sanityFetch<any>({
        query: PUBLICATIONS_PAGE_QUERY,
        tags: ['publicationsPage', 'publication'],
    });

    if (!data) {
        // Fallback to empty state if no data is found
        return (
            <div className="bg-sun-bleached-paper min-h-screen py-24 px-section-clamp md:px-20 text-center">
                <h1 className="text-heading-72 text-charcoal mb-8">NCAI Press</h1>
                <p className="text-copy-20 text-deep-umber/80 italic">Publications coming soon.</p>
            </div>
        );
    }

    const { header, featuredPublications, ctaSection } = data;

    const pageTitle = getLocalizedValue(header?.headline, locale) || 'NCAI Press';
    const pageDescription = getLocalizedValue(header?.description, locale);
    const pageLabel = getLocalizedValue(header?.label, locale) || 'Archives & Publications';

    return (
        <div className="bg-sun-bleached-paper min-h-screen page-header-padding pb-24 px-section-clamp md:px-20">
            <header className="max-w-4xl mb-24">
                <h2 className="text-xs font-bold text-deep-umber/40 capitalize tracking-[0.4em] mb-4">
                    {pageLabel}
                </h2>
                <h1 className="text-heading-72 text-charcoal mb-8">
                    {pageTitle}
                </h1>
                {header?.description && (
                    <div className="text-copy-20 text-deep-umber/80 leading-relaxed max-w-2xl prose-lg italic">
                        {typeof getLocalizedValue(header.description, locale) === 'string' ? (
                            <p>{getLocalizedValue(header.description, locale) as unknown as string}</p>
                        ) : (
                            <PortableText value={getLocalizedValue(header.description, locale)} locale={locale} />
                        )}
                    </div>
                )}
            </header>

            <ResponsiveDivider className="mb-24" />

            <section className="px-section-clamp mb-32">
                <h3 className="text-xs font-bold text-charcoal capitalize tracking-widest mb-16 border-b border-deep-umber/10 pb-4">
                    {locale === 'en' ? 'Recent Imprints' : 'Recent Publications'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    {featuredPublications?.map((pub: any) => (
                        <article key={pub._id} className="space-y-8">
                            <Book
                                title={getLocalizedValue(pub.title, locale) || ''}
                                color={pub.color || '#7DC1C1'}
                                textColor={pub.textColor || 'charcoal'}
                                textured={pub.textured !== false}
                                showTitle={pub.showTitle !== false}
                                showBranding={pub.showBranding !== false}
                                variant={pub.variant || 'default'}
                                coverImage={pub.coverImage?.asset?.url || (pub.coverImage && urlFor(pub.coverImage).width(400).url())}
                            />
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-charcoal capitalize tracking-tighter">
                                    {getLocalizedValue(pub.title, locale)}
                                </h4>
                                <div className="text-[10px] text-deep-umber/60 capitalize tracking-widest italic prose-details">
                                    {typeof getLocalizedValue(pub.details, locale) === 'string' ? (
                                        <p>{getLocalizedValue(pub.details, locale) as unknown as string}</p>
                                    ) : (
                                        <PortableText value={getLocalizedValue(pub.details, locale)} locale={locale} />
                                    )}
                                </div>
                                {pub.description && (
                                    <div className="text-copy-14 text-deep-umber/80 mt-4 leading-relaxed line-clamp-6 prose-sm">
                                        {typeof getLocalizedValue(pub.description, locale) === 'string' ? (
                                            <p>{getLocalizedValue(pub.description, locale) as unknown as string}</p>
                                        ) : (
                                            <PortableText value={getLocalizedValue(pub.description, locale)} locale={locale} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {ctaSection && (
                <section className="px-section-clamp bg-charcoal text-sun-bleached-paper p-12 md:p-24">
                    <div className="max-w-3xl">
                        <h3 className="text-xs font-bold text-sun-bleached-paper/40 capitalize tracking-[0.4em] mb-4">
                            {getLocalizedValue(ctaSection.label, locale)}
                        </h3>
                        <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-8 italic">
                            {getLocalizedValue(ctaSection.headline, locale)}
                        </h2>
                        <div className="text-xl text-sun-bleached-paper/80 mb-12 leading-relaxed prose-invert prose-lg">
                            {typeof getLocalizedValue(ctaSection.description, locale) === 'string' ? (
                                <p>{getLocalizedValue(ctaSection.description, locale) as unknown as string}</p>
                            ) : (
                                <PortableText value={getLocalizedValue(ctaSection.description, locale)} locale={locale} />
                            )}
                        </div>
                        {ctaSection.ctaUrl && (
                            <a
                                href={ctaSection.ctaUrl}
                                className="inline-block border border-sun-bleached-paper/20 px-8 py-4 text-sm capitalize tracking-widest hover:bg-sun-bleached-paper hover:text-charcoal transition-all"
                            >
                                {getLocalizedValue(ctaSection.ctaLabel, locale) || 'Learn More'}
                            </a>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

export async function generateMetadata({ params }: PublicationsPageProps) {
    const { locale } = await params;
    const data = await sanityFetch<any>({
        query: PUBLICATIONS_PAGE_QUERY,
        tags: ['publicationsPage'],
    });

    if (!data) return { title: 'Publications' };

    const title = getLocalizedValue(data.title, locale) || getLocalizedValue(data.header?.headline, locale) || 'Publications';
    const descriptionBlocks = getLocalizedValue<any>(data.header?.description, locale);
    const description = typeof descriptionBlocks === 'string'
        ? descriptionBlocks
        : descriptionBlocks ? portableTextToPlainText(descriptionBlocks) : '';

    return {
        title,
        description,
    };
}
