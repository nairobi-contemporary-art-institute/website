import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'navigation', title: 'Navigation' },
        { name: 'socialMedia', title: 'Social Media' },
        { name: 'footer', title: 'Footer Links' },
        { name: 'contact', title: 'Contact Info' },
        { name: 'hours', title: 'Opening Hours' },
    ],
    fields: [
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
            name: 'headerMenu',
            title: 'Header Navigation',
            type: 'array',
            group: 'navigation',
            of: [
                {
                    type: 'object',
                    name: 'navLink',
                    title: 'Navigation Link',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'internationalizedArrayString',
                        }),
                        defineField({
                            name: 'url',
                            title: 'URL',
                            type: 'string',
                            description: 'e.g. /about',
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
        }),
        defineField({
            name: 'siteDescription',
            title: 'Site Description',
            type: 'internationalizedArrayString',
            group: 'general',
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
                                            name: 'url',
                                            title: 'Link URL',
                                            type: 'string',
                                            description: 'Relative path (e.g., /about) or external URL',
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
    ],
    preview: {
        prepare() {
            return { title: 'Site Settings' }
        },
    },
})
