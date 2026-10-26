import { defineField, defineType } from 'sanity'

export const FIGURE_SIZES = [
    { title: 'Column — same width as the text', value: 'column' },
    { title: 'Wide — breaks out of the text column', value: 'wide' },
    { title: 'Full — edge to edge', value: 'full' },
]

/** Shared caption + credit + alt fields for images placed inside a Text body. */
export const figureFields = [
    defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: "Describe the image for people who can't see it. Required.",
        validation: (Rule) => Rule.required().error('Add alt text so the image is accessible.'),
    }),
    defineField({
        name: 'caption',
        title: 'Caption',
        type: 'text',
        rows: 2,
        description: 'Use *asterisks* for italic titles of works, e.g. *Untitled (Blue)*, 2021.',
    }),
    defineField({
        name: 'credit',
        title: 'Credit',
        type: 'string',
        description: 'e.g. "Photo: Jane Doe. Courtesy the artist".',
    }),
]

export const textFigure = defineType({
    name: 'textFigure',
    title: 'Image',
    type: 'image',
    options: { hotspot: true },
    fields: [
        ...figureFields,
        defineField({
            name: 'size',
            title: 'Size',
            type: 'string',
            options: { list: FIGURE_SIZES, layout: 'radio' },
            initialValue: 'column',
        }),
    ],
    preview: {
        select: { caption: 'caption', alt: 'alt', size: 'size', media: 'asset' },
        prepare({ caption, alt, size, media }) {
            return {
                title: caption || alt || 'Image',
                subtitle: `Image · ${size || 'column'}`,
                media,
            }
        },
    },
})
