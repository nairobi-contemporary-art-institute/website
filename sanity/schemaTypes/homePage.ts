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
                                    description: 'Recommended size: 2500px × 1500px. High-impact image for the homepage hero. Ensure the source is high quality.',
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
                                    name: 'intelligentContrast',
                                    title: 'Intelligent Contrast',
                                    type: 'boolean',
                                    description: 'Automatically set the text color to the complimentary color of the background. Note: Overridden by "Force Black Text".',
                                    initialValue: false
                                }),
                                defineField({
                                    name: 'forceBlackText',
                                    title: 'Force Black Text',
                                    type: 'boolean',
                                    description: 'Manually force all text content to be black. This takes precedence over "Intelligent Contrast".',
                                    initialValue: false
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
                                    title: 'Subtitle',
                                    type: 'internationalizedArrayString',
                                    description: 'Optional short description below the title.'
                                }),
                                defineField({
                                    name: 'description',
                                    title: 'Text Block (Rich Text)',
                                    type: 'internationalizedArrayBlockContent',
                                    description: 'A more detailed text area for the slide content.'
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
                                    name: 'layout',
                                    title: 'Layout Style',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Auto (Based on image hotspot)', value: 'auto' },
                                            { title: 'Split (Text Left / Image Right)', value: 'split-left' },
                                            { title: 'Split (Text Right / Image Left)', value: 'split-right' },
                                            { title: 'Centered Overlay', value: 'centered' }
                                        ],
                                        layout: 'radio'
                                    },
                                    initialValue: 'auto'
                                }),
                                defineField({
                                    name: 'contentPosition',
                                    title: 'Content Alignment',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Left', value: 'left' },
                                            { title: 'Center', value: 'center' },
                                            { title: 'Right', value: 'right' }
                                        ],
                                        layout: 'radio'
                                    },
                                    initialValue: 'left',
                                    description: 'Horizontal position of the text block.'
                                }),
                                defineField({
                                    name: 'contentWidth',
                                    title: 'Content Width (%)',
                                    type: 'number',
                                    initialValue: 50,
                                    validation: (Rule) => Rule.min(20).max(100),
                                    description: 'Width of the text section area.'
                                }),
                                defineField({
                                    name: 'imageAlignment',
                                    title: 'Image Alignment',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Left', value: 'left' },
                                            { title: 'Center', value: 'center' },
                                            { title: 'Right', value: 'right' }
                                        ],
                                        layout: 'radio'
                                    },
                                    initialValue: 'center',
                                    hidden: ({ parent }) => parent?.layout === 'auto'
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
            name: 'announcement',
            title: 'Announcement Banner',
            type: 'object',
            description: 'A prominent announcement section displayed directly below the hero.',
            fields: [
                defineField({
                    name: 'enabled',
                    title: 'Enable Announcement',
                    type: 'boolean',
                    initialValue: false,
                    description: 'Toggle the announcement banner on or off.'
                }),
                defineField({
                    name: 'preHeading',
                    title: 'Pre-Heading',
                    type: 'internationalizedArrayString',
                    description: 'Small label above the headline, e.g. "ANNOUNCEMENT".'
                }),
                defineField({
                    name: 'heading',
                    title: 'Heading',
                    type: 'internationalizedArrayString',
                    description: 'Main announcement headline.'
                }),
                defineField({
                    name: 'briefText',
                    title: 'Brief Text',
                    type: 'internationalizedArrayBlockContent',
                    description: 'A short summary paragraph shown inline.'
                }),
                defineField({
                    name: 'ctaLabel',
                    title: 'CTA Button Label',
                    type: 'internationalizedArrayString',
                    description: 'Text for the call-to-action link, e.g. "Learn More".'
                }),
                defineField({
                    name: 'ctaUrl',
                    title: 'CTA URL',
                    type: 'url',
                    description: 'External link the CTA button points to.',
                    validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https'] })
                }),
                defineField({
                    name: 'logo',
                    title: 'Partner Logo',
                    type: 'image',
                    description: 'Optional partner or event logo (e.g. La Biennale di Venezia).',
                    options: { hotspot: false }
                }),
                defineField({
                    name: 'backgroundImage',
                    title: 'Background Image',
                    type: 'image',
                    description: 'Recommended size: 2000px × 800px. Optimized for the announcement banner backdrop.',
                    options: { hotspot: true }
                }),
                defineField({
                    name: 'exploreMore',
                    title: 'Explore More Section',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Section Title',
                            type: 'internationalizedArrayString',
                            initialValue: [{ _key: 'en', value: 'Explore More' }]
                        }),
                        defineField({
                            name: 'cards',
                            title: 'CTA Cards',
                            type: 'array',
                            validation: (Rule) => Rule.max(3),
                            of: [{
                                type: 'object',
                                name: 'ctaCard',
                                fields: [
                                    { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
                                    { name: 'description', title: 'Description', type: 'internationalizedArrayString' },
                                    { name: 'buttonText', title: 'Button Text', type: 'internationalizedArrayString' },
                                    { name: 'url', title: 'URL', type: 'string' },
                                    { 
                                        name: 'style', 
                                        title: 'Style', 
                                        type: 'string', 
                                        options: { list: ['primary', 'secondary'], layout: 'radio' },
                                        initialValue: 'primary'
                                    },
                                    {
                                        name: 'state',
                                        title: 'State',
                                        type: 'string',
                                        options: { list: ['active', 'comingSoon'], layout: 'radio' },
                                        initialValue: 'active'
                                    }
                                ]
                            }]
                        }),
                        defineField({
                            name: 'secondaryCta',
                            title: 'Secondary CTA (Mailing List)',
                            type: 'object',
                            fields: [
                                { name: 'text', title: 'Text', type: 'internationalizedArrayString' },
                                { name: 'url', title: 'URL', type: 'string' }
                            ]
                        })
                    ]
                }),
                defineField({
                    name: 'pressRelease',
                    title: 'Full Press Release',
                    type: 'internationalizedArrayBlockContent',
                    description: 'Full press release text, shown inside the expandable accordion.'
                }),
                defineField({
                    name: 'accordionLabel',
                    title: 'Accordion Label',
                    type: 'internationalizedArrayString',
                    description: 'Label for the accordion toggle, e.g. "Read Full Press Release".'
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
                        { 
                            name: 'image', 
                            title: 'Card Image', 
                            description: 'Recommended size: 1200px × 1200px (1:1). High-quality square crop for the right-column scrolling cards.',
                            type: 'image', 
                            options: { hotspot: true } 
                        },
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
                defineField({ name: 'descriptionRich', title: 'Description', type: 'internationalizedArrayBlockContent' }),
                defineField({ 
                    name: 'featuredItems', 
                    title: 'Featured Artworks', 
                    type: 'array', 
                    of: [{ type: 'reference', to: [{ type: 'collectionItem' }] }],
                    description: 'Select specific artworks to highlight. If left empty, the latest 12 items from the collection will be shown.'
                }),
            ]
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Home Page' }
        }
    },
})
