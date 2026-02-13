import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const collectionPage = defineType({
    name: 'collectionPage',
    title: 'Collection Page',
    type: 'document',
    icon: ImagesIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'header',
            title: 'Header Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'description',
                    title: 'Intro Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ],
        }),
        defineField({
            name: 'featuredItems',
            title: 'Featured Collection Items',
            description: 'Optionally highlight specific items at the top of the collection.',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'collectionItem' }] }],
        }),
        defineField({
            name: 'categories',
            title: 'Highlighted Categories',
            description: 'Filter categories for quick access.',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        })
    ],
    preview: {
        prepare() {
            return { title: 'Collection Page' }
        }
    }
})
