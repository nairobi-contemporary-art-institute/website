import { defineField, defineType } from 'sanity'
import { SlugLinkField } from './components/SlugLinkField'

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
            components: {
                field: SlugLinkField
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
                    description: 'Detailed visual description for accessibility. Mention medium texture, primary subjects, and colors (e.g., "Vibrant oil painting showing a crowded marketplace").',
                    validation: (Rule) => Rule.required(),
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
        defineField({
            name: 'showInCollection',
            title: 'Show in Collection',
            type: 'boolean',
            initialValue: true,
            description: 'If disabled, this item will not appear in the digital collection archive.'
        }),
        defineField({
            name: 'featuredOnHome',
            title: 'Show in Explore NCAI (Home)',
            type: 'boolean',
            initialValue: false,
            description: 'If enabled, this item will appear in the "Explore NCAI" section on the homepage.'
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
