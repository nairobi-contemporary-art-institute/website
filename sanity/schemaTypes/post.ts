import { defineField, defineType } from 'sanity'
import { SlugLinkField } from './components/SlugLinkField'

export const post = defineType({
    name: 'post',
    title: 'Post',
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
                source: 'title',
                maxLength: 96,
            },
            components: {
                field: SlugLinkField,
            },
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
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                }),
            ],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
        }),
        defineField({
            name: 'authors',
            title: 'Authors',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'person' }] }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
        }),
        defineField({
            name: 'mediaType',
            title: 'Media Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Article', value: 'article' },
                    { title: 'Video', value: 'video' },
                    { title: 'Audio', value: 'audio' },
                ],
                layout: 'radio',
            },
            initialValue: 'article',
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
            name: 'audioFile',
            title: 'Audio File',
            type: 'file',
            options: { accept: 'audio/*' },
            hidden: ({ document }) => document?.mediaType !== 'audio',
        }),
        defineField({
            name: 'audioCaption',
            title: 'Audio Caption',
            type: 'internationalizedArrayString',
            hidden: ({ document }) => document?.mediaType !== 'audio',
        }),
        defineField({
            name: 'duration',
            title: 'Duration (e.g. 12:30)',
            type: 'string',
            hidden: ({ document }) => document?.mediaType === 'article',
        }),
        defineField({
            name: 'relatedArtist',
            title: 'Related Artist',
            description: 'Link this post to a specific artist for enriched content.',
            type: 'reference',
            to: [{ type: 'artist' }],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            authors: 'authors',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title, authors } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title
            return {
                ...selection,
                title: displayTitle,
                subtitle: authors && authors.length > 0 ? `by multiple authors` : '',
            }
        },
    },
    orderings: [
        {
            title: 'Publish Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
