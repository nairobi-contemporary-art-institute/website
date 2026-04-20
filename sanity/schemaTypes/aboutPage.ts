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
                    description: 'Recommended size: 3000px × 1800px (16:9 or 3:2). Large scale image for the primary About page hero.',
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
                                    { title: 'Dark Highlight (Library/Archive Style)', value: 'dark-highlight' },
                                    { title: 'History Timeline', value: 'history-timeline' },
                                ],
                            },
                            initialValue: 'standard'
                        }),
                        defineField({
                            name: 'image',
                            title: 'Section Image',
                            description: 'Recommended size: 1500px × 1200px. High-quality imagery for modular content sections.',
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
                    preview: {
                        select: {
                            title: 'title',
                            layout: 'layout'
                        },
                        prepare({ title, layout }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                                : 'Section'
                            return {
                                title: titleValue,
                                subtitle: layout ? `Layout: ${layout}` : ''
                            }
                        }
                    }
                }
            ]
        }),
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
