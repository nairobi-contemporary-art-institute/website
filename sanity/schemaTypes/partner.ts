import { defineField, defineType } from 'sanity'

export const partner = defineType({
    name: 'partner',
    title: 'Partner',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'website',
            title: 'Website',
            type: 'url',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'logo',
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
