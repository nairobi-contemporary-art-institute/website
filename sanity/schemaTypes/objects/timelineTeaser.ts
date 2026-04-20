import { defineField, defineType } from 'sanity'

export const timelineTeaser = defineType({
    name: 'timelineTeaser',
    title: 'Timeline Teaser',
    type: 'object',
    fields: [
        defineField({ 
            name: 'show', 
            title: 'Show Timeline Teaser', 
            type: 'boolean', 
            initialValue: true 
        }),
        defineField({ 
            name: 'headline', 
            title: 'Headline', 
            type: 'internationalizedArrayString',
            description: 'The title displayed above the timeline preview.'
        }),
    ],
    preview: {
        select: {
            title: 'headline',
        },
        prepare({ title }) {
            const headline = Array.isArray(title) 
                ? title.find((t: any) => t._key === 'en')?.value || title[0]?.value 
                : 'Timeline Teaser'
            return {
                title: headline,
                subtitle: 'Museum Module: Timeline Preview'
            }
        }
    }
})
