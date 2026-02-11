import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const person = defineType({
    name: 'person',
    title: 'Person (Curators, Educators, etc.)',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'roles',
            title: 'Roles',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Curator', value: 'curator' },
                    { title: 'Educator', value: 'educator' },
                    { title: 'Author', value: 'author' },
                    { title: 'Researcher', value: 'researcher' },
                    { title: 'Speaker', value: 'speaker' },
                ],
            },
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
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
