
import { defineField, defineType } from 'sanity'

export const timelineEvent = defineType({
    name: 'timelineEvent',
    title: 'Timeline Event',
    type: 'document',
    fields: [
        defineField({
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: (Rule) => Rule.required().min(1900).max(2100),
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'media',
            title: 'Media (Image)',
            type: 'image',
            options: {
                hotspot: true
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'variant',
            title: 'Variant Priority',
            type: 'string',
            options: {
                list: [
                    { title: 'Immersive', value: 'immersive' },
                    { title: 'Standard', value: 'standard' },
                ],
            },
            initialValue: 'standard',
        }),
    ],
    orderings: [
        {
            title: 'Year Ascending',
            name: 'yearAsc',
            by: [
                { field: 'year', direction: 'asc' }
            ]
        },
        {
            title: 'Year Descending',
            name: 'yearDesc',
            by: [
                { field: 'year', direction: 'desc' }
            ]
        }
    ],
    preview: {
        select: {
            title: 'title.0.value',
            subtitle: 'year',
            media: 'media',
        },
    },
})
