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
            fields: [
                defineField({
                    name: 'imageCredit',
                    title: 'Image Credit',
                    type: 'reference',
                    to: [{ type: 'person' }],
                }),
            ],
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Staff (Full-time)', value: 'staff' },
                    { title: 'Contributor / Guest (Project-based)', value: 'contributor' },
                ],
                layout: 'radio',
            },
            initialValue: 'staff',
        }),
        defineField({
            name: 'hasProfile',
            title: 'Has Public Profile',
            description: 'If disabled, this person will not appear on the Team page and their name will not be linkable in credits.',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'roles',
            title: 'Roles',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Curator', value: 'curator' },
                    { title: 'Assistant Curator', value: 'assistant-curator' },
                    { title: 'Educator', value: 'educator' },
                    { title: 'Author', value: 'author' },
                    { title: 'Researcher', value: 'researcher' },
                    { title: 'Speaker', value: 'speaker' },
                    { title: 'Filmmaker', value: 'filmmaker' },
                    { title: 'Videographer', value: 'videographer' },
                    { title: 'Photographer', value: 'photographer' },
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
