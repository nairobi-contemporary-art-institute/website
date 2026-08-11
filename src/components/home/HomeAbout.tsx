import Image from 'next/image'
import { getLocalizedValue } from '@/sanity/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@/components/ui/PortableText'

interface HomeAboutProps {
  data: {
    enabled?: boolean
    heading?: any
    intro?: any
    subheading?: any
    subBody?: any
    image?: any
  }
  locale: string
}

export function HomeAbout({ data, locale }: HomeAboutProps) {
  if (!data?.enabled) return null

  const heading = getLocalizedValue(data.heading, locale)
  const subheading = getLocalizedValue(data.subheading, locale)
  const intro = getLocalizedValue(data.intro, locale)
  const subBody = getLocalizedValue(data.subBody, locale)
  const hasImage = !!data.image?.asset

  return (
    <section className="bg-white py-24 md:py-32 border-b border-charcoal/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left column: heading + intro + Library & Archive (when image present) */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-charcoal uppercase leading-[0.95]">
                {heading}
              </h2>
            )}
            {intro && (
              <div className="text-charcoal/70 text-lg leading-relaxed prose prose-lg max-w-none">
                <PortableText value={intro} locale={locale} />
              </div>
            )}
            {hasImage && (subheading || subBody) && (
              <div className="flex flex-col gap-4 pt-2">
                {subheading && (
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-normal text-charcoal/40 border-b border-charcoal/10 pb-2">
                    {subheading}
                  </h3>
                )}
                {subBody && (
                  <div className="text-charcoal/70 text-lg leading-relaxed prose prose-lg max-w-none">
                    <PortableText value={subBody} locale={locale} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: image (if present) or Library & Archive text */}
          {hasImage ? (
            <div className="lg:w-1/2">
              <Image
                src={urlFor(data.image).width(900).url()}
                alt={data.image.alt || ''}
                width={data.image.asset?.metadata?.dimensions?.width || 900}
                height={data.image.asset?.metadata?.dimensions?.height || 1200}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder={data.image.asset?.metadata?.lqip ? 'blur' : undefined}
                blurDataURL={data.image.asset?.metadata?.lqip}
              />
            </div>
          ) : (subheading || subBody) ? (
            <div className="lg:w-1/2 flex flex-col gap-6 lg:pt-2">
              {subheading && (
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-normal text-charcoal/40 border-b border-charcoal/10 pb-2">
                  {subheading}
                </h3>
              )}
              {subBody && (
                <div className="text-charcoal/70 text-lg leading-relaxed prose prose-lg max-w-none">
                  <PortableText value={subBody} locale={locale} />
                </div>
              )}
            </div>
          ) : null}

        </div>
      </div>
    </section>
  )
}
