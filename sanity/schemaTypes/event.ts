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
                    { title: 'Exhibition Opening', value: 'Exhibition Opening' },
                    { title: 'Public Talk', value: 'Public Talk' },
                    { title: 'Artist Talk', value: 'Artist Talk' },
                    { title: 'Curator Talk', value: 'Curator Talk' },
                    { title: 'Virtual Talk', value: 'Virtual Talk' },
                    { title: 'Lecture Series', value: 'Lecture Series' },
                    { title: 'Research Workshop', value: 'Research Workshop' },
                    { title: 'Artist-Led Workshop', value: 'Artist-Led Workshop' },
                    { title: 'Zine-Making Workshop', value: 'Zine-Making Workshop' },
                    { title: 'Writing Workshop', value: 'Writing Workshop' },
                    { title: 'Sound Workshop', value: 'Sound Workshop' },
                    { title: 'Accessibility Workshop', value: 'Accessibility Workshop' },
                    { title: 'Exhibition Walkabout', value: 'Exhibition Walkabout' },
                    { title: 'Book Club', value: 'Book Club' },
                    { title: 'Reading Group', value: 'Reading Group' },
                    { title: 'Film Screening', value: 'Film Screening' },
                    { title: 'Virtual Event', value: 'Virtual Event' },
                    { title: 'Information Session', value: 'Information Session' },
                    { title: 'Book Launch', value: 'Book Launch' },
                    { title: 'Performance', value: 'Performance' },
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
        defineField({
            name: 'partners',
            title: 'Partners & Sponsors',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'partner' }] }],
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
