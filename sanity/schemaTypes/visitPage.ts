import { defineField, defineType } from 'sanity'

export const visitPage = defineType({
    name: 'visitPage',
    title: 'Visit Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'label',
            title: 'Section Label',
            type: 'internationalizedArrayString',
            description: 'Small text above title (e.g., Plan Your Visit)',
        }),
        defineField({
            name: 'heroImage',
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
        defineField({
            name: 'introText',
            title: 'Intro Text',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'announcement',
            title: 'Announcement Banner',
            type: 'object',
            fields: [
                defineField({ name: 'show', title: 'Show Announcement', type: 'boolean', initialValue: false }),
                defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString' }),
                defineField({ name: 'message', title: 'Message', type: 'internationalizedArrayString' }),
            ]
        }),
        defineField({
            name: 'directions',
            title: 'Directions',
            description: 'Structured transportation information.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'directionMethod',
                    fields: [
                        defineField({ name: 'method', title: 'Method (e.g., By Bus)', type: 'internationalizedArrayString' }),
                        defineField({ name: 'description', title: 'Description', type: 'internationalizedArrayBlockContent' }),
                    ],
                }
            ]
        }),
        defineField({
            name: 'visitorCards',
            title: 'Visitor Information Cards',
            description: 'Cards for Admission, accessibility, etc.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'infoCard',
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString' }),
                        defineField({ name: 'description', title: 'Description', type: 'internationalizedArrayString' }),
                        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'internationalizedArrayString' }),
                        defineField({ name: 'ctaUrl', title: 'CTA URL', type: 'string' }),
                    ],
                }
            ]
        }),
        defineField({
            name: 'sections',
            title: 'Content Sections',
            description: 'Flexible additional sections (e.g., Extended Policies).',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'visitSection',
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString' }),
                        defineField({ name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' }),
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
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return { title: 'Visit Page' }
        }
    },
})
