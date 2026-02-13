import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const eventsPage = defineType({
    name: 'eventsPage',
    title: 'Events Page',
    type: 'document',
    icon: CalendarIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
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
                    title: 'Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ],
        }),
        defineField({
            name: 'featuredEvents',
            title: 'Featured Events',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
        }),
    ],
})
