import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'entranceAnimation', title: 'Entrance Animation' },
        { name: 'navigation', title: 'Navigation' },
        { name: 'socialMedia', title: 'Social Media' },
        { name: 'footer', title: 'Footer Links' },
        { name: 'contact', title: 'Contact Info' },
        { name: 'hours', title: 'Opening Hours' },
        { name: 'newsletterPopup', title: 'Exit Intent Popup' },
    ],
    fields: [
        defineField({
            name: 'headerStyle',
            title: 'Header Style',
            type: 'string',
            group: 'general',
            description: 'Choose the header design for sub-pages. "Standard" uses the original header, "NCAI-Style" uses the redesigned header.',
            options: {
                list: [
                    { title: 'Standard', value: 'standard' },
                    { title: 'NCAI-Style', value: 'ncai' },
                ],
                layout: 'radio',
            },
            initialValue: 'ncai',
        }),
        defineField({
            name: 'entranceAnimationPool',
            title: 'Entrance Animation Image Pool',
            type: 'array',
            group: 'entranceAnimation',
            description: 'Upload as many images as you like. Three will be selected at random for each visit.',
            of: [{ 
                type: 'image',
                options: { hotspot: true },
                fields: [
                    {
                        name: 'alt',
                        type: 'string',
                        title: 'Alt Text',
                        description: 'Important for SEO and accessibility. Describe what is in the image.',
                        validation: (Rule) => Rule.required(),
                    },
                    {
                        name: 'caption',
                        type: 'string',
                        title: 'Caption',
                        description: 'Internal reference or image credit.',
                    }
                ],
                preview: {
                    select: {
                        title: 'alt',
                        media: 'asset'
                    }
                }
            }],
        }),
        defineField({
            name: 'headerFeaturedImages',
            title: 'Header Featured Images Pool',
            type: 'array',
            group: 'navigation',
            description: 'Upload as many images as you like. Three will be selected at random each time the mega-menu is displayed.',
            of: [{ 
                type: 'image',
                options: { hotspot: true },
                fields: [
                    {
                        name: 'caption',
                        type: 'internationalizedArrayString',
                        title: 'Caption / Information',
                        description: 'This will be displayed in a tooltip when the user interacts with the info icon.',
                    },
                    {
                        name: 'link',
                        type: 'string',
                        title: 'Link',
                        description: 'Optional: The page this image should link to (e.g., /visit or /exhibitions/my-show).',
                    }
                ]
            }],
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            group: 'contact',
            fields: [
                defineField({ name: 'name', title: 'Institution Name', type: 'string', initialValue: 'Nairobi Contemporary Art Institute' }),
                defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
                defineField({ name: 'googleMapsUrl', title: 'Google Maps URL', type: 'url', description: 'Link to the location on Google Maps' }),
                defineField({ name: 'email', title: 'Email', type: 'string' }),
                defineField({ name: 'phone', title: 'Phone', type: 'string' }),
            ]
        }),
        defineField({
            name: 'utilityNav',
            title: 'Utility Navigation',
            type: 'array',
            group: 'navigation',
            description: 'Links for the small top-tier menu (e.g. Shop, Support, Members).',
            of: [
                {
                    type: 'object',
                    name: 'link',
                    title: 'Link',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'internalLink',
                            title: 'Internal Page (Search)',
                            type: 'reference',
                            to: [
                                { type: 'page' },
                                { type: 'exhibition' },
                                { type: 'post' },
                                { type: 'artist' },
                                { type: 'event' },
                                { type: 'program' },
                                { type: 'publication' },
                                { type: 'aboutPage' },
                                { type: 'visitPage' },
                                { type: 'getInvolvedPage' },
                                { type: 'homePage' },
                                { type: 'publicationsPage' },
                                { type: 'educationPage' },
                            ],
                            description: 'Optional: Search for an internal page. If selected, this will override the manual URL below.'
                        }),
                        defineField({
                            name: 'url',
                            title: 'External URL / Manual Path',
                            type: 'string',
                            description: 'Use this for external links or manual paths (e.g. https://instagram.com or /my-path)'
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'url',
                        },
                        prepare({ title, subtitle }) {
                            const labelValue = Array.isArray(title)
                                ? title.find((t: { _key: string, value?: string }) => t._key === 'en')?.value || title[0]?.value
                                : title
                            return { title: labelValue || 'Untitled Link', subtitle }
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'headerMenu',
            title: 'Header Navigation',
            type: 'array',
            group: 'navigation',
            description: 'Define the 5 primary navigation links and their megamenu content.',
            of: [
                {
                    type: 'object',
                    name: 'navItem',
                    title: 'Navigation Item',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'internalLink',
                            title: 'Internal Page (Search)',
                            type: 'reference',
                            to: [
                                { type: 'page' },
                                { type: 'exhibition' },
                                { type: 'post' },
                                { type: 'artist' },
                                { type: 'event' },
                                { type: 'program' },
                                { type: 'publication' },
                                { type: 'aboutPage' },
                                { type: 'visitPage' },
                                { type: 'getInvolvedPage' },
                                { type: 'homePage' },
                                { type: 'publicationsPage' },
                                { type: 'educationPage' },
                            ],
                            description: 'Optional: Search for an internal page. If selected, this will override the manual URL below.'
                        }),
                        defineField({
                            name: 'url',
                            title: 'External URL / Manual Path',
                            type: 'string',
                            description: 'Primary link (e.g. /exhibitions) - used if no internal page is selected.'
                        }),
                        defineField({
                            name: 'columns',
                            title: 'Megamenu Columns',
                            description: 'Optional columns for a megamenu layout.',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'column',
                                    title: 'Column',
                                    fields: [
                                        defineField({
                                            name: 'title',
                                            title: 'Column Heading',
                                            type: 'internationalizedArrayString',
                                        }),
                                        defineField({
                                            name: 'links',
                                            title: 'Links',
                                            type: 'array',
                                            of: [
                                                {
                                                    type: 'object',
                                                    name: 'link',
                                                    title: 'Link',
                                                    fields: [
                                                        defineField({
                                                            name: 'label',
                                                            title: 'Label',
                                                            type: 'internationalizedArrayString',
                                                        }),
                                                        defineField({
                                                            name: 'internalLink',
                                                            title: 'Internal Page (Search)',
                                                            type: 'reference',
                                                            to: [
                                                                { type: 'page' },
                                                                { type: 'exhibition' },
                                                                { type: 'post' },
                                                                { type: 'artist' },
                                                                { type: 'event' },
                                                                { type: 'program' },
                                                                { type: 'publication' },
                                                                { type: 'aboutPage' },
                                                                { type: 'visitPage' },
                                                                { type: 'getInvolvedPage' },
                                                                { type: 'homePage' },
                                                                { type: 'publicationsPage' },
                                                                { type: 'educationPage' },
                                                            ],
                                                            description: 'Optional: Search for an internal page.'
                                                        }),
                                                        defineField({
                                                            name: 'url',
                                                            title: 'External URL / Manual Path',
                                                            type: 'string',
                                                        }),
                                                    ]
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
                                                : title
                                            return { title: titleValue || 'Untitled Column' }
                                        }
                                    }
                                }
                            ]
                        })
                    ],
                    preview: {
                        select: {
                            title: 'label',
                            subtitle: 'url',
                        },
                        prepare({ title, subtitle }) {
                            const labelValue = Array.isArray(title)
                                ? title.find((t: { _key: string, value?: string }) => t._key === 'en')?.value || title[0]?.value
                                : title
                            return { title: labelValue || 'Untitled Link', subtitle }
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'hours',
            title: 'Weekly Opening Hours',
            type: 'object',
            group: 'hours',
            description: 'Set standard opening hours. 24-hour format (e.g. 10:00, 18:00). Leave empty if closed.',
            fields: [
                defineField({ name: 'monday', title: 'Monday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'tuesday', title: 'Tuesday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'wednesday', title: 'Wednesday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'thursday', title: 'Thursday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'friday', title: 'Friday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'saturday', title: 'Saturday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
                defineField({ name: 'sunday', title: 'Sunday', type: 'object', fields: [{ name: 'open', type: 'string' }, { name: 'close', type: 'string' }] }),
            ]
        }),
        defineField({
            name: 'specialStatus',
            title: 'Special Status / Override',
            type: 'object',
            group: 'hours',
            fields: [
                defineField({
                    name: 'isActive',
                    title: 'Active Override',
                    type: 'boolean',
                    description: 'If active, this message will replace the standard hours display.'
                }),
                defineField({
                    name: 'message',
                    title: 'Override Message',
                    type: 'internationalizedArrayString',
                    description: 'E.g., "Closed for installation until Feb 19"'
                })
            ]
        }),
        defineField({
            name: 'siteTitle',
            title: 'Site Title',
            type: 'internationalizedArrayString',
            group: 'general',
            description: 'The main title of the website. Best practice: 50–60 characters. Format: Brand Name | Tagline',
            validation: Rule => Rule.custom((value: any) => {
                if (!value) return true;
                const errors = value
                    .filter((item: any) => item.value && item.value.length > 60)
                    .map((item: any) => `${item._key.toUpperCase()}: Title is too long (${item.value.length}/60 chars)`);
                return errors.length > 0 ? errors[0] : true;
            }).warning()
        }),
        defineField({
            name: 'siteDescription',
            title: 'Site Description',
            type: 'internationalizedArrayText',
            group: 'general',
            description: 'The SEO summary shown in search results. Best practice: 120–155 characters.',
            validation: Rule => Rule.custom((value: any) => {
                if (!value) return true;
                const errors = value
                    .filter((item: any) => item.value && item.value.length > 160)
                    .map((item: any) => `${item._key.toUpperCase()}: Description is quite long (${item.value.length}/160 chars)`);
                return errors.length > 0 ? errors[0] : true;
            }).warning()
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'object',
            group: 'socialMedia',
            fields: [
                defineField({
                    name: 'instagram',
                    title: 'Instagram URL',
                    type: 'url',
                }),
                defineField({
                    name: 'facebook',
                    title: 'Facebook URL',
                    type: 'url',
                }),
                defineField({
                    name: 'youtube',
                    title: 'YouTube URL',
                    type: 'url',
                }),
                defineField({
                    name: 'twitter',
                    title: 'X / Twitter URL',
                    type: 'url',
                }),
            ],
        }),
        defineField({
            name: 'footerCategories',
            title: 'Footer Link Categories',
            type: 'array',
            group: 'footer',
            of: [
                {
                    type: 'object',
                    name: 'footerCategory',
                    title: 'Footer Category',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Category Title',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'links',
                            title: 'Links',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'footerLink',
                                    title: 'Footer Link',
                                    fields: [
                                        defineField({
                                            name: 'label',
                                            title: 'Link Label',
                                            type: 'internationalizedArrayString',
                                        }),
                                        defineField({
                                            name: 'internalLink',
                                            title: 'Internal Page (Search)',
                                            type: 'reference',
                                            to: [
                                                { type: 'page' },
                                                { type: 'exhibition' },
                                                { type: 'post' },
                                                { type: 'artist' },
                                                { type: 'event' },
                                                { type: 'program' },
                                                { type: 'publication' },
                                                { type: 'aboutPage' },
                                                { type: 'visitPage' },
                                                { type: 'getInvolvedPage' },
                                                { type: 'homePage' },
                                                { type: 'publicationsPage' },
                                                { type: 'educationPage' },
                                            ],
                                            description: 'Optional: Search for an internal page.'
                                        }),
                                        defineField({
                                            name: 'url',
                                            title: 'External URL / Manual Path',
                                            type: 'string',
                                            description: 'Relative path (e.g., /about) or external URL - used if no internal page is selected.',
                                        }),
                                    ],
                                    preview: {
                                        select: {
                                            title: 'label',
                                            subtitle: 'url',
                                        },
                                        prepare({ title, subtitle }) {
                                            const labelValue = Array.isArray(title)
                                                ? title.find((t: { _key: string, value?: string }) => t._key === 'en')?.value || title[0]?.value
                                                : title
                                            return { title: labelValue || 'Untitled Link', subtitle }
                                        }
                                    }
                                },
                            ],
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                        },
                        prepare({ title }) {
                            const titleValue = Array.isArray(title)
                                ? title.find((t: { _key: string, value?: string }) => t._key === 'en')?.value || title[0]?.value
                                : title
                            return { title: titleValue || 'Untitled Category' }
                        }
                    }
                },
            ],
        }),
        defineField({
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'internationalizedArrayString',
            group: 'footer',
        }),
        defineField({
            name: 'newsletterPopup',
            title: 'Exit Intent Popup Settings',
            type: 'object',
            group: 'newsletterPopup',
            fields: [
                defineField({
                    name: 'isActive',
                    title: 'Is Active',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Enable or disable the exit intent popup globally.'
                }),
                defineField({
                    name: 'title',
                    title: 'Popup Title',
                    type: 'internationalizedArrayString',
                    initialValue: [{ _key: 'en', value: 'Be the first to know' }],
                }),
                defineField({
                    name: 'description',
                    title: 'Popup Description',
                    type: 'internationalizedArrayText',
                    initialValue: [{ _key: 'en', value: 'To stay up to date about new exhibitions, available works, and artist news, sign up for our newsletter.' }],
                }),
                defineField({
                    name: 'cooldownDays',
                    title: 'Cooldown (Days)',
                    type: 'number',
                    initialValue: 1,
                    description: 'Number of days to hide the popup after a user closes it.'
                })
            ]
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Site Settings' }
        },
    },
})
