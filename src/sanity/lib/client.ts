import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../../../sanity/env'

/**
 * Sanity client for fetching content.
 * useCdn: false for freshest data (necessary for internationalization updates)
 */
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    // Setting stega for encoded metadata if using Visual Editing in the future
    stega: {
        enabled: process.env.NEXT_PUBLIC_SANITY_SIGNAL === 'true',
        studioUrl: '/studio',
    },
})
