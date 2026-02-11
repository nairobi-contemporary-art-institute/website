import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const event = defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    icon: CalendarIcon,
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'eventType',
            title: 'Event Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Exhibition Opening', value: 'opening' },
                    { title: 'Workshop', value: 'workshop' },
                    { title: 'Talk / Panel', value: 'talk' },
                    { title: 'Screening', value: 'screening' },
                    { title: 'Performance', value: 'performance' },
                    { title: 'Tour', value: 'tour' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date & Time',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date & Time',
            type: 'datetime',
            validation: (Rule) => Rule.min(Rule.valueOfField('startDate')),
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
            description: 'E.g., NCAI Main Gallery, Online, or External Venue',
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
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'registrationLink',
            title: 'Registration / RSVP Link',
            type: 'url',
        }),
        defineField({
            name: 'relatedExhibitions',
            title: 'Related Exhibitions',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'exhibition' } }],
        }),
        defineField({
            name: 'educators',
            title: 'Educators',
            description: 'NCAI educators or guest facilitators',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'person' }] }],
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
            title: 'title.0.value',
            subtitle: 'startDate',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title, subtitle, media } = selection
            return {
                title: title || 'Untitled Event',
                subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date',
                media,
            }
        },
    },
})
