import { type SchemaTypeDefinition } from 'sanity'
import { artist } from './artist'
import { work } from './work'
import { exhibition } from './exhibition'
import { timelineEvent } from './timelineEvent'
import { siteSettings } from './siteSettings'
import { post } from './post'
import { program } from './program'
import { blockContent } from './blockContent'
import { collectionItem } from './collectionItem'
import { event } from './event'

import { person } from './person'
import { category } from './category'

import { page } from './page'
import { aboutPage } from './aboutPage'
import { getInvolvedPage } from './getInvolvedPage'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [artist, work, exhibition, collectionItem, timelineEvent, event, person, category, siteSettings, post, program, blockContent, page, aboutPage, getInvolvedPage],
}
