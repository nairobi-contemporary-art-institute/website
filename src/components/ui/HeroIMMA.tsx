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

    return (
        <section className={cn("relative w-full h-[55vh] md:h-[70vh] overflow-visible bg-stone-800", className)}>
            {/* Background Image or Neutral Gray Fallback */}
            <div className="absolute inset-0 z-0 overflow-hidden">
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
                {/* Gradient Overlay for text readability (IMMA style dark gradient) */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70 pointer-events-none",
                    !image && "bg-black/30" 
                )} />
            </div>

            {/* Information Tooltip Icon at Bottom Right of Image Section */}
            {image && (image.caption || caption) && (
                <div className="absolute bottom-8 right-8 z-30">
                    <ArtTooltip 
                        content={<ArtCaption content={image.caption || caption} className="text-charcoal" />}
                        align="right"
                    />
                </div>
            )}

            {/* Content Container positioned vertically centered */}
            <div className="relative z-10 w-full px-6 md:px-12 h-full flex flex-col justify-center pt-24 md:pt-32 pointer-events-none">
                <GridSystem unstable_useContainer={false}>
                    <Grid columns={{ sm: 1, md: 12 }} gap={24}>
                        <GridCell column={{ sm: '1 / -1', md: '7 / 13', lg: '7 / 13' }} className="p-0 flex flex-col justify-center pointer-events-auto">
                            <div className="space-y-4 md:space-y-6 max-w-2xl">
                                <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-sans font-medium tracking-tight text-white capitalize leading-[0.85] hero-title text-shadow-sm">
                                    {title}
                                </h1>
                                
                                {headline && (
                                    <p className="text-2xl md:text-4xl text-white font-medium leading-tight tracking-tight max-w-3xl">
                                        {headline}
                                    </p>
                                )}
                                
                                {intro && (
                                    <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                                        {intro}
                                    </p>
                                )}
                            </div>
                        </GridCell>

                        {/* Optional Image Caption aligned to the right or bottom - Hidden on Desktop in favor of the 'i' icon if we have it */}
                        {caption && !image?.caption && (
                            <GridCell column={{ sm: 1, md: 2 }} className="hidden md:flex flex-col justify-end items-end p-0 pointer-events-auto">
                                <p className="text-xs text-white/70 italic text-right mb-2">
                                    {caption}
                                </p>
                            </GridCell>
                        )}
                    </Grid>
                </GridSystem>
            </div>
            {/* Optional children (e.g. sub-navigation) explicitly at the bottom edge */}
            {children && (
                <div className="relative z-20 w-full mt-auto">
                    {children}
                </div>
            )}
        </section>
    );
}
