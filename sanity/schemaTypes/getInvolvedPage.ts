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
            name: 'membershipTiers',
            title: 'Membership Tiers',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Tier Name', type: 'internationalizedArrayString' },
                        { name: 'price', title: 'Price/Frequency', type: 'internationalizedArrayString', description: 'e.g. 5,000 KES / Year' },
                        { name: 'description', title: 'Tier Description', type: 'internationalizedArrayBlockContent' },
                        {
                            name: 'benefits',
                            title: 'Key Benefits',
                            type: 'array',
                            of: [{ type: 'internationalizedArrayString' }]
                        },
                        { name: 'ctaLabel', title: 'CTA Label', type: 'internationalizedArrayString' },
                        { name: 'ctaUrl', title: 'CTA URL', type: 'string' },
                        { name: 'isFeatured', title: 'Highlight as Featured?', type: 'boolean' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'sections',
            title: 'Additional Sections',
            description: 'Corporate Partners, Legacy Giving, etc.',
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
                            initialValue: 'split'
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
        }),
        defineField({
            name: 'contactSection',
            title: 'Contact / Inquiry Footer',
            type: 'object',
            fields: [
                { name: 'headline', title: 'Headline', type: 'internationalizedArrayString' },
                { name: 'email', title: 'Contact Email', type: 'string' },
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
