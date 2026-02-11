import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../../../sanity/env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

/**
 * Helper to generate Sanity image URLs.
 */
export const urlFor = (source: any) => {
    return imageBuilder.image(source)
}
