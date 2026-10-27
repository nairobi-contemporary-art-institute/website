#!/usr/bin/env node
/**
 * One-off: fill in the missing languages on the CMS-driven header and footer
 * nav labels (siteSettings.headerMenu / footerCategories).
 *
 * Each label is an internationalized array keyed by locale. Only languages
 * that are missing or blank are added; existing translations are never
 * overwritten. Labels are matched on their English value — any English label
 * not in LABELS below is reported and left alone.
 *
 * Idempotent; patches the published doc and the draft if one exists.
 *
 * Usage:
 *   node scripts/translate-nav-labels.mjs           # dry run
 *   node scripts/translate-nav-labels.mjs --apply   # write to Sanity (needs SANITY_API_TOKEN)
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const APPLY = process.argv.includes('--apply')
const token = process.env.SANITY_API_TOKEN
if (!token) throw new Error('SANITY_API_TOKEN env var required (see .env.local)')

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-08',
    useCdn: false,
    token,
})

// Same order as `languages` in src/i18n.ts, minus en.
const LANGS = ['sw', 'ar', 'hi', 'de', 'pt', 'fr', 'es', 'am', 'so']

const WHATS_ON = { sw: 'Kinachoendelea', ar: 'ما يُعرض الآن', hi: 'क्या चल रहा है', de: 'Programm', pt: 'Agenda', fr: 'Agenda', es: 'Agenda', am: 'ወቅታዊ ዝግጅቶች', so: 'Waxa Socda' }

// Wording follows messages/*.json wherever the same term appears there.
const LABELS = {
    'Find Us': { sw: 'Tupate', ar: 'اعثر علينا', hi: 'हमें खोजें', de: 'So finden Sie uns', pt: 'Encontre-nos', fr: 'Nous trouver', es: 'Cómo encontrarnos', am: 'እኛን ለማግኘት', so: 'Na Hel' },
    'Directions': { sw: 'Maelekezo', ar: 'الاتجاهات', hi: 'रास्ता', de: 'Anfahrt', pt: 'Como chegar', fr: 'Itinéraire', es: 'Cómo llegar', am: 'አቅጣጫ', so: 'Tilmaamaha' },
    'Information': { sw: 'Habari', ar: 'معلومات', hi: 'जानकारी', de: 'Informationen', pt: 'Informações', fr: 'Informations', es: 'Información', am: 'መረጃ', so: 'Macluumaad' },
    'Plan Your Visit': { sw: 'Panga Ziara Yako', ar: 'خطط لزيارتك', hi: 'अपनी यात्रा की योजना बनाएँ', de: 'Besuch planen', pt: 'Planeie a sua visita', fr: 'Préparer votre visite', es: 'Planifica tu visita', am: 'ጉብኝትዎን ያቅዱ', so: 'Qorshee Booqashadaada' },
    'Accessibility': { sw: 'Ufikiaji', ar: 'إمكانية الوصول', hi: 'सुलभता', de: 'Barrierefreiheit', pt: 'Acessibilidade', fr: 'Accessibilité', es: 'Accesibilidad', am: 'ተደራሽነት', so: 'Helitaanka' },
    'Visit': { sw: 'Tembelea', ar: 'زيارة', hi: 'भ्रमण', de: 'Besuch', pt: 'Visitar', fr: 'Visiter', es: 'Visita', am: 'ይጎብኙ', so: 'Booqo' },
    'Visit Us': { sw: 'Tutembelee', ar: 'زورونا', hi: 'हमसे मिलने आएँ', de: 'Besuchen Sie uns', pt: 'Visite-nos', fr: 'Nous rendre visite', es: 'Visítanos', am: 'ይጎብኙን', so: 'Na Booqo' },
    'Showing': { sw: 'Sasa', ar: 'المعروض حاليًا', hi: 'अभी प्रदर्शित', de: 'Aktuell', pt: 'Em exibição', fr: 'En cours', es: 'En exhibición', am: 'በመታየት ላይ', so: 'Hadda Socda' },
    'Upcoming': { sw: 'Yajayo', ar: 'القادمة', hi: 'आगामी', de: 'Demnächst', pt: 'Próximas', fr: 'À venir', es: 'Próximas', am: 'መጪ', so: 'Soo Socda' },
    'Archive': { sw: 'Kumbukumbu', ar: 'الأرشيف', hi: 'अभिलेखागार', de: 'Archiv', pt: 'Arquivo', fr: 'Archives', es: 'Archivo', am: 'ማኅደር', so: 'Kaydka' },
    'Exhibitions': { sw: 'Maonyesho', ar: 'المعارض', hi: 'प्रदर्शनियाँ', de: 'Ausstellungen', pt: 'Exposições', fr: 'Expositions', es: 'Exposiciones', am: 'ኤግዚቢሽኖች', so: 'Bandhigyo' },
    "What's On": WHATS_ON,
    'What´s ON': WHATS_ON,
    'Videos': { sw: 'Video', ar: 'فيديو', hi: 'वीडियो', de: 'Videos', pt: 'Vídeos', fr: 'Vidéos', es: 'Vídeos', am: 'ቪዲዮዎች', so: 'Muuqaallo' },
    'Watch': { sw: 'Tazama', ar: 'شاهد', hi: 'देखें', de: 'Ansehen', pt: 'Ver', fr: 'Regarder', es: 'Ver', am: 'ይመልከቱ', so: 'Daawo' },
    'Podcasts': { sw: 'Podikasti', ar: 'بودكاست', hi: 'पॉडकास्ट', de: 'Podcasts', pt: 'Podcasts', fr: 'Podcasts', es: 'Pódcasts', am: 'ፖድካስቶች', so: 'Podkaasyo' },
    'Listen': { sw: 'Sikiliza', ar: 'استمع', hi: 'सुनें', de: 'Anhören', pt: 'Ouvir', fr: 'Écouter', es: 'Escuchar', am: 'ያዳምጡ', so: 'Dhageyso' },
    'Channel': { sw: 'Chaneli', ar: 'المجلة', hi: 'चैनल', de: 'Kanal', pt: 'Canal', fr: 'Chaîne', es: 'Canal', am: 'ቻናል', so: 'Kanaalka' },
    'The Channel': { sw: 'Chaneli', ar: 'المجلة', hi: 'चैनल', de: 'Kanal', pt: 'O Canal', fr: 'La Chaîne', es: 'El Canal', am: 'ቻናሉ', so: 'Kanaalka' },
    'Texts': { sw: 'Maandishi', ar: 'نصوص', hi: 'लेख', de: 'Texte', pt: 'Textos', fr: 'Textes', es: 'Textos', am: 'ጽሑፎች', so: 'Qoraallo' },
    'Read': { sw: 'Soma', ar: 'اقرأ', hi: 'पढ़ें', de: 'Lesen', pt: 'Ler', fr: 'Lire', es: 'Leer', am: 'ያንብቡ', so: 'Akhri' },
    'Essays': { sw: 'Insha', ar: 'مقالات', hi: 'निबंध', de: 'Essays', pt: 'Ensaios', fr: 'Essais', es: 'Ensayos', am: 'መጣጥፎች', so: 'Maqaallo' },
    'Interviews': { sw: 'Mahojiano', ar: 'مقابلات', hi: 'साक्षात्कार', de: 'Interviews', pt: 'Entrevistas', fr: 'Entretiens', es: 'Entrevistas', am: 'ቃለ መጠይቆች', so: 'Wareysiyo' },
    'Conversations': { sw: 'Mazungumzo', ar: 'حوارات', hi: 'संवाद', de: 'Gespräche', pt: 'Conversas', fr: 'Conversations', es: 'Conversaciones', am: 'ውይይቶች', so: 'Wada sheekaysiyo' },
    "Artists' Writings": { sw: 'Maandishi ya wasanii', ar: 'كتابات الفنانين', hi: 'कलाकारों के लेखन', de: 'Künstler*innentexte', pt: 'Escritos de artistas', fr: "Écrits d'artistes", es: 'Escritos de artistas', am: 'የአርቲስቶች ጽሑፎች', so: 'Qoraallada fanaaniinta' },
    'Education': { sw: 'Elimu', ar: 'التعليم', hi: 'शिक्षा', de: 'Vermittlung', pt: 'Educação', fr: 'Éducation', es: 'Educación', am: 'ትምህርት', so: 'Waxbarasho' },
    'Public Programmes': { sw: 'Programu za Umma', ar: 'البرامج العامة', hi: 'सार्वजनिक कार्यक्रम', de: 'Öffentliche Programme', pt: 'Programas públicos', fr: 'Programmes publics', es: 'Programas públicos', am: 'ሕዝባዊ ፕሮግራሞች', so: 'Barnaamijyada Dadweynaha' },
    'Events': { sw: 'Matukio', ar: 'الفعاليات', hi: 'आयोजन', de: 'Veranstaltungen', pt: 'Eventos', fr: 'Événements', es: 'Eventos', am: 'ዝግጅቶች', so: 'Dhacdooyin' },
    'Resources': { sw: 'Rasilimali', ar: 'الموارد', hi: 'संसाधन', de: 'Ressourcen', pt: 'Recursos', fr: 'Ressources', es: 'Recursos', am: 'መርጃዎች', so: 'Kheyraad' },
    'Artists': { sw: 'Wasanii', ar: 'الفنانون', hi: 'कलाकार', de: 'Künstler*innen', pt: 'Artistas', fr: 'Artistes', es: 'Artistas', am: 'አርቲስቶች', so: 'Fanaaniinta' },
    'Collection': { sw: 'Mkusanyiko', ar: 'المجموعة', hi: 'संग्रह', de: 'Sammlung', pt: 'Coleção', fr: 'Collection', es: 'Colección', am: 'ስብስብ', so: 'Ururinta' },
    'Publications': { sw: 'Machapisho', ar: 'المنشورات', hi: 'प्रकाशन', de: 'Publikationen', pt: 'Publicações', fr: 'Publications', es: 'Publicaciones', am: 'ሕትመቶች', so: 'Daabacaadyo' },
    'About': { sw: 'Kuhusu', ar: 'حول', hi: 'परिचय', de: 'Über uns', pt: 'Sobre', fr: 'À propos', es: 'Acerca de', am: 'ስለ እኛ', so: 'Nagu Saabsan' },
    'About Us': { sw: 'Kuhusu Sisi', ar: 'من نحن', hi: 'हमारे बारे में', de: 'Über uns', pt: 'Sobre nós', fr: 'Qui sommes-nous', es: 'Sobre nosotros', am: 'ስለ እኛ', so: 'Nagu Saabsan' },
    'Careers': { sw: 'Nafasi za Kazi', ar: 'الوظائف', hi: 'करियर', de: 'Karriere', pt: 'Carreiras', fr: 'Carrières', es: 'Empleo', am: 'የሥራ ዕድሎች', so: 'Shaqooyin' },
    'Membership': { sw: 'Uanachama', ar: 'العضوية', hi: 'सदस्यता', de: 'Mitgliedschaft', pt: 'Adesão', fr: 'Adhésion', es: 'Membresía', am: 'አባልነት', so: 'Xubinnimo' },
    'Support': { sw: 'Tuunge Mkono', ar: 'ادعمنا', hi: 'समर्थन करें', de: 'Unterstützen', pt: 'Apoiar', fr: 'Soutenir', es: 'Apoyar', am: 'ይደግፉ', so: 'Taageero' },
    'Support NCAI': { sw: 'Saidia NCAI', ar: 'ادعم المعهد', hi: 'NCAI का समर्थन करें', de: 'NCAI unterstützen', pt: 'Apoie o NCAI', fr: 'Soutenir le NCAI', es: 'Apoya al NCAI', am: 'NCAIን ይደግፉ', so: 'Taageer NCAI' },
}

const isLabel = (value) =>
    Array.isArray(value) && value.length > 0 && value.every((v) => v?._type === 'internationalizedArrayStringValue')

function translateLabel(label, log, unknown) {
    const en = label.find((v) => v._key === 'en')?.value?.trim()
    const translations = en && LABELS[en]
    if (!translations) {
        if (en) unknown.add(en)
        return label
    }
    const added = []
    const next = label.map((v) => {
        if (v._key === 'en' || v.value?.trim() || !translations[v._key]) return v
        added.push(v._key)
        return { ...v, value: translations[v._key] }
    })
    for (const lang of LANGS) {
        if (next.some((v) => v._key === lang)) continue
        added.push(lang)
        next.push({ _key: lang, _type: 'internationalizedArrayStringValue', value: translations[lang] })
    }
    if (added.length) log(`"${en}": + ${added.join(', ')}`)
    return next
}

function walk(node, log, unknown) {
    if (isLabel(node)) return translateLabel(node, log, unknown)
    if (Array.isArray(node)) return node.map((item) => walk(item, log, unknown))
    if (node && typeof node === 'object') {
        return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v, log, unknown)]))
    }
    return node
}

async function run() {
    const docs = await client.fetch(
        `*[_id in ["siteSettings", "drafts.siteSettings"]]{ _id, headerMenu, footerCategories }`
    )
    if (!docs.length) throw new Error('siteSettings not found')

    for (const doc of docs) {
        const changes = []
        const unknown = new Set()
        const log = (line) => changes.push(line)
        const headerMenu = walk(doc.headerMenu, log, unknown)
        const footerCategories = walk(doc.footerCategories, log, unknown)

        console.log(`\n${doc._id}: ${changes.length} label(s) to fill`)
        changes.forEach((line) => console.log(`  ${line}`))
        if (unknown.size) console.log(`  not in LABELS, left as is: ${[...unknown].map((l) => `"${l}"`).join(', ')}`)

        if (!changes.length || !APPLY) continue
        await client.patch(doc._id).set({ headerMenu, footerCategories }).commit()
        console.log('  ✓ written')
    }

    if (!APPLY) console.log('\nDry run only. Re-run with --apply to write.')
}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
