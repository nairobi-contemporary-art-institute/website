'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { languages } from './src/i18n'

// Singleton document types
const singletonTypes = new Set(['siteSettings'])

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
        })
    ],
    document: {
        // For singletons, disable creation from "new document" menu
        actions: (input, context) =>
            singletonTypes.has(context.schemaType)
                ? input.filter(({ action }) => action && singletonActions.has(action))
                : input,
    },
})
