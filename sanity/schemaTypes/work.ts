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
            name: 'exhibitions',
            title: 'NCAI Exhibitions',
            description: 'Associate this work with one or more exhibitions at NCAI',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'exhibition' }] }],
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
            name: 'mediaType',
            title: 'Media Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Image', value: 'image' },
                    { title: 'Video', value: 'video' },
                ],
                layout: 'radio',
            },
            initialValue: 'image',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            description: 'Artwork image. Recommended size: 2000px+ (long edge). High resolution is critical for the Cinematic Gallery zoom view.',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                }),
            ],
            // Only required if mediaType is image, but usually we want a thumbnail anyway
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL (YouTube/Vimeo)',
            type: 'url',
            hidden: ({ document }) => document?.mediaType !== 'video',
        }),
        defineField({
            name: 'videoCaption',
            title: 'Video Caption',
            type: 'internationalizedArrayString',
            hidden: ({ document }) => document?.mediaType !== 'video',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'showInCollection',
            title: 'Show in Collection',
            type: 'boolean',
            initialValue: true,
            description: 'If disabled, this work will not appear in the digital collection archive.'
        }),
        defineField({
            name: 'showOnArtistProfile',
            title: 'Show on Artist Profile',
            type: 'boolean',
            initialValue: true,
            description: 'If disabled, this work will not appear in the works gallery on the artist profile page.'
        }),
        defineField({
            name: 'featuredOnHome',
            title: 'Show in Explore NCAI (Home)',
            type: 'boolean',
            initialValue: false,
            description: 'If enabled, this work will appear in the "Explore NCAI" section on the homepage.'
        }),
        defineField({
            name: 'onLoan',
            title: 'Out on Loan',
            type: 'boolean',
            initialValue: false,
            description: 'Indicates if this work is currently on loan to another institution.'
        }),
        defineField({
            name: 'onDisplay',
            title: 'Currently on Display',
            type: 'boolean',
            initialValue: false,
            description: 'Indicates if this work is currently on display at NCAI.'
        }),
        defineField({
            name: 'displayLocation',
            title: 'Display Location',
            type: 'internationalizedArrayString',
            hidden: ({ document }) => !document?.onDisplay,
            description: 'Where the work is currently displayed (shown in hover tooltip).'
        }),
        defineField({
            name: 'artlogicId',
            title: 'Artlogic ID',
            type: 'string',
            hidden: true,
            readOnly: true,
            description: 'Internal reference ID for data migrations.'
        }),
        defineField({
            name: 'stockNumber',
            title: 'Stock Number',
            type: 'string',
            readOnly: true,
            description: 'Artlogic stock number.'
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
