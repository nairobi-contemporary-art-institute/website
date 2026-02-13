import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export const artistsPage = defineType({
    name: 'artistsPage',
    title: 'Artists Page',
    type: 'document',
    icon: UsersIcon,
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
            return { title: 'Artists Page' }
        }
    }
})
