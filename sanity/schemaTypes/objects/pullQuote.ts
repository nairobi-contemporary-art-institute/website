import { defineField, defineType } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons'

export const pullQuote = defineType({
    name: 'pullQuote',
    title: 'Pull quote',
    type: 'object',
    icon: BlockquoteIcon,
    description: 'A short passage set large to break up the text.',
    fields: [
        defineField({
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'attribution',
            title: 'Attribution',
            type: 'string',
            description: 'Optional, e.g. the speaker.',
        }),
    ],
    preview: {
        select: { title: 'quote', subtitle: 'attribution' },
    },
})
