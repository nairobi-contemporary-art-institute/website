import { defineArrayMember, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

/**
 * Body of a Text. Deliberately narrow: editors get a fixed set of styles and
 * three insertable blocks (image, image pair, pull quote) so every Text
 * renders in the same calm reading layout. Interviews and conversations mark
 * each turn with an inline Speaker chosen from the Text's Speakers list.
 */
export const textBody = defineType({
    title: 'Text body',
    name: 'textBody',
    type: 'array',
    of: [
        defineArrayMember({
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading', value: 'h2' },
                { title: 'Subheading', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' },
                ],
                annotations: [
                    {
                        title: 'External link',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                                validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                            },
                            {
                                title: 'Open in new tab',
                                name: 'blank',
                                type: 'boolean',
                                initialValue: true,
                            },
                        ],
                    },
                    {
                        title: 'Link to page on this site',
                        name: 'internalLink',
                        type: 'object',
                        icon: LinkIcon,
                        fields: [
                            {
                                title: 'Page',
                                name: 'reference',
                                type: 'reference',
                                to: [{ type: 'textPiece' }, { type: 'exhibition' }, { type: 'artist' }],
                                validation: (Rule) => Rule.required(),
                            },
                        ],
                    },
                ],
            },
            of: [defineArrayMember({ type: 'speaker' })],
        }),
        defineArrayMember({ type: 'textFigure' }),
        defineArrayMember({ type: 'imagePair' }),
        defineArrayMember({ type: 'pullQuote' }),
    ],
})
