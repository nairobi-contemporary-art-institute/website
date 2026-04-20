import React from 'react'

interface MarkdownTextProps {
    text: string
    className?: string
}

/**
 * A simple markdown parser that handles bold (**text**) and italic (*text*).
 * Designed for light captions without adding a heavy markdown dependency.
 */
export function MarkdownText({ text, className }: MarkdownTextProps) {
    if (!text) return null

    // Split by ** for bold
    const parts = text.split(/(\*\*.*?\*\*)/g)

    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2)
                    // Further split by * for italic inside bold
                    return <strong key={i}>{parseItalic(boldText)}</strong>
                }
                return <span key={i}>{parseItalic(part)}</span>
            })}
        </span>
    )
}

function parseItalic(text: string) {
    // Split by * for italic (using a lookbehind-like approach or simple split)
    // We use a regex that captures *text* but not **
    const parts = text.split(/(\*.*?\*)/g)
    
    return parts.map((part, i) => {
        if (part.startsWith('*') && !part.startsWith('**') && part.endsWith('*') && !part.endsWith('**')) {
            return <em key={i} className="italic">{part.slice(1, -1)}</em>
        }
        return part
    })
}
