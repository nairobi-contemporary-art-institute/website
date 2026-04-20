import { defineField, defineType } from 'sanity'

export const exhibition = defineType({
    name: 'exhibition',
    title: 'Exhibition',
    type: 'document',
    groups: [
        { name: 'general', title: 'General' },
        { name: 'visual', title: 'Visuals' },
        { name: 'content', title: 'Content Blocks' },
        { name: 'related', title: 'Related Content' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Exhibition Title',
            type: 'internationalizedArrayString',
            group: 'general',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            group: 'general',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
            group: 'general',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            group: 'general',
        }),
        defineField({
            name: 'admission',
            title: 'Admission',
            description: 'e.g., Admission Free, Ticketed, etc.',
            type: 'internationalizedArrayString',
            group: 'general',
        }),
        defineField({
            name: 'bookingUrl',
            title: 'Booking URL',
            description: 'Direct link to ticket booking if applicable.',
            type: 'url',
            group: 'general',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            description: 'e.g., Gallery 1',
            type: 'internationalizedArrayString',
            group: 'general',
        }),
        defineField({
            name: 'enquiryModule',
            title: 'Enquiry Button',
            type: 'object',
            group: 'general',
            fields: [
                defineField({
                    name: 'enabled',
                    title: 'Enable Enquiry Button',
                    type: 'boolean',
                    initialValue: false,
                }),
                defineField({
                    name: 'label',
                    title: 'Button Label',
                    type: 'internationalizedArrayString',
                    description: 'e.g., Enquire, Contact Gallery, etc.',
                    initialValue: [
                        { _key: 'en', value: 'Enquire' },
                        { _key: 'sw', value: 'Uliza' }
                    ],
                }),
                defineField({
                    name: 'url',
                    title: 'Enquiry URL / Email',
                    type: 'string',
                    description: 'Can be a link (https://...) or an email (mailto:info@ncai.art)',
                }),
                defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true,
                }),
            ],
        }),
        defineField({
            name: 'heroLayout',
            title: 'Hero Layout',
            type: 'string',
            group: 'visual',
            options: {
                list: [
                    { title: 'Standard', value: 'standard' },
                    { title: 'Split Style', value: 'split' },
                    { title: 'Full Screen', value: 'fullscreen' },
                ],
                layout: 'radio',
            },
            initialValue: 'standard',
        }),
        defineField({
            name: 'backgroundThemeColor',
            title: 'Background Theme Color',
            description: 'Main background color for the hero and page sections.',
            type: 'color',
            group: 'visual',
        }),
        defineField({
            name: 'heroTextArt',
            title: 'Hero Text Art (Word Art Canvas)',
            type: 'object',
            group: 'visual',
            fields: [
                defineField({
                    name: 'text',
                    title: 'Display Text',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'animationStyle',
                    title: 'Animation Style',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Static Repeat', value: 'static' },
                            { title: 'Horizontal Marquee', value: 'marquee' },
                            { title: 'Vertical Infinite Scroll', value: 'vertical' },
                            { title: 'Diagonal Grid', value: 'diagonal' },
                            { title: 'Pulsing Ghost', value: 'pulsing' },
                        ],
                    },
                    initialValue: 'static',
                }),
                defineField({
                    name: 'textOpacity',
                    title: 'Text Opacity',
                    type: 'number',
                    validation: (Rule) => Rule.min(0).max(1),
                    initialValue: 0.1,
                }),
                defineField({
                    name: 'placement',
                    title: 'Placement',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Full Background', value: 'full' },
                            { title: 'Artwork Side Only', value: 'artwork' },
                        ],
                        layout: 'radio',
                    },
                    initialValue: 'full',
                }),
            ],
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Exhibition Image',
            description: 'Recommended size: 3000px × 1800px (16:9 or 3:2). These images appear in the split-hero and full-screen hero sections. High resolution is required for clinical sharpness.',
            type: 'image',
            group: 'visual',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'For accessibility and SEO. Describe the visual essence for a blind user. Avoid "image of". Tip: For exhibitions, describe the primary artwork shown or the gallery atmosphere.',
                    validation: (Rule) => Rule.required(),
                }),
            ],
        }),
        defineField({
            name: 'listImage',
            title: 'Listing Image (Archive)',
            description: 'Recommended size: 1500px × 1500px (1:1 Square) or 1500px × 1875px (4:5 Portrait). These images appear in the main exhibition archive grid.',
            type: 'image',
            group: 'visual',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'Describe the listing preview image. Keep it concise.',
                }),
            ],
        }),
        defineField({
            name: 'homepageImage',
            title: 'Homepage Specific Image',
            description: 'Recommended size: 2500px × 1500px. High-impact override for the homepage featured section. Ensure the hotspot is set correctly.',
            type: 'image',
            group: 'visual',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'Alt text for the homepage hero version of this exhibition.',
                }),
            ],
        }),
        defineField({
            name: 'introDescription',
            title: 'Intro Description',
            description: 'Short text used in hero or listing',
            type: 'internationalizedArrayBlockContent',
            group: 'general',
        }),
        defineField({
            name: 'description',
            title: 'Exhibition Description',
            type: 'internationalizedArrayBlockContent',
            group: 'content',
        }),
        defineField({
            name: 'artists',
            title: 'Artists',
            type: 'array',
            group: 'general',
            of: [{ type: 'reference', to: [{ type: 'artist' }] }],
        }),
        defineField({
            name: 'curators',
            title: 'Curators',
            type: 'array',
            group: 'general',
            of: [{ type: 'reference', to: [{ type: 'artist' }, { type: 'person' }] }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'general',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery Images',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'caption',
                            type: 'internationalizedArrayString',
                            title: 'Caption',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'galleryLayout',
            title: 'Gallery Layout Style',
            type: 'string',
            group: 'content',
            options: {
                list: [
                    { title: 'Interactive Expanding Accordion', value: 'accordion' },
                    { title: 'Cinematic Horizontal Scroller', value: 'cinema' },
                ],
                layout: 'dropdown',
            },
            initialValue: 'cinema',
            description: 'Cinema is now the default premium style for exhibition galleries.',
        }),
        defineField({
            name: 'partners',
            title: 'Partners & Funders',
            type: 'array',
            group: 'general',
            of: [{ type: 'reference', to: [{ type: 'partner' }] }],
        }),
        defineField({
            name: 'manualRelatedContent',
            title: 'Curated Related Content',
            description: 'Manually select items to show in the "Explore More" section. If empty, it will pull by tags.',
            type: 'array',
            group: 'related',
            of: [
                { type: 'reference', to: [{ type: 'exhibition' }, { type: 'artist' }, { type: 'work' }, { type: 'event' }, { type: 'publication' }] }
            ],
        }),
        defineField({
            name: 'mediaModule',
            title: 'Media Module (e.g., Listen Back)',
            type: 'object',
            group: 'content',
            fields: [
                defineField({
                    name: 'mediaType',
                    title: 'Media Type',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Audio (Soundcloud/Podcast)', value: 'audio' },
                            { title: 'Video (YouTube/Vimeo)', value: 'video' },
                            { title: 'Article/Editorial', value: 'article' },
                        ],
                    },
                    initialValue: 'audio',
                }),
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'label',
                    title: 'Small Label Override',
                    description: 'e.g., "LISTEN BACK" or "SOUNDCLOUD"',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'url',
                    title: 'External URL',
                    type: 'url',
                }),
                defineField({
                    name: 'image',
                    title: 'Background Image',
                    type: 'image',
                    options: { hotspot: true },
                }),
                defineField({
                    name: 'backgroundColor',
                    title: 'Background Color Override',
                    type: 'color',
                }),
            ],
        }),
        defineField({
            name: 'extraSections',
            title: 'Extra Content Sections',
            type: 'array',
            group: 'content',
            description: 'Add optional special sections like "Snapshots from the Archive", extra Media modules, or Editorial blocks.',
            of: [
                {
                    type: 'object',
                    name: 'horizontalGallery',
                    title: 'Horizontal Gallery',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Section Title',
                            type: 'internationalizedArrayString',
                            description: 'e.g., "Snapshots from the Archive"',
                        }),
                        defineField({
                            name: 'layoutType',
                            title: 'Layout Type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Interactive Expanding Accordion (Standard)', value: 'accordion' },
                                    { title: 'Cinematic Horizontal Scroller (Premium)', value: 'cinema' },
                                ],
                                layout: 'dropdown',
                            },
                            initialValue: 'cinema',
                            description: 'Accordion is best for large batches of archive photos. Cinema is best for a curated scrollable viewing experience.',
                        }),
                        defineField({
                            name: 'images',
                            title: 'Images',
                            type: 'array',
                            of: [
                                {
                                    type: 'image',
                                    options: { hotspot: true },
                                    fields: [
                                        {
                                            name: 'alt',
                                            type: 'string',
                                            title: 'Alt Text',
                                            description: 'Describe this specific gallery image. For archival snapshots, mention the scene, era, and identify people.',
                                            validation: (Rule) => Rule.required(),
                                        },
                                        {
                                            name: 'caption',
                                            type: 'internationalizedArrayString',
                                            title: 'Caption',
                                        },
                                    ],
                                },
                            ],
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            media: 'images.0.asset',
                            layoutType: 'layoutType',
                        },
                        prepare({ title, media, layoutType }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                                : title
                            const layoutName = layoutType === 'cinema' ? 'Cinematic' : 'Accordion'
                            return {
                                title: titleValue || 'Untitled Gallery',
                                subtitle: `${layoutName} Gallery`,
                                media,
                            }
                        },
                    },
                },
                {
                    type: 'object',
                    name: 'editorialBlock',
                    title: 'Editorial / Text Block',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Section Title',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'content',
                            title: 'Content',
                            type: 'internationalizedArrayBlockContent',
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                        },
                        prepare({ title }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                                : title
                            return {
                                title: titleValue || 'Untitled Text Block',
                                subtitle: 'Editorial Block',
                            }
                        },
                    },
                },
                {
                    type: 'object',
                    name: 'writtenPiece',
                    title: 'Written Piece (Essay/Reflection)',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'content',
                            title: 'Content',
                            type: 'internationalizedArrayBlockContent',
                        }),
                        defineField({
                            name: 'author',
                            title: 'Author',
                            type: 'internationalizedArrayString',
                            description: 'e.g., bethuel muthee',
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            author: 'author',
                        },
                        prepare({ title, author }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value
                                : title
                            const authorValue = Array.isArray(author)
                                ? author.find((t: any) => t._key === 'en')?.value || author[0]?.value
                                : author
                            return {
                                title: titleValue || 'Untitled Piece',
                                subtitle: authorValue ? `Written Piece by ${authorValue}` : 'Written Piece',
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'showInternalNavigation',
            title: 'Show In-Page Navigation',
            description: 'Adds a sticky bar to jump between Overview, Artists, Media, and Related sections.',
            type: 'boolean',
            group: 'visual',
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title
            return {
                ...selection,
                title: displayTitle,
            }
        },
    },
})
