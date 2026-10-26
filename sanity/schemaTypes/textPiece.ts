import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { SlugLinkField } from './components/SlugLinkField'
import { TEXT_TYPES, TEXT_TYPE_LABELS, type TextType } from '../../src/lib/texts'

const englishOrFirst = (array: any) =>
    Array.isArray(array) ? array.find((t: any) => t._key === 'en')?.value || array[0]?.value : undefined

export const textPiece = defineType({
    name: 'textPiece',
    title: 'Text',
    type: 'document',
    icon: DocumentTextIcon,
    groups: [
        { name: 'content', title: 'Text', default: true },
        { name: 'image', title: 'Lead image' },
        { name: 'links', title: 'Links' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'internationalizedArrayString',
            group: 'content',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            description: 'The web address. Click "Generate" after adding the title.',
            options: {
                source: (doc: any) => englishOrFirst(doc.title),
                maxLength: 96,
            },
            components: { field: SlugLinkField },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'textType',
            title: 'Type',
            type: 'string',
            group: 'content',
            options: {
                list: TEXT_TYPES.map((value) => ({ title: TEXT_TYPE_LABELS[value].singular, value })),
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Publication date',
            type: 'datetime',
            group: 'content',
            description: 'Texts are listed newest first by this date.',
            initialValue: () => new Date().toISOString(),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'authors',
            title: 'Authors',
            type: 'array',
            group: 'content',
            description: 'Writers, interviewers and interviewees, in byline order. Pick an artist for artists\' writings.',
            of: [{ type: 'reference', to: [{ type: 'person' }, { type: 'artist' }] }],
        }),
        defineField({
            name: 'byline',
            title: 'Byline note',
            type: 'internationalizedArrayString',
            group: 'content',
            description: 'Optional extra line, e.g. "In conversation with …" or "Translated by …".',
        }),
        defineField({
            name: 'participants',
            title: 'Speakers',
            type: 'array',
            group: 'content',
            description:
                'Everyone who speaks in the interview or conversation. Add them here, then in the text insert a Speaker (person icon) at the start of each turn and choose who is speaking.',
            hidden: ({ document }) => !['interview', 'conversation'].includes(document?.textType as string),
            of: [
                defineArrayMember({
                    name: 'participant',
                    title: 'Speaker',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'person',
                            title: 'Person or artist',
                            type: 'reference',
                            to: [{ type: 'person' }, { type: 'artist' }],
                            description: 'Choose them if they have a record in Artists or People. Their name, photo and links are then used automatically.',
                        }),
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                            description: 'Type the name if they have no record. If both are filled in, this name is shown.',
                        }),
                        defineField({
                            name: 'initials',
                            title: 'Initials',
                            type: 'string',
                            description: 'Shown instead of the full name after their first turn, e.g. "WK". Leave empty to work them out from the name.',
                            validation: (Rule) => Rule.max(6),
                        }),
                        defineField({
                            name: 'role',
                            title: 'Role',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Interviewer', value: 'interviewer' },
                                    { title: 'Interviewee', value: 'interviewee' },
                                    { title: 'Moderator', value: 'moderator' },
                                    { title: 'Participant', value: 'participant' },
                                ],
                                layout: 'radio',
                                direction: 'horizontal',
                            },
                            initialValue: 'participant',
                        }),
                    ],
                    validation: (Rule) =>
                        Rule.custom((value: any) => (value?.person || value?.name ? true : 'Choose a person or type a name.')),
                    preview: {
                        select: { name: 'name', personName: 'person.name', role: 'role', initials: 'initials', media: 'person.image' },
                        prepare({ name, personName, role, initials, media }) {
                            const title = name || englishOrFirst(personName) || 'Unnamed speaker'
                            return { title, subtitle: [role, initials].filter(Boolean).join(' · '), media }
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: 'standfirst',
            title: 'Standfirst',
            type: 'internationalizedArrayText',
            group: 'content',
            description: 'One or two sentences introducing the text. Shown under the title, on listing cards and in search results.',
            validation: (Rule) =>
                Rule.custom((value: any[] | undefined) => {
                    const tooLong = value?.find((v) => typeof v?.value === 'string' && v.value.length > 280)
                    return tooLong ? `Keep the standfirst under 280 characters (${tooLong._key}).` : true
                }).warning(),
        }),
        defineField({
            name: 'body',
            title: 'Text',
            type: 'internationalizedArrayTextBody',
            group: 'content',
            description: 'Add a language to start writing. Use the + button for images, image pairs and pull quotes.',
            validation: (Rule) =>
                Rule.custom((value: any[] | undefined) => {
                    const filled = value?.filter((v) => Array.isArray(v?.value) && v.value.length > 0) || []
                    if (filled.length === 0) return 'Write the text in at least one language.'
                    return true
                }),
        }),
        defineField({
            name: 'notes',
            title: 'Notes',
            type: 'internationalizedArrayBlockContent',
            group: 'content',
            description: 'Optional endnotes or references, shown in smaller type after the text.',
        }),
        defineField({
            name: 'leadImage',
            title: 'Lead image',
            type: 'image',
            group: 'image',
            description: 'Shown at the top of the text and on listing cards. Use a large, high-quality file (2400px wide or more).',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt text',
                    type: 'string',
                    description: "Describe the image for people who can't see it. Required.",
                    validation: (Rule) => Rule.required().error('Add alt text so the image is accessible.'),
                }),
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'internationalizedArrayString',
                    description: 'Use *asterisks* for italic titles of works.',
                    validation: (Rule) =>
                        Rule.custom((v: any[] | undefined) => (v?.length ? true : 'Add a caption.')).warning(),
                }),
                defineField({
                    name: 'credit',
                    title: 'Credit',
                    type: 'string',
                    description: 'e.g. "Photo: Jane Doe. Courtesy the artist".',
                    validation: (Rule) => Rule.custom((v) => (v ? true : 'Add an image credit.')).warning(),
                }),
            ],
        }),
        defineField({
            name: 'leadLayout',
            title: 'Lead image size',
            type: 'string',
            group: 'image',
            options: {
                list: [
                    { title: 'Wide — breaks out of the text column', value: 'wide' },
                    { title: 'Full — edge to edge', value: 'full' },
                    { title: 'Hide on the text page (cards only)', value: 'none' },
                ],
                layout: 'radio',
            },
            initialValue: 'wide',
        }),
        defineField({
            name: 'relatedExhibitions',
            title: 'Related exhibitions',
            type: 'array',
            group: 'links',
            description: 'The text also appears on these exhibition pages.',
            of: [{ type: 'reference', to: [{ type: 'exhibition' }] }],
        }),
        defineField({
            name: 'relatedArtists',
            title: 'Related artists',
            type: 'array',
            group: 'links',
            description: 'The text also appears on these artist pages.',
            of: [{ type: 'reference', to: [{ type: 'artist' }] }],
        }),
        defineField({
            name: 'relatedTexts',
            title: 'Related texts',
            type: 'array',
            group: 'links',
            description: 'Up to three. If left empty, related texts are chosen automatically.',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'textPiece' }],
                    options: {
                        filter: ({ document }: any) => {
                            const id = String(document?._id || '').replace(/^drafts\./, '')
                            return { filter: '!(_id in [$id, $draft])', params: { id, draft: `drafts.${id}` } }
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.max(3),
        }),
    ],
    preview: {
        select: { title: 'title', textType: 'textType', publishedAt: 'publishedAt', media: 'leadImage' },
        prepare({ title, textType, publishedAt, media }) {
            const label = TEXT_TYPE_LABELS[textType as TextType]?.singular
            const date = publishedAt
                ? new Date(publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'No date'
            return {
                title: englishOrFirst(title) || 'Untitled',
                subtitle: [label, date].filter(Boolean).join(' · '),
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Publication date, newest',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
})
