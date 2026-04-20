'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { useTranslations } from 'next-intl'
import { PortableText } from '@/components/ui/PortableText'
import { ArtTooltip } from '@/components/ui/ArtTooltip'

interface CollectionItem {
  _id: string;
  title: any;
  slug: string;
  creationDate?: string;
  year?: string;
  mainImage?: any;
  image?: any;
  artistName?: string;
  onLoan?: boolean;
  onDisplay?: boolean;
  displayLocation?: any;
  artist?: {
    name: any;
    slug?: string;
  }
}

interface CollectionTeaserProps {
  data: {
    enabled?: boolean;
    headline?: any;
    descriptionRich?: any;
    featuredItems?: CollectionItem[];
    featuredWorks?: CollectionItem[];
    viewFullCollectionLabel?: string;
  };
  locale: string;
}

export function CollectionTeaser({ data, locale }: CollectionTeaserProps) {
  const t = useTranslations('HomePage');
  const tCol = useTranslations('Pages.collection');
  
  const [visibleLimit, setVisibleLimit] = useState(12);
  const [shuffledItems, setShuffledItems] = useState<CollectionItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Combine featuredItems (refs) and featuredWorks (toggle-based)
  const works = data.featuredWorks || [];
  const rawItems = works.length > 0 ? works : (data.featuredItems || []);

  React.useEffect(() => {
    setIsMounted(true);
    // Fisher-Yates shuffle
    const items = [...rawItems];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setShuffledItems(items);
  }, [rawItems]);

  if (data.enabled === false) return null;

  // Use raw items during hydration to match SSR, then switch to shuffled items
  const items = isMounted ? shuffledItems : rawItems;
  
  const displayedItems = items.slice(0, visibleLimit);
  const hasMore = items.length > visibleLimit;

  const headline = getLocalizedValue(data.headline, locale) || 'Explore Collection';
  const description = getLocalizedValue(data.descriptionRich, locale);

  const handleLoadMore = () => {
    setVisibleLimit(prev => Math.min(prev + 12, 24)); // Limit to ~24 on homepage as requested
  };

  return (
    <section className="bg-background-dark py-24 md:py-48 overflow-hidden">
      <div className="container mx-auto px-section-clamp">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 md:mb-32">
          
          {/* Headline Panel */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              {headline}
            </h2>
          </div>
          
          {/* Description Panel */}
          <div className="lg:w-1/2 flex flex-col gap-8 md:pt-4">
            {description && (
              <div className="text-white/80 text-lg md:text-xl leading-relaxed max-w-xl prose-invert">
                <PortableText value={description} locale={locale} />
              </div>
            )}
            
            <Link 
              href="/collection" 
              className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white mt-4"
            >
              <span className="border-b border-white/20 group-hover:border-white transition-colors pb-1">
                {data.viewFullCollectionLabel || 'EXPLORE COLLECTION'}
              </span>
              <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* Masonry / Grid for Artworks */}
        {displayedItems.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-4 gap-8 [column-fill:_balance]">
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item, index) => {
                const itemTitle = getLocalizedValue(item.title, locale) || 'Untitled';
                const artistName = getLocalizedValue(item.artist?.name, locale) || item.artistName || '';
                const date = item.creationDate || item.year || '';
                const image = item.mainImage || item.image;
                const slug = item.slug ? `collection/${item.slug}` : (item.artist?.slug ? `artists/${item.artist.slug}` : '');
                
                const hasStatus = item.onDisplay || item.onLoan;
                const displayLocation = getLocalizedValue(item.displayLocation, locale);

                return (
                  <motion.div
                    key={item._id}
                    layout
                    id={`work-${item._id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: (index % 12) * 0.05 
                    }}
                    whileHover={{ 
                      y: -12,
                      scale: 1.02,
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    className="break-inside-avoid mb-16 group relative"
                  >
                    {/* Status Toggle / Subtle Indicator */}
                    {hasStatus && (
                      <div className="absolute top-4 right-4 z-20">
                        <ArtTooltip 
                          content={
                            <div className="flex flex-col gap-1">
                              {item.onDisplay && (
                                <p className="font-bold flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  {displayLocation ? tCol('onDisplayAt', { location: displayLocation }) : tCol('currentlyOnDisplay')}
                                </p>
                              )}
                              {item.onLoan && (
                                <p className="font-bold flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  {tCol('outOnLoan')}
                                </p>
                              )}
                            </div>
                          }
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white transition-colors cursor-help ring-4 ring-black/40 shadow-lg" />
                          </div>
                        </ArtTooltip>
                      </div>
                    )}

                    <Link href={`/${slug}`} className="block">
                      <div className="relative bg-charcoal/50 mb-6 overflow-hidden shadow-2xl transition-shadow duration-500 group-hover:shadow-white/[0.05]">
                        {image?.asset ? (
                          <div style={{ aspectRatio: image.asset.metadata?.dimensions?.aspectRatio || 1 }}>
                            <Image
                              src={urlFor(image).width(800).url()}
                              alt={itemTitle}
                              width={image.asset.metadata?.dimensions?.width || 800}
                              height={image.asset.metadata?.dimensions?.height || 800}
                              className="w-full h-auto group-hover:scale-105 transition-transform duration-1000 ease-out"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/5] w-full h-full flex items-center justify-center text-white/10 text-[10px] uppercase tracking-widest bg-charcoal">
                            {tCol('noImageAvailable')}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-white/70 transition-colors uppercase tracking-[0.15em]">
                          {itemTitle}
                        </h4>
                        <p className="text-[11px] text-white/40 italic tracking-wider uppercase font-medium">
                          {artistName}{date ? ` / ${date}` : ''}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-20 flex flex-col items-center gap-12">
          {hasMore && visibleLimit < 24 && (
            <button 
              onClick={handleLoadMore}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors border-b border-white/5 hover:border-white pb-2"
            >
              {t('loadMore')}
            </button>
          )}

          {/* Persistent Explore Button at the bottom */}
          <Link 
            href="/collection"
            className="px-12 py-4 border border-white/10 hover:border-white text-[10px] font-black uppercase tracking-[0.5em] text-white transition-all hover:bg-white hover:text-black"
          >
            {data.viewFullCollectionLabel || 'EXPLORE FULL COLLECTION'}
          </Link>
        </div>
      </div>
    </section>
  )
}

