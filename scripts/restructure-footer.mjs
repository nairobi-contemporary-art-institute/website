#!/usr/bin/env node
/**
 * One-off: restructure the CMS footer into four columns that each answer one question.
 *
 *   (Visit)    how do I come?        address · email · phone · social (fixed column)
 *   What's On  what can I see?       Exhibitions · Events · Calendar · Education
 *   Explore    what can I read?      Artists · Collection · Texts · The Channel · Publications
 *   About      who is NCAI?          About NCAI · Team · Careers · Support NCAI · Contact
 *
 * Every link gets a `url` (the footer drops links without one, which is why Exhibitions,
 * Events and the Education column were missing). Labels in all 10 locales: existing CMS
 * translations are reused by English label; new ones come from NEW below (machine
 * translations, pending native review like the rest of the nav).
 *
 * The first footer column (Visit: address, email, phone, social) is fixed in FooterClient,
 * so the CMS holds the other three. Accessibility already sits in the footer's bottom bar.
 *
 * Usage:
 *   node scripts/restructure-footer.mjs           # dry run
 *   node scripts/restructure-footer.mjs --apply   # write (needs SANITY_API_TOKEN)
 */
import { randomBytes } from 'node:crypto'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const LOCALES = ['en', 'sw', 'ar', 'hi', 'de', 'pt', 'fr', 'es', 'am', 'so']
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

// Order: en, sw, ar, hi, de, pt, fr, es, am, so
const NEW = {
    'Visit': ['Visit', 'Tembelea', 'الزيارة', 'भ्रमण', 'Besuch', 'Visitar', 'Visiter', 'Visitar', 'ጉብኝት', 'Booqo'],
    "What's On": ["What's On", 'Kinachoendelea', 'ما يُعرض الآن', 'क्या चल रहा है', 'Programm', 'Programação', 'À l’affiche', 'Agenda', 'በመካሄድ ላይ', 'Waxa Socda'],
    'Explore': ['Explore', 'Gundua', 'استكشف', 'खोजें', 'Entdecken', 'Explorar', 'Explorer', 'Explorar', 'ያስሱ', 'Sahan'],
    'About': ['About', 'Kuhusu', 'عن المعهد', 'परिचय', 'Über uns', 'Sobre', 'À propos', 'Acerca de', 'ስለ እኛ', 'Ku saabsan'],
    'Plan your visit': ['Plan your visit', 'Panga ziara yako', 'خطط لزيارتك', 'अपनी यात्रा की योजना बनाएं', 'Besuch planen', 'Planeie a sua visita', 'Préparer sa visite', 'Planifica tu visita', 'ጉብኝትዎን ያቅዱ', 'Qorshee booqashadaada'],
    'Getting here': ['Getting here', 'Jinsi ya kufika', 'كيفية الوصول', 'यहाँ कैसे पहुँचें', 'Anfahrt', 'Como chegar', 'Venir au musée', 'Cómo llegar', 'እንዴት እንደሚደርሱ', 'Sida loo yimaado'],
    'Accessibility': ['Accessibility', 'Ufikivu', 'إمكانية الوصول', 'सुगम्यता', 'Barrierefreiheit', 'Acessibilidade', 'Accessibilité', 'Accesibilidad', 'ተደራሽነት', 'Helitaanka'],
    'Contact': ['Contact', 'Wasiliana nasi', 'اتصل بنا', 'संपर्क', 'Kontakt', 'Contacto', 'Contact', 'Contacto', 'ያግኙን', 'Nala soo xiriir'],
    'Exhibitions': ['Exhibitions', 'Maonyesho', 'المعارض', 'प्रदर्शनियाँ', 'Ausstellungen', 'Exposições', 'Expositions', 'Exposiciones', 'ኤግዚቢሽኖች', 'Bandhigyada'],
    'Events': ['Events', 'Matukio', 'الفعاليات', 'कार्यक्रम', 'Veranstaltungen', 'Eventos', 'Événements', 'Eventos', 'ዝግጅቶች', 'Dhacdooyinka'],
    'Calendar': ['Calendar', 'Kalenda', 'التقويم', 'कैलेंडर', 'Kalender', 'Calendário', 'Calendrier', 'Calendario', 'የቀን መቁጠሪያ', 'Jadwalka'],
    'Education': ['Education', 'Elimu', 'التعليم', 'शिक्षा', 'Bildung', 'Educação', 'Éducation', 'Educación', 'ትምህርት', 'Waxbarasho'],
    'About NCAI': ['About NCAI', 'Kuhusu NCAI', 'عن NCAI', 'NCAI के बारे में', 'Über NCAI', 'Sobre o NCAI', 'À propos du NCAI', 'Acerca del NCAI', 'ስለ NCAI', 'Ku saabsan NCAI'],
    'History': ['History', 'Historia', 'التاريخ', 'इतिहास', 'Geschichte', 'História', 'Histoire', 'Historia', 'ታሪክ', 'Taariikhda'],
    'Team': ['Team', 'Timu', 'الفريق', 'टीम', 'Team', 'Equipa', 'Équipe', 'Equipo', 'ቡድን', 'Kooxda'],
}

const COLUMNS = [
    ["What's On", [['Exhibitions', '/exhibitions'], ['Events', '/events'], ['Calendar', '/whats-on'], ['Education', '/education']]],
    ['Explore', [['Artists', '/artists'], ['Collection', '/collection'], ['Texts', '/texts'], ['The Channel', '/channel'], ['Publications', '/publications']]],
    ['About', [['About NCAI', '/about'], ['Team', '/about/team'], ['Careers', '/about/careers'], ['Support NCAI', '/get-involved'], ['Contact', '/contact']]],
]

const key = () => randomBytes(6).toString('hex')

// Existing translations in siteSettings, keyed by English label.
function collectLabels(node, out = {}) {
    if (Array.isArray(node)) {
        if (node.length && node.every((x) => x?._type === 'internationalizedArrayStringValue')) {
            const vals = Object.fromEntries(node.filter((x) => x.value).map((x) => [x._key, x.value]))
            if (vals.en && LOCALES.every((l) => vals[l])) out[vals.en.trim()] = vals
        } else node.forEach((x) => collectLabels(x, out))
    } else if (node && typeof node === 'object') Object.values(node).forEach((v) => collectLabels(v, out))
    return out
}

const doc = await client.getDocument('siteSettings')
const existing = collectLabels(doc)
const label = (en) => {
    const vals = NEW[en] ? Object.fromEntries(LOCALES.map((l, i) => [l, NEW[en][i]])) : existing[en]
    if (!vals) throw new Error(`No translations for "${en}"`)
    return LOCALES.map((l) => ({ _key: l, _type: 'internationalizedArrayStringValue', value: vals[l] }))
}

const footerCategories = COLUMNS.map(([title, links]) => ({
    _key: key(),
    _type: 'footerCategory',
    title: label(title),
    links: links.map(([text, url]) => ({ _key: key(), _type: 'footerLink', label: label(text), url })),
}))

for (const [title, links] of COLUMNS) console.log(`${title.padEnd(10)} ${links.map(([t, u]) => `${t} (${u})`).join(' · ')}`)

for (const id of ['siteSettings', 'drafts.siteSettings']) {
    const exists = await client.fetch('defined(*[_id==$id][0]._id)', { id })
    if (!exists) continue
    if (APPLY) await client.patch(id).set({ footerCategories }).commit()
    console.log(`${APPLY ? 'patched' : '[dry] would patch'} ${id}`)
}
