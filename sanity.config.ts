'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool(),
        internationalizedArray({
            languages: [
                { id: 'en', title: 'English' },
                { id: 'sw', title: 'Kiswahili' },
                { id: 'ar', title: 'Arabic' },
                { id: 'hi', title: 'Hindi' },
                { id: 'de', title: 'German' },
                { id: 'pt', title: 'Portuguese' },
                { id: 'fr', title: 'French' },
                { id: 'es', title: 'Spanish' },
                { id: 'am', title: 'Amharic' },
                { id: 'so', title: 'Somali' }
            ],
            defaultLanguages: ['en'],
            fieldTypes: ['string', 'text', 'slug']
        })
    ],
})
