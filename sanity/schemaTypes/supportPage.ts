import { defineField, defineType } from 'sanity'
import { HeartIcon } from '@sanity/icons'

export const supportPage = defineType({
    name: 'supportPage',
    title: 'Support Page',
    type: 'document',
    icon: HeartIcon,
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
                defineField({
                    name: 'image',
                    title: 'Background Image',
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
        }),
        defineField({
            name: 'tiers',
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
                    fields: [
                        { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                        { name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' },
                        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
                        {
                            name: 'layout',
                            title: 'Layout',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Standard', value: 'standard' },
                                    { title: 'Split', value: 'split' }
                                ]
                            }
                        }
                    ]
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
        prepare() {
            return { title: 'Support Page' }
        }
    }
})
