#!/usr/bin/env node
/**
 * Create generic `page` documents for the 6 orphan program pages.
 * page schema = title, slug, body (portable text). Text only (no image field).
 * Publishes directly with stable _id "page-<slug>". Requires SANITY_API_TOKEN.
 */
const { client } = require('./sanity-client')

let bk = 0, sk = 0
function block(text, style = 'normal') {
  const k = 'b' + bk++
  return {
    _type: 'block', _key: k, style, markDefs: [],
    children: [{ _type: 'span', _key: 's' + sk++, text, marks: [] }],
  }
}
const body = (blocks) => [{ _key: 'en', _type: 'internationalizedArrayBlockContentValue', value: blocks }]
const title = (t) => [{ _key: 'en', _type: 'internationalizedArrayStringValue', value: t }]

const PAGES = [
  {
    slug: 'residency',
    title: 'Residencies',
    blocks: [
      block('Through our network of partners, NCAI offers residencies to both local and international artists in Kenya.'),
      block("NCAI is part of a larger network of international art organizations which support artistic exchanges, residencies and knowledge sharing worldwide. Being part of the Triangle Network (trianglenetwork.org) allows NCAI's reach to go beyond Kenya, accessing a rich network of resources."),
      block('These residencies provide artists with the opportunity to immerse themselves in the local art scene, engage with the community, and develop their artistic practice.'),
      block('Related programs: TURN2, UJUZI.'),
    ],
  },
  {
    slug: 'ujuzi',
    title: 'UJUZI',
    blocks: [
      block('What is UJUZI', 'h2'),
      block('UJUZI is a collaboratively produced alternative learning program for East African artists. UJUZI adopts a holistic approach to artistic education encompassing creative research methodologies and contextual thinking to develop conceptual and aesthetic rigour.'),
      block('The program is delivered through a partnership between the Nairobi Contemporary Art Institute and Untethered Magic.'),
      block('Visit the UJUZI website: ujuzi.ke'),
    ],
  },
  {
    slug: 'turn2',
    title: 'TURN2',
    blocks: [
      block('April 2022 – July 2022', 'h3'),
      block('NCAI is excited to announce the three recipients of the TURN 2 residency award in Nairobi: Jumoke Adeyanju, Nathalie Anguezomo Mba Bikoro, and Kathy Ann Tan, who will be joining us between March and December of 2022.'),
      block('The German Federal Cultural Foundation, in partnership with the Centre for Arts and Urbanistics (ZK/U) and the Triangle Network, has launched the TURN2 — Curatorial Research Residencies in Berlin at ZK/U, Johannesburg at the BagFactory, Lagos at Gas Foundation and in Nairobi at NCAI. This programme aims to facilitate research for curators and cultural practitioners to foster working relationships and sustainable networks between emerging curators and established art and cultural institutions, as well as the exchange between the different art scenes.'),
    ],
  },
  {
    slug: 'offsite',
    title: 'Offsite Projects',
    blocks: [
      block('NCAI OFF SITE is a platform designed to facilitate collaboration with our partners to host exhibitions, screenings, talks and residencies beyond our gallery walls.'),
      block('NCAI is part of the Triangle Network of international arts organisations that supports artistic exchanges, residencies and knowledge sharing worldwide. Through our network of partners, NCAI OFFSITE will offer residencies to both local and international artists in Kenya.'),
      block("NCAI will host future editions of the Gathering. The Gathering is an artist's forum that offers African artists and art practitioners (local and diaspora) a chance to interact with each other outside of an institutional or commercial context."),
    ],
  },
  {
    slug: 'the-gathering',
    title: 'The Gathering',
    blocks: [
      block('The Gathering seeks to assemble artists from Africa and its diaspora with the purpose of enabling critical cross-border conversations. The inaugural Gathering saw 52 artists and art practitioners from 12 countries come together in a three-day retreat in Naivasha, Kenya. In future, we aim to grow the number of artists invited and initiate a platform that can feasibly rotate in location.'),
      block('The Gathering takes the form of a two- to three-day symposium, presenting matters of concern to African artists.'),
      block('The platform offers space for artists to interrogate and engage with the relevance of their positionality in relation to the continent. The space continues to offer practicing artists a platform to engage with each other across generations and borders. Moreover, The Gathering provides African artists a chance to interact with each other outside of an institutional context. Convened to strengthen collectivity, the Gathering was begun with the aim of fostering artist-oriented networks of support and continues to do so.'),
      block('The Gathering is a space that allows artists to further reflect on their work and practice in relation to their communities and to other communities of artists across the continent. With each iteration, the Gathering continues to seek to inspire intellectual rigour and dynamism amongst African artists.'),
    ],
  },
  {
    slug: 'press',
    title: 'Press',
    blocks: [
      block('As Seen in These Magazines', 'h2'),
      block('Selected press coverage of NCAI exhibitions and programs:'),
      block('ArtAfrica — 60 Years: Selections from the NCAI Collection'),
      block('Daily Monitor — Nairobi opens up to Xenson in solo show'),
      block('Mount Kenya Times — Preview of Olidde Mupipa by Xenson Samson Ssenkaaba'),
      block('Art Report Africa — Xenson’s first institutional and solo exhibition in Nairobi'),
      block('The East African — Van Rampelberg’s artistic journey to and from home'),
    ],
  },
]

async function main() {
  console.log(`Creating ${PAGES.length} program pages...\n`)
  let ok = 0
  for (const p of PAGES) {
    const doc = {
      _type: 'page',
      _id: `page-${p.slug}`,
      title: title(p.title),
      slug: { _type: 'slug', current: p.slug },
      body: body(p.blocks),
    }
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ /${p.slug} — ${p.title}`)
      ok++
    } catch (e) {
      console.error(`  ✗ ${p.slug}: ${e.message}`)
    }
  }
  console.log(`\nDone. ${ok}/${PAGES.length} created. URLs: /<slug> (root-level).`)
}

main().catch(e => { console.error(e); process.exit(1) })
