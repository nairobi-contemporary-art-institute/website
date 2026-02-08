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
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'media',
            title: 'Media (Image or Video)',
            type: 'file',
            options: {
                accept: 'image/*,video/*'
            }
        }),
        defineField({
            name: 'variant',
            title: 'Variant Priority',
            type: 'string',
            options: {
                list: [
                    { title: 'Immersive Only', value: 'immersive' },
                    { title: 'Teaser & Immersive', value: 'teaser' },
                    { title: 'Institutional Only', value: 'institutional' },
                ],
            },
            initialValue: 'immersive',
        }),
    ],
    orderings: [
        {
            title: 'Year Asc',
            name: 'yearAsc',
            by: [
                { field: 'year', direction: 'asc' }
            ]
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'year',
        },
    },
})
