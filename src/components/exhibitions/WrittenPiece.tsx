import { PortableText } from "@/components/ui/PortableText";
import { GridSystem, GridRoot as Grid, Cell as GridCell } from "@/components/ui/Grid/Grid";
import { cn } from "@/lib/utils";

interface WrittenPieceProps {
    title?: string;
    content: any;
    author?: string;
    locale: string;
    className?: string;
}

/**
 * A specialized component for rendering essays, reflections, and longer-form written pieces
 * within an exhibition page. Designed with a focus on typography and readability,
 * echoing the "Clinical Luxury" aesthetic.
 */
export function WrittenPiece({ title, content, author, locale, className }: WrittenPieceProps) {
    return (
        <section className={cn("px-6 md:px-12 py-12 bg-[#FDFBF7]", className)}>
            <GridSystem unstable_useContainer={false}>
                <Grid columns={{ sm: 1, md: 12 }}>
                    {/* Aligned with the standard narrative column (right half) */}
                    <GridCell column={{ sm: 1, md: 6 }} className="md:col-start-7">
                        <article className="space-y-8">
                            {title && (
                                <header className="space-y-4">
                                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] text-charcoal">
                                        {title}
                                    </h3>
                                </header>
                            )}
                            
                            <div className="text-base font-serif text-charcoal/90 leading-relaxed">
                                <PortableText value={content} locale={locale} />
                            </div>

                             {author && (
                                <footer className="pt-8 flex justify-end">
                                    <p className="text-sm font-black italic uppercase tracking-[0.2em] text-charcoal/60">
                                        — {author} —
                                    </p>
                                </footer>
                            )}
                        </article>
                    </GridCell>
                </Grid>
            </GridSystem>
        </section>
    );
}
