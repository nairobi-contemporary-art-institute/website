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

// Singleton document types
const singletonTypes = new Set(['siteSettings', 'aboutPage', 'getInvolvedPage', 'homePage', 'visitPage', 'publicationsPage', 'educationPage'])

// Singleton document actions (disable create/delete)
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema,
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
                        // Other document types (filter out singletons)
                        ...S.documentTypeListItems().filter(
                            (item) => !singletonTypes.has(item.getId() as string)
                        ),
                    ]),
        }),
        internationalizedArray({
            languages: languages.map(l => ({ id: l.id, title: l.title })),
            defaultLanguages: ['en'],
            fieldTypes: ['string', 'text', 'slug', 'blockContent']
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
