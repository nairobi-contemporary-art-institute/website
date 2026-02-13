import { defineField, defineType } from 'sanity'

export const exhibition = defineType({
    name: 'exhibition',
    title: 'Exhibition',
    type: 'document',
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'images', title: 'Images' },
        { name: 'content', title: 'Content' },
        { name: 'related', title: 'Related Info' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
            group: 'general',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'general',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'artists',
            title: 'Artists',
            type: 'array',
            group: 'general',
            of: [{ type: 'reference', to: { type: 'artist' } }],
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'datetime',
            group: 'general',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'datetime',
            group: 'general',
        }),
        defineField({
            name: 'homepageImage',
            title: 'Homepage Featured Image',
            description: 'Image used for this exhibition when featured on the Homepage.',
            type: 'image',
            group: 'images',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                }),
            ],
        }),
        defineField({
            name: 'listImage',
            title: 'Listings Featured Image',
            description: 'Image used in the main /exhibitions list view.',
            type: 'image',
            group: 'images',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                }),
            ],
        }),
        defineField({
            name: 'mainImage',
            title: 'Hero Image (Detail Page)',
            description: 'Main image shown at the top of the individual exhibition page.',
            type: 'image',
            group: 'images',
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
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
            group: 'content',
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'internationalizedArrayString',
                        }),
                    ],
                }
            ],
        }),
        defineField({
            name: 'curators',
            title: 'Curators',
            type: 'array',
            group: 'related',
            of: [{ type: 'reference', to: [{ type: 'person' }] }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'related',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'partners',
            title: 'Partners & Sponsors',
            type: 'array',
            group: 'related',
            of: [{ type: 'reference', to: [{ type: 'partner' }] }],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
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
