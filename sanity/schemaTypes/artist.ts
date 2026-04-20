import { defineField, defineType } from 'sanity'
import { SlugLinkField } from './components/SlugLinkField'

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
            components: {
                field: SlugLinkField
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
            description: 'Artist portrait. Recommended size: 1500px × 1875px (4:5 Portrait). Minimum width 1200px. High-fidelity portraiture is essential for the clinical-luxury aesthetic.',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'Briefly describe the portrait for screen readers. Mention setting, expression, and focus (e.g., "Sane Wadu smiling in his Naivasha studio").',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'imageCredit',
                    title: 'Image Credit',
                    type: 'reference',
                    to: [{ type: 'person' }],
                }),
            ],
        }),
        defineField({
            name: 'longBio',
            title: 'Long Bio and CV',
            description: 'Extended biography and comprehensive CV listing.',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'works',
            title: 'Works Gallery',
            description: 'Artwork to display in the main carousel and grid',
            type: 'array',
            of: [{ 
                type: 'reference', 
                to: [{ type: 'work' }],
                options: {
                    filter: ({ document }) => {
                        const artistId = document?._id?.replace('drafts.', '');
                        return {
                            filter: 'artist._ref == $artistId',
                            params: { artistId }
                        }
                    }
                }
            }],
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
                    {
                        name: 'image',
                        type: 'image',
                        title: 'Feature Image',
                        description: 'Recommended size: 1200px × 1200px (1:1). High-quality square crop for museum exhibition previews.',
                        options: { hotspot: true },
                        fields: [
                            defineField({
                                name: 'caption',
                                title: 'Caption',
                                type: 'internationalizedArrayString',
                            }),
                        ],
                    },
                    { name: 'link', type: 'url', title: 'External Link' }
                ]
            }]
        }),
        defineField({
            name: 'featuredExhibitions',
            title: 'Featured Exhibitions',
            description: 'Link existing exhibitions that this artist features in.',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'exhibition' }] }],
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
