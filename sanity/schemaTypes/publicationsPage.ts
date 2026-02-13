import { defineField, defineType } from 'sanity'

export const publicationsPage = defineType({
    name: 'publicationsPage',
    title: 'Publications Page',
    type: 'document',
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
                    name: 'label',
                    title: 'Section Label',
                    type: 'internationalizedArrayString',
                    description: 'Small text above title (e.g., Archives & Publications)',
                }),
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ]
        }),
        defineField({
            name: 'featuredPublications',
            title: 'Featured Publications',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'publication' }] }],
        }),
        defineField({
            name: 'ctaSection',
            title: 'Call to Action Section (Bottom)',
            type: 'object',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'internationalizedArrayBlockContent',
                }),
                defineField({
                    name: 'ctaLabel',
                    title: 'CTA Button Label',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'ctaUrl',
                    title: 'CTA Button URL',
                    type: 'string',
                }),
            ]
        })
    ],
    preview: {
        prepare() {
            return { title: 'Publications Page' }
        }
    },
})
