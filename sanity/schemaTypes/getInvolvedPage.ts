import { defineField, defineType } from 'sanity'

export const getInvolvedPage = defineType({
    name: 'getInvolvedPage',
    title: 'Get Involved Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'intro',
                    title: 'Intro Text',
                    type: 'internationalizedArrayText',
                }),
                defineField({
                    name: 'image',
                    title: 'Hero Image',
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Get Involved Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'section',
                    fields: [
                        defineField({ name: 'title', title: 'Section Title', type: 'internationalizedArrayString' }),
                        defineField({ name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' }),
                        defineField({
                            name: 'cta',
                            title: 'Call to Action (Link)',
                            type: 'object',
                            fields: [
                                { name: 'text', title: 'Button Text', type: 'internationalizedArrayString' },
                                { name: 'url', title: 'URL', type: 'string' },
                            ]
                        }),
                        defineField({ name: 'image', title: 'Section Image', type: 'image', options: { hotspot: true } }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                        },
                        prepare({ title }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                                : 'Section'
                            return { title: titleValue }
                        }
                    }
                }
            ]
        })
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare({ title }) {
            const titleValue = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                : 'Get Involved Page'
            return { title: titleValue }
        }
    },
})
