import { defineField, defineType } from 'sanity'

export const program = defineType({
    name: 'program',
    title: 'Program',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'programType',
            title: 'Program Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Workshop', value: 'workshop' },
                    { title: 'Talk', value: 'talk' },
                    { title: 'Tour', value: 'tour' },
                    { title: 'Screening', value: 'screening' },
                    { title: 'Course', value: 'course' },
                    { title: 'Other', value: 'other' },
                ],
            },
        }),
        defineField({
            name: 'audience',
            title: 'Target Audience',
            type: 'string',
            options: {
                list: [
                    { title: 'All Ages', value: 'all' },
                    { title: 'Adults', value: 'adults' },
                    { title: 'Youth', value: 'youth' },
                    { title: 'Children', value: 'children' },
                    { title: 'Professionals', value: 'professionals' },
                ],
            },
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'datetime',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'datetime',
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'internationalizedArrayString',
            description: 'Short summary for lists (max 200 chars)',
        }),
        defineField({
            name: 'registrationUrl',
            title: 'Registration URL',
            type: 'url',
        }),
        defineField({
            name: 'resources',
            title: 'Resources (PDFs)',
            type: 'array',
            of: [{ type: 'file', options: { accept: 'application/pdf' } }],
        }),
        defineField({
            name: 'educators',
            title: 'Educators',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'person' }] }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            programType: 'programType',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title, programType } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title
            return {
                ...selection,
                title: displayTitle,
                subtitle: programType,
            }
        },
    },
    orderings: [
        {
            title: 'Start Date, New',
            name: 'startDateDesc',
            by: [{ field: 'startDate', direction: 'desc' }],
        },
    ],
})
