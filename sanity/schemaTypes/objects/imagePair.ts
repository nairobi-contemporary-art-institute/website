import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { figureFields } from './textFigure'

export const imagePair = defineType({
    name: 'imagePair',
    title: 'Image pair',
    type: 'object',
    icon: ImagesIcon,
    description: 'Two images side by side (stacked on phones).',
    fields: [
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'pairImage',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: figureFields,
                }),
            ],
            validation: (Rule) => Rule.length(2).error('An image pair needs exactly two images.'),
        }),
    ],
    preview: {
        select: { first: 'images.0.asset', caption: 'images.0.caption' },
        prepare({ first, caption }) {
            return { title: 'Image pair', subtitle: caption, media: first }
        },
    },
})
