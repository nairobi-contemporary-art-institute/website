import { defineField, defineType } from 'sanity'

export const work = defineType({
    name: 'work',
    title: 'Work',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'artist',
            title: 'Artist',
            type: 'reference',
            to: [{ type: 'artist' }],
        }),
        defineField({
            name: 'year',
            title: 'Year',
            type: 'string',
        }),
        defineField({
            name: 'medium',
            title: 'Medium',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'dimensions',
            title: 'Dimensions',
            type: 'string',
        }),
        defineField({
            name: 'edition',
            title: 'Edition',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
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
            artist: 'artist.name',
            media: 'image',
        },
        prepare(selection) {
            const { title, artist } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title

            const artistName = Array.isArray(artist)
                ? artist.find((t: any) => t._key === 'en')?.value || artist[0]?.value || ''
                : artist

            return {
                ...selection,
                title: displayTitle,
                subtitle: artistName,
            }
        },
    },
})
