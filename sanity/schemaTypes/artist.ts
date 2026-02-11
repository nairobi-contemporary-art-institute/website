import { defineField, defineType } from 'sanity'

export const artist = defineType({
    name: 'artist',
    title: 'Artist',
    type: 'document',
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
            name: 'bio',
            title: 'Bio',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'works',
            title: 'Works Gallery',
            description: 'Artwork to display in the main carousel and grid',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'work' }] }],
        }),
        defineField({
            name: 'forthcomingProjects',
            title: 'Forthcoming Projects',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', type: 'string', title: 'Title' },
                    { name: 'date', type: 'string', title: 'Date Range/Year' },
                    { name: 'venue', type: 'string', title: 'Venue' },
                    { name: 'link', type: 'url', title: 'Link' },
                ]
            }]
        }),
        defineField({
            name: 'news',
            title: 'Recent News',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', type: 'string', title: 'Title' },
                    { name: 'description', type: 'text', title: 'Short Description' },
                    { name: 'link', type: 'url', title: 'URL' },
                    { name: 'date', type: 'date', title: 'Date' }
                ]
            }]
        }),
        defineField({
            name: 'museumExhibitions',
            title: 'Museum Exhibitions',
            description: 'Major exhibitions appearing in the bottom grid',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'title', type: 'string', title: 'Exhibition Title' },
                    { name: 'venue', type: 'string', title: 'Venue/Museum' },
                    { name: 'location', type: 'string', title: 'Location' },
                    { name: 'image', type: 'image', title: 'Feature Image', options: { hotspot: true } },
                    { name: 'link', type: 'url', title: 'External Link' }
                ]
            }]
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
