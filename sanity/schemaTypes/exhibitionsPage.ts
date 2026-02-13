import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'

export const exhibitionsPage = defineType({
    name: 'exhibitionsPage',
    title: 'Exhibitions Page',
    type: 'document',
    icon: ThListIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
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
                    title: 'Intro Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Exhibitions Page' }
        }
    }
})
