import { defineField, defineType } from 'sanity'

export const homePage = defineType({
    name: 'homePage',
    title: 'Home Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
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
                    name: 'subheadline',
                    title: 'Subheadline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'cta',
                    title: 'Call to Action',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'internationalizedArrayString' }),
                        defineField({ name: 'url', title: 'URL', type: 'string' }),
                    ]
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
            name: 'featuredExhibition',
            title: 'Featured Exhibition Override',
            type: 'reference',
            to: [{ type: 'exhibition' }],
            description: 'If left empty, the current exhibition will be automatically selected based on date.'
        }),
        defineField({
            name: 'featuredPost',
            title: 'Featured Post Override',
            type: 'reference',
            to: [{ type: 'post' }],
            description: 'If left empty, the latest post will be automatically selected.'
        }),
        defineField({
            name: 'featuredCards',
            title: 'Featured Hero Cards (Right Column)',
            description: 'Maximum 4 cards to be displayed in the scrolling right column of the hero.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'featuredCard',
                    fields: [
                        { name: 'title', title: 'Card Title', type: 'internationalizedArrayString' },
                        { name: 'subtitle', title: 'Card Subtitle', type: 'internationalizedArrayString' },
                        { name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } },
                        {
                            name: 'link',
                            title: 'Link',
                            type: 'object',
                            fields: [
                                {
                                    name: 'reference',
                                    title: 'Reference',
                                    type: 'reference',
                                    to: [
                                        { type: 'exhibition' },
                                        { type: 'post' },
                                        { type: 'program' },
                                        { type: 'event' },
                                        { type: 'artist' }
                                    ]
                                },
                                { name: 'externalUrl', title: 'External URL', type: 'url' }
                            ]
                        }
                    ]
                }
            ],
            validation: (Rule) => Rule.max(4)
        }),
        defineField({
            name: 'timelineTeaser',
            title: 'Timeline Teaser Settings',
            type: 'object',
            fields: [
                defineField({ name: 'show', title: 'Show Timeline Teaser', type: 'boolean', initialValue: true }),
                defineField({ name: 'headline', title: 'Headline', type: 'internationalizedArrayString' }),
            ]
        })
    ],
    preview: {
        prepare() {
            return { title: 'Home Page' }
        }
    },
})
