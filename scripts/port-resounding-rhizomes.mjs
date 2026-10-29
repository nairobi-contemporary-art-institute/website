#!/usr/bin/env node
/**
 * One-off: port Resounding Rhizomes from ncai254.com (Wix) into Sanity, and put it
 * and NCAI in Venice in the homepage hero.
 *
 * - Exhibition: correct dates (24 Sep 2026 – 10 Jan 2027), installation views,
 *   press kit + exhibition guide (downloaded from Google Drive), curator, 8 artists.
 * - Artists: created with the Wix bio (client copy) and one work each, whose image
 *   becomes the artist image (caption as on Wix).
 * - NCAI in Venice: Biennale Arte 2026 dates (9 May – 22 Nov 2026, labiennale.org).
 * - homePage.hero: carousel of the two exhibitions, styled like the existing slide.
 *
 * Idempotent: deterministic ids, createOrReplace / set. Assets are uploaded once per run
 * (Sanity dedupes identical files).
 *
 * Usage:
 *   node scripts/port-resounding-rhizomes.mjs           # dry run
 *   node scripts/port-resounding-rhizomes.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { randomBytes } from 'node:crypto'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

const SOURCE = 'https://www.ncai254.com/exhibition-resoundingrhizomes'
const EXHIBITION_ID = 'exhibition-resounding-rhizomes'
const VENICE_ID = 'ncaiinvenice'
const wix = (id) => `https://static.wixstatic.com/media/7b6770_${id}`

const key = () => randomBytes(6).toString('hex')
const intl = (type, value) => [{ _key: 'en', _type: `internationalizedArray${type}Value`, value }]
const ref = (id) => ({ _key: key(), _type: 'reference', _ref: id })
const blocks = (paras) =>
    paras.map((text) => ({
        _key: key(), _type: 'block', style: 'normal', markDefs: [],
        children: [{ _key: key(), _type: 'span', marks: [], text }],
    }))
const slugify = (s) =>
    s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const firstSentences = (text, n = 2) => (text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text]).slice(0, n).join('').trim()

const INSTALLATION = [
    '3864fe9fe1654ba989d8e77390b09fe3~mv2.png',
    '4cc6443a4cfa44aeafd6a4b620822e60~mv2.jpg',
    'fdd13d182129471d8d7dc46bcc5dde1b~mv2.jpg',
    'b1fa7c4e4ba44540bbb10ae49c9ded28~mv2.png',
    'fc4a7770c7134e119e8b86c086c2e78e~mv2.jpg',
    'df3b3de3f7bb45a18788465c9b3cd4f2~mv2.png',
]

const DOWNLOADS = {
    pressKit: '1vmZJEnyPH6fvGNszXcp1Fpiy4YYYTuJM',
    exhibitionGuide: '100Cp8EVCg9I8HSqzv6x3lb7KeYvCRYWQ',
}

// Bios and captions verbatim from the Wix exhibition page.
const ARTISTS = [
    {
        name: 'Leo Asemota',
        image: '422ee4d346cf4cf9942e245e0050601d~mv2.png',
        // Wix repeats Fabiana Ex-Souza's caption under this image, so only the credit is kept.
        work: null,
        bio: 'Leo Asemota is an Edo native, born in Benin City, Nigeria, with places of residence in London, England, and Benin City. He has worked in the UK since 1997. He studied film and photography at the London Institute and began his career as photographic art-director-at-large at Blues & Soul magazine, later working as a Creative Director on projects for Raw Material Music & Media, London Weekend Television, and 198 Gallery in association with Human Rights Watch International. His multidisciplinary practice encompasses film, photography, drawings, artist’s books, sculpture, and performance, engaging subjects including art and life, science and identity, individuality and culture, death and history. In 2004, he established the Estate of Leo Asemota (EotLA) to promote and preserve his artistic output. His work has been presented internationally, including at the Lagos Biennial, Villa Romana, documenta 14, Dakar Biennale, SAVVY Contemporary Berlin, and Sharjah Biennial 14.',
    },
    {
        name: 'Rehema Chachage',
        image: '7e4449bf9d2b44d4be7aef7e48ab8ea5~mv2.jpg',
        work: { title: 'Notes on Baking (A Recipe for Togetherness)', year: '2022' },
        bio: 'Rehema Chachage maintains a research- and process-based practice spanning performance, photography, video, olfactory elements, voice, text, and installation. Grounded in generational knowledge and alternative modes of storytelling, remembering, and re-membering, her work produces immersive, multisensory experiences. Central is her exploration of matrilineal family memory, developed with her mother and grandmother through a “performative archive” of memories, stories, songs, rituals, and oral traditions. Her practice examines the body as a site and medium of historical knowledge, tracing histories and embodied narratives while refusing erasure through intergenerational continuity. She holds a BA in Fine Art from Michaelis School of Fine Art, University of Cape Town; an MA in Contemporary Art Theory from Goldsmiths, University of London; and a PhD in Practice from the Academy of Fine Arts, Vienna. Her work has been exhibited widely across Africa, Europe, Asia, and the Americas. She has been shortlisted for the Vordemberge-Gildewart Award and Belvedere Art Award, and received the LIVE WORKS Performance Act Award, H13 Lower Austria Prize for Performance, and Henrike Grohs Art Award. Her interdisciplinary, collaborative practice draws on Tanzania and explores communal togetherness, matrilineal narratives, decolonial feminist thought, and performative archives. Through installations, performances, research, pedagogy, and participatory workshops, she foregrounds how communities, particularly women’s networks, transform memory and embodied knowledge into strategies of survival, care, and continuity.',
    },
    {
        name: 'Jim Chuchu',
        image: 'c3f4d73b59ba4b1f80b5555fdd3ac8e3~mv2.png',
        work: { title: 'The Camera Cannot Eat', year: '2025' },
        bio: 'Jim Chuchu makes video, photography, and music that examine what a body is permitted to remember and become. Across more than a decade, his practice begins with and resists the extractive gaze on the Black, queer body, following that gaze outward to the land. His recent essay film, The Camera Cannot Eat, turns this interrogation onto visual economies built around African food and land and is currently showing at the 61st Venice Biennale. As part of the Nest Collective, he co-created the International Inventories Programme, which tracked the movement and non-movement of more than 32,000 Kenyan cultural objects held outside the country, shaping his thinking on ownership, restitution, and who gets to hold the story. At the intersection of blackness, queerness, and spirituality, his work challenges and expands the boundaries of African identity, exploring permissions granted to the Black body, possibilities available to the Black soul, and the existence of queer bodies in a continent that often denies their history. His interdisciplinary practice blends reality with surreal and supernatural elements rooted in African cultures, using music, film, and community projects to convey stories and pursue justice and belonging.',
    },
    {
        name: 'Letaru Dralega',
        image: '28310a37c6ba4a7dab1b86bac8a18c6a~mv2.jpg',
        work: { title: 'Mi Ife Manyi Yi Mvuza (You Give Me Drinking Water)', year: '2024', note: 'shown as Aamvu (I Drank/Garden), 2026' },
        bio: 'Letaru Dralega is a Ugandan Jamaican British artist based in Kampala. A social scientist by training, her process-centred practice uses collage, painting, installation, and sound to probe the material/spiritual dichotomy and ponder the postcolonial condition. She is an alumna of 32 Degrees East and Asiko Art School Praia and a Prince Claus Seed Awardee supported by the British Council. She currently co-directs Afropocene Studio Lab and The Capsule, two experimental project spaces in Kampala.',
    },
    {
        name: 'Fabiana Ex-Souza',
        image: 'df3b3de3f7bb45a18788465c9b3cd4f2~mv2.png',
        work: { title: 'Plusieurs Manteaux to Bispo', year: '2019–2022' },
        bio: 'Born in 1980 in Belo Horizonte, Brazil, Fabiana Ex-Souza lives and works in Paris. An Afro-Brazilian multidisciplinary artist and researcher, she holds a PhD in visual arts and photography and a Master’s degree in arts from Université Paris 8, and a Fine Arts diploma from Escola Guignard, Brazil. Her practice spans sculpture, embroidered textiles, video, performance, installation, and photography, often incorporating plant-based materials. She explores histories and latent powers embedded in plants, using natural preservation techniques to transform works into living archives. Seeds are central as material and record, responding to the disappearance of plant varieties through industrial agriculture and lobbying pressures. The name “Ex-Souza” marks a personal act of self-reinvention, reclaiming inherited histories and transforming them into spaces for creation, experimentation, and dialogue. Her work engages memory, materiality, and traces of colonial encounters across the Atlantic, rooted in biological processes. She has presented work at institutions including SESC Pompéia, MUMCAB, Dakar Biennale, La Gaîté Lyrique, Le LaM, Fondation Fiminco, Centre Pompidou, Fondation Cartier, and Maison de l’Amérique Latine. Recent residencies include Aura: Making Germination of Repair and Duvangu. Her recognitions include La Vie Bonne, Mondes Nouveaux, COAL Plante!, and SUITE/CNAP, and her work is held by FRAC Nouvelle-Aquitaine, Fonds d’Art Contemporain de la Ville de Paris, and CNAP.',
    },
    {
        name: 'Em’kal Eyongakpa',
        image: 'fc4a7770c7134e119e8b86c086c2e78e~mv2.jpg',
        work: { title: 'Khaya/Mahogany Mo(u)rnings, C35 Food & Medicinal Gardens, Ketoya Speaks', year: '2024–2026' },
        bio: 'Em’kal Eyongakpa lives and works between the Cross River basin, the Cameroon Volcanic Line, and Western Europe. His ideas and artworks habitually mimic, evoke, or employ natural elements, processes, and phenomena. His practice increasingly draws on Indigenous knowledge systems, ethnobotany, applied mycology, and technology. His interwoven installations function as paradoxical systems that blur the boundaries between media and can alter perceptions of the real and the illusory.',
    },
    {
        name: 'Linda Lamignan',
        image: 'bf33d5575466449bae859ef84107283c~mv2.jpg',
        work: { title: 'Obou Agbara - By the Edge of the Creek', year: '2026' },
        bio: 'Linda Karin Lamignan Larsen is based in Copenhagen, Denmark. Her practice is connected to the landscapes her ancestors belonged to, where rivers, islands, and oil fields shape history and identity. Through an intuitive relationship with materials, technologies, and kinship, she opens portals between the ancestral and digital, spiritual and industrial. She works with petroleum wax, metals, commodities, and self-recorded video, using materials charged with geological and political weight as vessels for stories of land, identity, and extraction. Rooted in an animist worldview in which everything is alive and interconnected, her practice translates across generations, geographies, and human and non-human beings. Oral histories shared by family members inform her video works, sonic compositions, and sculptural forms, creating a living archive where memory is fluid and collective. Working closely with friends and family, she develops artworks through exchange and co-creation, and her practice is not bound by medium or singular authorship. She holds an MFA from the Royal Danish Academy of Fine Arts in Copenhagen and a BFA from the Oslo National Academy of the Arts. Her work has been exhibited at Kunsthal Charlottenborg, Buffalo AKG Art Museum, Post Territory Ujeongguk, Galleri F15, and Lunds Konsthall, and she participated in BEDROCK, the 2025 Liverpool Biennial.',
    },
    {
        name: 'Maggie Otieno',
        image: '8d696ce357de4c9884907fd96f9c857f~mv2.jpg',
        work: { title: 'Mwangalifu II (The Observant One)', year: '2026' },
        bio: 'Maggie Otieno (b. 1974, Nairobi, Kenya) is a Kenyan sculptor whose nearly three-decade practice centres on transforming reclaimed, historically charged, and distressed materials. Working primarily with monumental timber and metal, her semi-abstract forms examine colonial history, collective memory, environmental survival, and interpersonal dynamics. Initially trained in painting and design at the Creative Art Centre in Nairobi, she transitioned to sculpture in 1999 following international workshops and formal mentorships. Her practice prominently uses century-old railway sleepers laid across East Africa during British colonial expansion. Through an intuitive, responsive process, she works with their structural scars, weathering, and weight, creating sculptures that act as vessels of remembrance and sites of renewal. Her work has been exhibited across Kenya, the UAE, Egypt, South Africa, Ethiopia, Italy, and the UK, including the Anthropocene Museum 9.0 at the Sharjah Architecture Triennial (2023) and Resonance at the Fondazione Giorgio e Armanda Marchesani during the Venice Biennale (2026). Her works are held in civic and private collections, including commissions for Kenya Railways and Trade & Development Bank. She also mentors emerging contemporary artists from her Nairobi studio.',
    },
]

async function upload(kind, url, filename) {
    if (!APPLY) return `${kind}-DRY-RUN`
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    // Drive serves PDFs as octet-stream, and an HTML warning page for large files.
    if (kind === 'file' && buf.subarray(0, 4).toString() !== '%PDF') throw new Error(`${url} did not return a PDF`)
    const asset = await client.assets.upload(kind, buf, { filename, ...(kind === 'file' && { contentType: 'application/pdf' }) })
    return asset._id
}

const image = (assetId, alt, caption) => ({
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt,
    ...(caption && { caption: intl('String', caption) }),
})

// ── artists + works ─────────────────────────────────────────────────────────
const tx = client.transaction()
const artistIds = []
for (const a of ARTISTS) {
    const slug = slugify(a.name)
    const id = `artist-${slug}`
    artistIds.push(id)
    const caption = a.work ? `© ${a.name}, ${a.work.title}, ${a.work.year}${a.work.note ? `, ${a.work.note}` : ''}` : `© ${a.name}`
    const assetId = await upload('image', wix(a.image), `${slug}.${a.image.split('.').pop()}`)
    tx.createOrReplace({
        _id: id,
        _type: 'artist',
        name: intl('String', a.name),
        slug: { _type: 'slug', current: slug },
        bio: intl('BlockContent', blocks([firstSentences(a.bio)])),
        longBio: intl('BlockContent', blocks([a.bio])),
        image: image(assetId, a.work ? `${a.name}, ${a.work.title}` : `Work by ${a.name}`, caption),
        featuredExhibitions: [ref(EXHIBITION_ID)],
    })
    console.log(`${APPLY ? '' : '[dry] '}artist  ${id}`)
    if (a.work) {
        const workId = `work-${slug}-${slugify(a.work.title).slice(0, 40)}`
        tx.createOrReplace({
            _id: workId,
            _type: 'work',
            title: intl('String', a.work.title),
            artist: { _type: 'reference', _ref: id },
            year: a.work.year,
            exhibitions: [ref(EXHIBITION_ID)],
            image: image(assetId, `${a.name}, ${a.work.title}`, caption),
            showOnArtistProfile: true,
            showInCollection: false,
        })
        console.log(`${APPLY ? '' : '[dry] '}work    ${workId}`)
    }
}

// ── curator ─────────────────────────────────────────────────────────────────
const CURATOR_ID = 'person-aude-christel-mgba'
tx.createOrReplace({
    _id: CURATOR_ID,
    _type: 'person',
    name: intl('String', 'Aude Christel Mgba'),
    slug: { _type: 'slug', current: 'aude-christel-mgba' },
    hasProfile: false,
})

// ── exhibition ──────────────────────────────────────────────────────────────
const views = []
for (const [i, file] of INSTALLATION.entries()) {
    const assetId = await upload('image', wix(file), `resounding-rhizomes-${i + 1}.${file.split('.').pop()}`)
    views.push({ _key: `view${i}`, ...image(assetId, `Resounding Rhizomes, installation view ${i + 1}`) })
}
const files = {}
for (const [field, driveId] of Object.entries(DOWNLOADS)) {
    try {
        const assetId = await upload('file', `https://drive.google.com/uc?export=download&id=${driveId}`, `resounding-rhizomes-${field}.pdf`)
        files[field] = { _type: 'file', asset: { _type: 'reference', _ref: assetId } }
        console.log(`${APPLY ? '' : '[dry] '}file    ${field}`)
    } catch (err) {
        console.log(`  ${field} not uploaded: ${err.message}`)
    }
}
tx.patch(EXHIBITION_ID, (p) =>
    p.set({
        startDate: '2026-09-24',
        endDate: '2027-01-10',
        artists: artistIds.map(ref),
        curators: [ref(CURATOR_ID)],
        installationViews: views,
        ...files,
    }),
)
tx.patch(VENICE_ID, (p) =>
    p.set({
        startDate: '2026-05-09',
        endDate: '2026-11-22',
        location: intl('String', 'Venice, Italy · 61st International Art Exhibition, In Minor Keys'),
    }),
)

// ── homepage hero ───────────────────────────────────────────────────────────
const [rr, venice, current] = await Promise.all([
    client.fetch(`*[_id==$id][0]{"img": mainImage.asset._ref, "text": pt::text(description[0].value)}`, { id: EXHIBITION_ID }),
    client.fetch(`*[_id==$id][0]{"img": mainImage.asset._ref, "text": pt::text(description[0].value)}`, { id: VENICE_ID }),
    client.fetch(`*[_id=="homePage"][0].hero.slides[0]`),
])
// Keep the existing slide's look (gradient, contrast, sizing) for both new slides.
const { _key, image: _img, title: _t, subtitle: _s, preHeading: _p, description: _d, date: _dt, link: _l, location: _loc, ...style } = current || {}
const slide = ({ img, alt, pre, title, subtitle, text, start, end, location, linkId }) => ({
    ...style,
    _key: key(),
    _type: 'heroSlide',
    image: { _type: 'image', asset: { _type: 'reference', _ref: img }, alt },
    preHeading: intl('String', pre),
    title: intl('String', title),
    subtitle: intl('String', subtitle),
    description: intl('BlockContent', blocks([firstSentences(text, 2)])),
    date: { startDate: start, endDate: end },
    location: intl('String', location),
    link: { reference: { _type: 'reference', _ref: linkId } },
})
const slides = [
    slide({
        img: rr.img, alt: 'Resounding Rhizomes', pre: 'Current Exhibition', title: 'Resounding Rhizomes',
        subtitle: 'Curated by Aude Christel Mgba', text: rr.text, start: '2026-09-24', end: '2027-01-10',
        location: 'NCAI, Rosslyn Riviera Mall', linkId: EXHIBITION_ID,
    }),
    slide({
        img: venice.img, alt: 'NCAI in Venice', pre: 'Biennale Arte 2026', title: 'NCAI in Venice',
        subtitle: 'In Minor Keys, 61st International Art Exhibition', text: venice.text, start: '2026-05-09', end: '2026-11-22',
        location: 'Venice, Italy', linkId: VENICE_ID,
    }),
]
for (const id of ['homePage', 'drafts.homePage']) {
    const exists = await client.fetch('defined(*[_id==$id][0]._id)', { id })
    if (exists) tx.patch(id, (p) => p.set({ 'hero.mode': 'carousel', 'hero.enabled': true, 'hero.slides': slides }))
}
console.log(`${APPLY ? '' : '[dry] '}hero    2 slides (Resounding Rhizomes, NCAI in Venice)`)

if (APPLY) {
    await tx.commit()
    console.log('Committed.')
} else console.log('Dry run. Re-run with --apply to write.')
