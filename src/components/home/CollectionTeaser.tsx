'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { getLocalizedValue } from '@/sanity/lib/utils'

import { useTranslations } from 'next-intl'

interface CollectionItem {
  _id: string;
  title: any;
  slug: string;
  creationDate: string;
  mainImage: any;
  artistName: string;
}

interface CollectionTeaserProps {
  data: {
    enabled?: boolean;
    headline?: any;
    description?: any;
    featuredItems?: CollectionItem[];
    exploreCollectionLabel?: string;
    viewFullCollectionLabel?: string;
  };
  locale: string;
}

export function CollectionTeaser({ data, locale }: CollectionTeaserProps) {
  const t = useTranslations('HomePage');
  if (data.enabled === false) return null;

  const items = data.featuredItems || [];
  const headline = getLocalizedValue(data.headline, locale) || data.exploreCollectionLabel || 'Explore Collection';
  const description = getLocalizedValue(data.description, locale);

  return (
    <section className="bg-ivory py-24 border-t border-umber/10 overflow-hidden">
      <div className="container mx-auto px-section-clamp">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Intro Panel */}
          <div className="lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-32 h-fit">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight leading-tight">
              {headline}
            </h2>
            
            {description && (
              <div className="prose prose-sm text-umber/80 leading-relaxed max-w-md">
                <p>{description}</p>
              </div>
            )}
            
            <Link 
              href="/collection" 
              className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-amber-900 mt-4"
            >
              <span className="border-b border-amber-900/40 group-hover:border-amber-900 transition-colors pb-1">
                {data.viewFullCollectionLabel || 'View Full Collection'}
              </span>
              <div className="w-8 h-[1px] bg-amber-900/40 group-hover:w-12 group-hover:bg-amber-900 transition-all duration-300" />
            </Link>
          </div>

          {/* Masonry Grid */}
          <div className="lg:w-2/3">
            <div className="columns-1 md:columns-2 gap-8 [column-fill:_balance] space-y-8">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="break-inside-avoid group"
                >
                  <Link href={`/collection/${item.slug}`} className="block">
                    <div className="relative bg-charcoal/5 mb-4 overflow-hidden aspect-[4/5]">
                      {item.mainImage && (
                        <Image
                          src={urlFor(item.mainImage).width(600).url()}
                          alt={getLocalizedValue(item.title, locale) || 'Artwork'}
                          fill
                          className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-charcoal group-hover:text-amber-900 transition-colors">
                        {getLocalizedValue(item.title, locale)}
                      </h4>
                      <p className="text-xs text-umber/60 italic tracking-wide">
                        {item.artistName}{item.creationDate ? `, ${item.creationDate}` : ''}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* View More Mobile Link */}
            <div className="mt-12 lg:hidden">
              <Link 
                href="/collection" 
                className="flex items-center justify-center w-full py-6 border border-amber-900/20 text-xs font-bold uppercase tracking-widest text-amber-900 hover:bg-amber-900/5 transition-colors"
              >
                + {t('viewFullCollection')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

