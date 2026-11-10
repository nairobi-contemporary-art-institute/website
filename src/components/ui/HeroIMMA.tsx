import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GridRoot as Grid, GridSystem, Cell as GridCell } from "@/components/ui/Grid/Grid";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { ArtTooltip } from "@/components/ui/ArtTooltip";
import { ArtCaption } from "@/components/ui/ArtCaption";

interface HeroIMMAProps {
    title?: string;
    image?: any;
    headline?: string;
    intro?: string;
    caption?: string;
    className?: string;
    link?: string;
    children?: React.ReactNode;
}

export function HeroIMMA({ title, image, headline, intro, caption, className, link, children }: HeroIMMAProps) {
    const isExternal = link?.startsWith('http') || link?.startsWith('//');
    const imageContent = image && (
        <>
            <Image
                src={urlFor(image).width(1920).url()}
                alt={title || ''}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                loading="eager"
            />
        </>
    );

    // Title block sits on the page background; the photo sits below it, so no text is set over artwork.
    // A headline that only repeats the title (e.g. CMS "About" under "About") is dropped.
    const showHeadline = headline && headline.trim().toLowerCase() !== title?.trim().toLowerCase();

    return (
        <section className={cn("relative w-full bg-ivory page-header-padding", className)}>
            <div className="page-container pb-10 md:pb-14">
                <div className="max-w-3xl space-y-4 md:space-y-6">
                    <h1 className="page-title text-charcoal">
                        {title}
                    </h1>

                    {showHeadline && (
                        <p className="text-2xl md:text-3xl text-charcoal font-medium leading-tight tracking-tight">
                            {headline}
                        </p>
                    )}

                    {intro && (
                        <p className="text-lg md:text-xl text-charcoal/80 max-w-2xl leading-relaxed">
                            {intro}
                        </p>
                    )}
                </div>
            </div>

            {image && (
                <div className="relative w-full h-[45vh] md:h-[60vh] bg-stone-200 overflow-hidden">
                    {link ? (
                        isExternal ? (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative cursor-pointer">
                                {imageContent}
                            </a>
                        ) : (
                            <Link href={link} className="block w-full h-full relative cursor-pointer">
                                {imageContent}
                            </Link>
                        )
                    ) : (
                        imageContent
                    )}

                    {/* Information tooltip icon, bottom right of the photo */}
                    {(image.caption || caption) && (
                        <div className="absolute bottom-6 right-6 z-30">
                            <ArtTooltip
                                content={<ArtCaption content={image.caption || caption} className="text-charcoal" />}
                                align="right"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Optional children (e.g. sub-navigation) */}
            {children}
        </section>
    );
}
