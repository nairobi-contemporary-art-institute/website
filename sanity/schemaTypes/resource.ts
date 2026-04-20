import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const resource = defineType({
    name: 'resource',
    title: 'Education Resource',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Resource Title',
            type: 'internationalizedArrayString',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'type',
            title: 'Resource Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Worksheet', value: 'worksheet' },
                    { title: 'Activity Pack', value: 'activityPack' },
                    { title: 'Teacher Guide', value: 'teacherGuide' },
                    { title: 'Essay/Article', value: 'essay' },
                    { title: 'Reference Material', value: 'reference' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'file',
            title: 'PDF File',
            description: 'Recommended maximum file size: 5MB. Please optimize for web before uploading.',
            type: 'file',
            options: {
                accept: 'application/pdf',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            description: 'Used as the thumbnail in the gallery grid.',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'audience',
            title: 'Target Audience',
            type: 'string',
            options: {
                list: [
                    { title: 'Children & Families', value: 'children' },
                    { title: 'Schools & Youth', value: 'youth' },
                    { title: 'Adults & Public', value: 'adults' },
                    { title: 'Professionals (UJUZI)', value: 'ujuzi' },
                ],
            },
            initialValue: 'children',
        }),
        defineField({
            name: 'ageRange',
            title: 'Age Range',
            description: 'Optional: Displayed next to the resource type (e.g. 5–10 yrs)',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'exhibition',
            title: 'Associated Exhibition',
            description: 'Optional: Link this resource to an existing exhibition.',
            type: 'reference',
            to: [{ type: 'exhibition' }],
        }),
        defineField({
            name: 'exhibitionFallback',
            title: 'Exhibition Name Fallback',
            description: 'Used if the exhibition does not yet exist in the database.',
            type: 'internationalizedArrayString',
            hidden: ({ document }) => !!document?.exhibition,
        }),
        defineField({
            name: 'featured',
            title: 'Featured Resource',
            type: 'boolean',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'coverImage',
            type: 'type',
        },
        prepare(selection) {
            const { title, type } = selection
            const displayTitle = Array.isArray(title)
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value || 'Untitled'
                : title
            return {
                title: displayTitle,
                subtitle: type ? type.toUpperCase() : 'PDF',
                media: selection.media
            }
        },
    },
})
