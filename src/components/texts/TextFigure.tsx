import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ArtCaption } from '@/components/ui/ArtCaption'
import { cn } from '@/lib/utils'

export type FigureSize = 'column' | 'wide' | 'full' | 'cell'

const LAYOUT: Record<FigureSize, { wrapper: string; caption: string; width: number; sizes: string }> = {
    column: { wrapper: 'measure', caption: '', width: 1280, sizes: '(max-width: 768px) 100vw, 640px' },
    wide: { wrapper: 'measure-wide', caption: '', width: 2048, sizes: '(max-width: 1088px) 100vw, 1024px' },
    // Edge to edge image; caption stays aligned with the reading column
    full: { wrapper: 'w-full', caption: 'measure', width: 2560, sizes: '100vw' },
    // Fills its parent, e.g. one half of an image pair
    cell: { wrapper: 'w-full', caption: '', width: 1280, sizes: '(max-width: 768px) 100vw, 512px' },
}

/** Rendered dimensions after any editor crop, so the image keeps its true aspect ratio. */
function croppedDimensions(image: any): { width: number; height: number } {
    const dims = image?.asset?.metadata?.dimensions
    const width = dims?.width || 1600
    const height = dims?.height || 1200
    const crop = image?.crop
    if (!crop) return { width, height }
    return {
        width: Math.round(width * (1 - (crop.left || 0) - (crop.right || 0))),
        height: Math.round(height * (1 - (crop.top || 0) - (crop.bottom || 0))),
    }
}

/**
 * An image with caption and credit, at its native aspect ratio (never cropped
 * to fit). Used for a Text's lead image and for images in its body.
 */
export function TextFigure({
    image,
    caption,
    size = 'column',
    priority = false,
    className,
}: {
    image: any
    caption?: string
    size?: FigureSize
    priority?: boolean
    className?: string
}) {
    if (!image?.asset) return null
    const layout = LAYOUT[size] || LAYOUT.column
    const { width, height } = croppedDimensions(image)
    const lqip = image.asset?.metadata?.lqip
    const credit = image.credit

    return (
        <figure className={cn(layout.wrapper, className)}>
            <Image
                src={urlFor(image).width(layout.width).quality(90).auto('format').url()}
                alt={image.alt || ''}
                width={width}
                height={height}
                sizes={layout.sizes}
                priority={priority}
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                className="block w-full h-auto bg-charcoal/5"
            />
            {(caption || credit) && (
                <figcaption className={cn('mt-4 text-sm leading-relaxed text-umber', layout.caption)}>
                    {caption && <ArtCaption content={caption} className="block" />}
                    {credit && <span className="block mt-1 text-xs tracking-wide">{credit}</span>}
                </figcaption>
            )}
        </figure>
    )
}
