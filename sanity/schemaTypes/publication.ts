import { defineField, defineType } from 'sanity'

export const publication = defineType({
    name: 'publication',
    title: 'Publication',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Book Title',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.0.value', // Assuming English is the first element
                maxLength: 96,
            },
        }),
        defineField({
            name: 'author',
            title: 'Author(s)',
            type: 'internationalizedArrayString',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'details',
            title: 'Book Details (e.g., Monograph, 212 Pages)',
            type: 'internationalizedArrayBlockContent',
        }),
        defineField({
            name: 'color',
            title: 'Cover Color',
            type: 'color',
            description: 'Used for the generated 3D book cover',
        }),
        defineField({
            name: 'textColor',
            title: 'Text Color',
            type: 'string',
            description: 'Hex code for the title text on the cover (e.g., #FFFFFF or #1A1A1A)',
            initialValue: '#1A1A1A'
        }),
        defineField({
            name: 'textured',
            title: 'Is Textured?',
            type: 'boolean',
            initialValue: true,
            description: 'Adds a tactile grain overlay to the cover',
        }),
        defineField({
            name: 'showTitle',
            title: 'Show Title on Cover',
            type: 'boolean',
            initialValue: true,
            description: 'Toggles the book title visibility on the cover cover',
        }),
        defineField({
            name: 'showBranding',
            title: 'Show Branding on Cover',
            type: 'boolean',
            initialValue: true,
            description: 'Toggles the NCAI Press logo/text visibility on the cover',
        }),
        defineField({
            name: 'variant',
            title: 'Cover Variant',
            type: 'string',
            options: {
                list: [
                    { title: 'Default', value: 'default' },
                    { title: 'Simple', value: 'simple' },
                ],
            },
            initialValue: 'default',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image (Reference)',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'string',
        }),
        defineField({
            name: 'buyLink',
            title: 'Buy Link',
            type: 'url',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            color: 'color.hex',
        },
        prepare(selection) {
            const { title, color } = selection
            const englishTitle = Array.isArray(title) ? title.find(t => t._key === 'en')?.value || title[0]?.value : title
            return {
                title: englishTitle,
                subtitle: color ? `Cover: ${color}` : 'No cover color set',
            }
        },
    },
})
