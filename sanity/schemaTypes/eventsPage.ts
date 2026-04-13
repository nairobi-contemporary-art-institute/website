import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const eventsPage = defineType({
    name: 'eventsPage',
    title: 'Events Page',
    type: 'document',
    icon: CalendarIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'header',
            title: 'Header Section',
            type: 'object',
            fields: [
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'internationalizedArrayString',
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ],
        }),
        defineField({
            name: 'featuredEvents',
            title: 'Featured Events',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'event' }] }],
        }),
        defineField({
            name: 'noticeBar',
            title: 'Notice Bar (Gallery Status)',
            type: 'object',
            fields: [
                defineField({
                    name: 'enabled',
                    title: 'Enabled',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Toggle the notice bar globally across the What\'s On grid'
                }),
                defineField({
                    name: 'autoMondayClosing',
                    title: 'Automatic Monday Closing',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Automatically show "CLOSED ON MONDAY" notice when navigating to Mondays'
                }),
                defineField({
                    name: 'customStatus',
                    title: 'Custom Status Message',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Status Label',
                            type: 'internationalizedArrayString',
                            description: 'E.g. "SPECIAL EVENT" or "BANK HOLIDAY"'
                        }),
                        defineField({
                            name: 'linkText',
                            title: 'Link Text',
                            type: 'internationalizedArrayString',
                            description: 'Text for the secondary link on the right'
                        }),
                        defineField({
                            name: 'linkUrl',
                            title: 'Link URL',
                            type: 'string',
                        }),
                    ],
                }),
            ],
        }),
    ],
})
