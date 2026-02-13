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
import { partner } from './partner'

import { page } from './page'
import { aboutPage } from './aboutPage'
import { getInvolvedPage } from './getInvolvedPage'
import { homePage } from './homePage'
import { visitPage } from './visitPage'
import { publication } from './publication'
import { publicationsPage } from './publicationsPage'
import { educationPage } from './educationPage'
import { eventsPage } from './eventsPage'
import { accessibilityPage } from './accessibilityPage'
import { collectionPage } from './collectionPage'
import { exhibitionsPage } from './exhibitionsPage'
import { artistsPage } from './artistsPage'
import { supportPage } from './supportPage'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [artist, work, exhibition, collectionItem, timelineEvent, event, person, category, partner, siteSettings, post, program, blockContent, page, aboutPage, getInvolvedPage, homePage, visitPage, publication, publicationsPage, educationPage, eventsPage, accessibilityPage, collectionPage, exhibitionsPage, artistsPage, supportPage],
}
