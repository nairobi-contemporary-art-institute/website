import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
    name: 'aboutPage',
    title: 'About Page',
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
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'image',
                    title: 'Hero Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'internationalizedArrayString',
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Page Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'section',
                    fields: [
                        defineField({ name: 'title', title: 'Section Title', type: 'internationalizedArrayString' }),
                        defineField({ name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' }),
                        defineField({
                            name: 'layout',
                            title: 'Layout',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Standard', value: 'standard' },
                                    { title: 'Split (Text/Image)', value: 'split' },
                                ],
                            },
                            initialValue: 'standard'
                        }),
                        defineField({
                            name: 'image',
                            title: 'Section Image',
                            type: 'image',
                            options: { hotspot: true },
                            fields: [
                                defineField({
                                    name: 'caption',
                                    title: 'Caption',
                                    type: 'internationalizedArrayString',
                                }),
                            ],
                        }),
                    ],
                }
            ]
        }),
        defineField({
            name: 'libraryArchive',
            title: 'Library & Archive Section',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString' }),
                defineField({ name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' }),
                defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'internationalizedArrayString',
                        }),
                    ],
                }),
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
                : 'About Page'
            return { title: titleValue }
        }
    },
})
