'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { languages } from './src/i18n'
import { media } from 'sanity-plugin-media'
import { colorInput } from '@sanity/color-input'
import { table } from '@sanity/table'
import { googleMapsInput } from '@sanity/google-maps-input'
import { DocumentTextIcon } from '@sanity/icons'
import { TEXT_TYPES, TEXT_TYPE_LABELS } from './src/lib/texts'

// Singleton document types
const singletonTypes = new Set(['siteSettings', 'aboutPage', 'getInvolvedPage', 'homePage', 'visitPage', 'publicationsPage', 'educationPage'])

// Singleton document actions (disable create/delete)
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Types with a hand-built list item, excluded from the generic type list
const customListTypes = new Set(['textPiece'])

// "New essay", "New interview", … — fixed starting points for Texts
const textTemplates = TEXT_TYPES.map((textType) => ({
    id: `text-${textType}`,
    title: `New ${TEXT_TYPE_LABELS[textType].singular.toLowerCase()}`,
    schemaType: 'textPiece',
    value: () => ({ textType, publishedAt: new Date().toISOString(), leadLayout: 'wide' }),
}))

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema: {
        types: schema.types,
        templates: (prev) => [
            // Plain "Text" template is replaced by the per-type ones
            ...prev.filter((template) => template.schemaType !== 'textPiece'),
            ...textTemplates,
        ],
    },
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        // Singleton: Site Settings
                        S.listItem()
                            .title('Site Settings')
                            .id('siteSettings')
                            .child(
                                S.document()
                                    .schemaType('siteSettings')
                                    .documentId('siteSettings')
                            ),
                        // Singleton: About Page
                        S.listItem()
                            .title('About Page')
                            .id('aboutPage')
                            .child(
                                S.document()
                                    .schemaType('aboutPage')
                                    .documentId('aboutPage')
                            ),
                        // Singleton: Get Involved Page
                        S.listItem()
                            .title('Get Involved Page')
                            .id('getInvolvedPage')
                            .child(
                                S.document()
                                    .schemaType('getInvolvedPage')
                                    .documentId('getInvolvedPage')
                            ),
                        // Singleton: Home Page
                        S.listItem()
                            .title('Home Page')
                            .id('homePage')
                            .child(
                                S.document()
                                    .schemaType('homePage')
                                    .documentId('homePage')
                            ),
                        // Singleton: Visit Page
                        S.listItem()
                            .title('Visit Page')
                            .id('visitPage')
                            .child(
                                S.document()
                                    .schemaType('visitPage')
                                    .documentId('visitPage')
                            ),
                        // Singleton: Publications Page
                        S.listItem()
                            .title('Publications Page')
                            .id('publicationsPage')
                            .child(
                                S.document()
                                    .schemaType('publicationsPage')
                                    .documentId('publicationsPage')
                            ),
                        // Singleton: Education Page
                        S.listItem()
                            .title('Education Page')
                            .id('educationPage')
                            .child(
                                S.document()
                                    .schemaType('educationPage')
                                    .documentId('educationPage')
                            ),
                        S.divider(),
                        // Texts: all, then one list per type with its own template
                        S.listItem()
                            .title('Texts')
                            .id('texts')
                            .icon(DocumentTextIcon)
                            .child(
                                S.list()
                                    .title('Texts')
                                    .items([
                                        S.listItem()
                                            .title('All texts')
                                            .id('texts-all')
                                            .child(
                                                S.documentTypeList('textPiece')
                                                    .title('All texts')
                                                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                                    .initialValueTemplates(
                                                        textTemplates.map((t) => S.initialValueTemplateItem(t.id))
                                                    )
                                            ),
                                        S.divider(),
                                        ...TEXT_TYPES.map((textType) =>
                                            S.listItem()
                                                .title(TEXT_TYPE_LABELS[textType].plural)
                                                .id(`texts-${textType}`)
                                                .child(
                                                    S.documentList()
                                                        .title(TEXT_TYPE_LABELS[textType].plural)
                                                        .schemaType('textPiece')
                                                        .filter('_type == "textPiece" && textType == $textType')
                                                        .params({ textType })
                                                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                                                        .initialValueTemplates([
                                                            S.initialValueTemplateItem(`text-${textType}`),
                                                        ])
                                                )
                                        ),
                                    ])
                            ),
                        S.divider(),
                        // Other document types (filter out singletons and custom lists)
                        ...S.documentTypeListItems().filter((item) => {
                            const id = item.getId() as string
                            return !singletonTypes.has(id) && !customListTypes.has(id)
                        }),
                    ]),
        }),
        internationalizedArray({
            languages: languages.map(l => ({ id: l.id, title: l.title })),
            defaultLanguages: ['en'],
            fieldTypes: ['string', 'text', 'slug', 'blockContent', 'textBody']
        }),
        media(),
        colorInput(),
        table(),
        googleMapsInput({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
        })
    ],
    document: {
        // For singletons, disable creation from "new document" menu
        actions: (input, { schemaType }) =>
            singletonTypes.has(schemaType)
                ? input.filter(({ action }) => action && singletonActions.has(action))
                : input,
    },
})
