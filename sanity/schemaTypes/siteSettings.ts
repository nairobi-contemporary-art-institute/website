import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'socialMedia', title: 'Social Media' },
        { name: 'footer', title: 'Footer Links' },
    ],
    fields: [
        defineField({
            name: 'siteTitle',
            title: 'Site Title',
            type: 'internationalizedArrayString',
            group: 'general',
        }),
        defineField({
            name: 'siteDescription',
            title: 'Site Description',
            type: 'internationalizedArrayText',
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
