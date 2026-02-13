import { defineField, defineType } from 'sanity'
import { EyeOpenIcon } from '@sanity/icons'

export const accessibilityPage = defineType({
    name: 'accessibilityPage',
    title: 'Accessibility Page',
    type: 'document',
    icon: EyeOpenIcon,
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
                    title: 'Intro Description',
                    type: 'internationalizedArrayBlockContent',
                }),
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Accessibility Sections',
            description: 'Grouped information like Physical Access, Sensory Services, etc.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'title', title: 'Title', type: 'internationalizedArrayString' }),
                        defineField({ name: 'content', title: 'Content', type: 'internationalizedArrayBlockContent' }),
                        defineField({
                            name: 'image',
                            title: 'Illustration/Photo',
                            type: 'image',
                            options: { hotspot: true }
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title.0.value',
                            media: 'image'
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'venueGuide',
            title: 'Venue Guide',
            description: 'A dedicated section or downloadable for the venue layout.',
            type: 'object',
            fields: [
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'internationalizedArrayString'
                }),
                defineField({
                    name: 'description',
                    title: 'Description',
                    type: 'internationalizedArrayString'
                }),
                defineField({
                    name: 'guideFile',
                    title: 'Guide PDF',
                    type: 'file',
                    options: { accept: 'application/pdf' }
                }),
                defineField({
                    name: 'mapImage',
                    title: 'Venue Map Image',
                    type: 'image'
                })
            ]
        }),
        defineField({
            name: 'policies',
            title: 'Facility Policies',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'policyName', title: 'Policy Name', type: 'internationalizedArrayString' }),
                        defineField({ name: 'description', title: 'Policy Details', type: 'internationalizedArrayBlockContent' }),
                    ],
                    preview: {
                        select: {
                            title: 'policyName.0.value'
                        }
                    }
                }
            ]
        })
    ],
    preview: {
        prepare() {
            return { title: 'Accessibility Page' }
        }
    }
})
