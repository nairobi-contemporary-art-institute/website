import { defineField, defineType } from 'sanity'

export const page = defineType({
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'internationalizedArrayBlockContent',
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
            return { title: titleValue || 'Untitled Page' }
        }
    },
})
