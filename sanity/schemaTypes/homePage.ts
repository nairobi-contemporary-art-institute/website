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
                    name: 'enabled',
                    title: 'Enable New Hero',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Toggle the new hero section on. When off, the legacy hero displays instead.'
                }),
                defineField({
                    name: 'mode',
                    title: 'Display Mode',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Static (Single Slide)', value: 'static' },
                            { title: 'Carousel (Multiple Slides)', value: 'carousel' }
                        ],
                        layout: 'radio'
                    },
                    initialValue: 'static'
                }),
                defineField({
                    name: 'autoAdvanceSeconds',
                    title: 'Auto-Advance Interval (seconds)',
                    type: 'number',
                    initialValue: 6,
                    description: 'Time between slide transitions in carousel mode.',
                    hidden: ({ parent }) => parent?.mode !== 'carousel'
                }),
                defineField({
                    name: 'slides',
                    title: 'Hero Slides',
                    type: 'array',
                    description: 'Add one or more slides. In static mode only the first slide is shown.',
                    validation: (Rule) => Rule.min(1).max(5),
                    of: [
                        {
                            type: 'object',
                            name: 'heroSlide',
                            fields: [
                                defineField({
                                    name: 'image',
                                    title: 'Image',
                                    type: 'image',
                                    options: { hotspot: true },
                                    fields: [
                                        defineField({
                                            name: 'caption',
                                            title: 'Image Caption',
                                            type: 'internationalizedArrayString',
                                            description: 'Shown in an info tooltip in the bottom-right corner.'
                                        })
                                    ]
                                }),
                                defineField({
                                    name: 'imageSize',
                                    title: 'Image Size',
                                    type: 'object',
                                    description: 'Control the width of the image as a percentage of the section. Height auto-adjusts to maintain the original aspect ratio.',
                                    fields: [
                                        defineField({
                                            name: 'widthPercent',
                                            title: 'Width (%)',
                                            type: 'number',
                                            initialValue: 50,
                                            validation: (Rule) => Rule.min(10).max(100)
                                        })
                                    ]
                                }),
                                defineField({
                                    name: 'gradientColor',
                                    title: 'Background Color',
                                    type: 'color',
                                    description: 'Background color for the section behind the image.',
                                    options: { disableAlpha: false }
                                }),
                                defineField({
                                    name: 'gradientOpacity',
                                    title: 'Background Color Opacity (%)',
                                    type: 'number',
                                    initialValue: 100,
                                    validation: (Rule) => Rule.min(0).max(100),
                                    description: 'Opacity of the background color (100 = fully opaque).'
                                }),
                                defineField({
                                    name: 'preHeading',
                                    title: 'Pre-Heading (Event Type)',
                                    type: 'internationalizedArrayString',
                                    description: 'Small label above the title, e.g. "Current Exhibition", "Upcoming Event".'
                                }),
                                defineField({
                                    name: 'title',
                                    title: 'Title',
                                    type: 'internationalizedArrayString',
                                    description: 'Main headline text. Use \\n in the text to insert a line break on the page.'
                                }),
                                defineField({
                                    name: 'subtitle',
                                    title: 'Subtitle / Description',
                                    type: 'internationalizedArrayString',
                                    description: 'Optional secondary text below the title.'
                                }),
                                defineField({
                                    name: 'date',
                                    title: 'Date Range',
                                    type: 'object',
                                    fields: [
                                        defineField({
                                            name: 'startDate',
                                            title: 'Start Date',
                                            type: 'date'
                                        }),
                                        defineField({
                                            name: 'endDate',
                                            title: 'End Date',
                                            type: 'date'
                                        })
                                    ]
                                }),
                                defineField({
                                    name: 'location',
                                    title: 'Location',
                                    type: 'internationalizedArrayString',
                                    description: 'e.g. "Gallery 1, Main Building"'
                                }),
                                defineField({
                                    name: 'link',
                                    title: 'Link',
                                    type: 'object',
                                    description: 'The entire hero slide links to this destination.',
                                    fields: [
                                        defineField({
                                            name: 'reference',
                                            title: 'Internal Reference',
                                            type: 'reference',
                                            to: [
                                                { type: 'exhibition' },
                                                { type: 'event' },
                                                { type: 'post' },
                                                { type: 'program' }
                                            ]
                                        }),
                                        defineField({
                                            name: 'externalUrl',
                                            title: 'External URL',
                                            type: 'url',
                                            description: 'Used if no internal reference is set.'
                                        })
                                    ]
                                })
                            ],
                            preview: {
                                select: {
                                    title: 'title',
                                    media: 'image',
                                    preHeading: 'preHeading'
                                },
                                prepare({ title, media, preHeading }) {
                                    const titleText = title?.[0]?.value || 'Untitled Slide'
                                    const preHeadingText = preHeading?.[0]?.value || ''
                                    return {
                                        title: titleText,
                                        subtitle: preHeadingText,
                                        media
                                    }
                                }
                            }
                        }
                    ]
                })
            ]
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
            name: 'collectionTeaser',
            title: 'Collection Teaser Settings',
            type: 'object',
            fields: [
                defineField({ name: 'enabled', title: 'Enable Collection Teaser', type: 'boolean', initialValue: true }),
                defineField({ name: 'headline', title: 'Headline', type: 'internationalizedArrayString' }),
                defineField({ name: 'description', title: 'Description', type: 'internationalizedArrayString' }),
                defineField({ 
                    name: 'featuredItems', 
                    title: 'Featured Artworks', 
                    type: 'array', 
                    of: [{ type: 'reference', to: [{ type: 'collectionItem' }] }],
                    description: 'Select specific artworks to highlight. If left empty, the latest 12 items from the collection will be shown.'
                }),
            ]
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
