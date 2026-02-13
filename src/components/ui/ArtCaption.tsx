import React from 'react';

interface ArtCaptionProps {
    content?: string;
    className?: string;
}

/**
 * A component that renders art captions with support for basic Markdown formatting:
 * **text** for Bold (Artist Name)
 * *text* for Italics (Title)
 * 
 * It ensures the default style is "normal" (not italicized by default).
 */
export function ArtCaption({ content, className = '' }: ArtCaptionProps) {
    if (!content) return null;

    // Split the content by Markdown bold (**) or italic (*)
    // Regex matches: **bold text** or *italic text*
    // We capture the delimiters to identify the style
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={i} className="font-bold text-charcoal">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return (
                        <em key={i} className="italic text-charcoal">
                            {part.slice(1, -1)}
                        </em>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
}
