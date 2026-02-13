import { defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const educationPage = defineType({
    name: 'educationPage',
    title: 'Education Page',
    type: 'document',
    icon: BookIcon,
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
            name: 'pillars',
            title: 'Educational Pillars',
            description: 'Segments for different audiences (e.g., UJUZI, Schools, Families)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Pillar Title',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Pillar Description',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'image',
                            title: 'Pillar Image',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'audienceTag',
                            title: 'Audience Tag',
                            description: 'Matches the target audience field in Program documents to filter results',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'All Ages', value: 'all' },
                                    { title: 'Adults', value: 'adults' },
                                    { title: 'Youth', value: 'youth' },
                                    { title: 'Children', value: 'children' },
                                    { title: 'Professionals', value: 'professionals' },
                                ],
                            },
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title.0.value',
                            media: 'image',
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'featuredPrograms',
            title: 'Featured Programs',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'program' }] }],
        }),
    ],
})
