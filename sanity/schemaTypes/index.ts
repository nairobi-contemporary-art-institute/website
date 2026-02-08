import { type SchemaTypeDefinition } from 'sanity'
import { artist } from './artist'
import { exhibition } from './exhibition'
import { timelineEvent } from './timelineEvent'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [artist, exhibition, timelineEvent],
}
