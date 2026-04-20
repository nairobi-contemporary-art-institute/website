import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configuration - Uses variables from your .env.local
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ngte58ft',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-12',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const footerData = [
    {
        _key: 'whats-on',
        title: [{ _key: 'en', value: "What's On" }],
        links: [
            { _key: 'v1', label: [{ _key: 'en', value: 'Exhibitions' }], url: '/exhibitions' },
            { _key: 'v2', label: [{ _key: 'en', value: 'Public Programs' }], url: '/education' },
            { _key: 'v3', label: [{ _key: 'en', value: 'Events' }], url: '/events' },
            { _key: 'v4', label: [{ _key: 'en', value: 'Visit Us' }], url: '/visit' },
        ]
    },
    {
        _key: 'collection',
        title: [{ _key: 'en', value: 'Collection' }],
        links: [
            { _key: 'r1', label: [{ _key: 'en', value: 'The Channel' }], url: '/channel' },
            { _key: 'r2', label: [{ _key: 'en', value: 'Artists' }], url: '/artists' },
            { _key: 'r3', label: [{ _key: 'en', value: 'Collection' }], url: '/collection' },
            { _key: 'r4', label: [{ _key: 'en', value: 'Publications' }], url: '/publications' },
        ]
    },
    {
        _key: 'learn',
        title: [{ _key: 'en', value: 'Learn' }],
        links: [
            { _key: 'l1', label: [{ _key: 'en', value: 'Academy' }], url: '/education' },
            { _key: 'l2', label: [{ _key: 'en', value: 'Resources' }], url: '/education#resources' },
            { _key: 'l3', label: [{ _key: 'en', value: 'Fellowships' }], url: '/about' },
        ]
    },
    {
        _key: 'support',
        title: [{ _key: 'en', value: 'Support' }],
        links: [
            { _key: 'c1', label: [{ _key: 'en', value: 'Membership' }], url: '/get-involved' },
            { _key: 'c2', label: [{ _key: 'en', value: 'Support NCAI' }], url: '/get-involved' },
            { _key: 'c3', label: [{ _key: 'en', value: 'Careers' }], url: '/about/careers' },
            { _key: 'c4', label: [{ _key: 'en', value: 'About us' }], url: '/about' },
        ]
    }
];

async function updateFooter() {
    if (!process.env.SANITY_API_TOKEN) {
        console.error('Error: SANITY_API_TOKEN is not set in your environment.');
        process.exit(1);
    }

    try {
        console.log('Fetching existing siteSettings...');
        const existing = await client.fetch('*[_id == "siteSettings"][0]');

        if (!existing) {
            console.log('No siteSettings found, creating new one...');
            await client.create({
                _id: 'siteSettings',
                _type: 'siteSettings',
                footerCategories: footerData
            });
        } else {
            console.log('Updating existing siteSettings...');
            await client.patch('siteSettings')
                .set({ footerCategories: footerData })
                .commit();
        }

        console.log('Successfully updated footer architecture in Sanity!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

updateFooter();
