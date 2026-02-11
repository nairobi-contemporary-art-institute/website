import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const category = defineType({
    name: 'category',
    title: 'Category (Tags)',
    type: 'document',
    icon: TagIcon,
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
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Style', value: 'style' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Theme', value: 'theme' },
                    { title: 'Technique', value: 'technique' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            type: 'type',
        },
        prepare(selection) {
            const { title, type } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title
            return {
                title: displayTitle,
                subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
            }
        },
    },
})
