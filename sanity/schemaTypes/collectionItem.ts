
import { defineField, defineType } from 'sanity'

export const collectionItem = defineType({
    name: 'collectionItem',
    title: 'Collection Item',
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
                source: 'title[0].value',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'artist',
            title: 'Artist',
            type: 'reference',
            to: { type: 'artist' },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'creationDate',
            title: 'Creation Date (Year)',
            type: 'string',
            description: 'e.g., "1994", "c. 1960s"',
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
            name: 'category',
            title: 'Legacy Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Painting', value: 'painting' },
                    { title: 'Sculpture', value: 'sculpture' },
                    { title: 'Photography', value: 'photography' },
                    { title: 'Installation', value: 'installation' },
                    { title: 'Mixed Media', value: 'mixed-media' },
                    { title: 'Work on Paper', value: 'work-on-paper' },
                    { title: 'Video/New Media', value: 'video' },
                    { title: 'Archive', value: 'archive' },
                    { title: 'Other', value: 'other' },
                ]
            }
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'acquisitionDate',
            title: 'Acquisition Date',
            type: 'date',
            options: {
                dateFormat: 'YYYY-MM-DD',
            }
        }),
        defineField({
            name: 'creditLine',
            title: 'Credit Line',
            type: 'internationalizedArrayString',
        }),
    ],
    preview: {
        select: {
            title: 'title.0.value',
            subtitle: 'artist.name.0.value',
            media: 'mainImage',
        },
        prepare(selection: Record<string, any>) {
            const { artist } = selection
            return Object.assign({}, selection, {
                subtitle: artist && `by ${artist}`,
            })
        },
    },
})
