import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

// Configuration - Uses variables from your .env.local
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ngte58ft',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-12',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const headerMenu = [
    {
        _key: 'whats-on',
        label: [{ _key: 'en', value: "What's On" }],
        url: '/whats-on',
        columns: [
            {
                _key: 'wo-1',
                title: [{ _key: 'en', value: 'Current' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Exhibitions' }], url: '/exhibitions' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Public Programs' }], url: '/education' },
                ]
            },
            {
                _key: 'wo-2',
                title: [{ _key: 'en', value: 'Upcoming' }],
                links: [
                    { _key: 'l3', label: [{ _key: 'en', value: 'Future Shows' }], url: '/exhibitions' },
                    { _key: 'l4', label: [{ _key: 'en', value: 'Events' }], url: '/events' },
                ]
            }
        ]
    },
    {
        _key: 'visit',
        label: [{ _key: 'en', value: 'Visit' }],
        url: '/visit',
        columns: [
            {
                _key: 'vi-1',
                title: [{ _key: 'en', value: 'Information' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Book Tickets' }], url: '/visit' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Directions' }], url: '/visit#directions' },
                    { _key: 'l3', label: [{ _key: 'en', value: 'Opening Hours' }], url: '/visit#hours' },
                ]
            },
            {
                _key: 'vi-2',
                title: [{ _key: 'en', value: 'Accessibility' }],
                links: [
                    { _key: 'l4', label: [{ _key: 'en', value: 'Access Info' }], url: '/accessibility' },
                    { _key: 'l5', label: [{ _key: 'en', value: 'Tours' }], url: '/visit#tours' },
                ]
            }
        ]
    },
    {
        _key: 'collection-pillar',
        label: [{ _key: 'en', value: 'Collection' }],
        url: '/collection',
        columns: [
            {
                _key: 're-1',
                title: [{ _key: 'en', value: 'Research' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Collection' }], url: '/collection' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Artists' }], url: '/artists' },
                    { _key: 'l3', label: [{ _key: 'en', value: 'Archives' }], url: '/collection' },
                ]
            },
            {
                _key: 're-2',
                title: [{ _key: 'en', value: 'Library' }],
                links: [
                    { _key: 'l4', label: [{ _key: 'en', value: 'Publications' }], url: '/publications' },
                    { _key: 'l5', label: [{ _key: 'en', value: 'Reading Room' }], url: '/about' },
                ]
            }
        ]
    },
    {
        _key: 'learn-pillar',
        label: [{ _key: 'en', value: 'Learn' }],
        url: '/education',
        columns: [
            {
                _key: 'ac-1',
                title: [{ _key: 'en', value: 'Learning' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Education Programs' }], url: '/education' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Resources' }], url: '/about' },
                ]
            },
            {
                _key: 'ac-2',
                title: [{ _key: 'en', value: 'Professional' }],
                links: [
                    { _key: 'l3', label: [{ _key: 'en', value: 'Fellowships' }], url: '/about' },
                    { _key: 'l4', label: [{ _key: 'en', value: 'Workshop' }], url: '/events' },
                ]
            }
        ]
    },
    {
        _key: 'channel',
        label: [{ _key: 'en', value: 'Channel' }],
        url: '/channel',
        columns: [
            {
                _key: 'ch-1',
                title: [{ _key: 'en', value: 'Media' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Film' }], url: '/channel' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Audio' }], url: '/channel' },
                ]
            },
            {
                _key: 'ch-2',
                title: [{ _key: 'en', value: 'Editorial' }],
                links: [
                    { _key: 'l3', label: [{ _key: 'en', value: 'Essays' }], url: '/channel' },
                    { _key: 'l4', label: [{ _key: 'en', value: 'Interviews' }], url: '/channel' },
                ]
            }
        ]
    },
    {
        _key: 'support',
        label: [{ _key: 'en', value: 'Support' }],
        url: '/get-involved',
        columns: [
            {
                _key: 'su-1',
                title: [{ _key: 'en', value: 'Giving' }],
                links: [
                    { _key: 'l1', label: [{ _key: 'en', value: 'Membership' }], url: '/get-involved' },
                    { _key: 'l2', label: [{ _key: 'en', value: 'Donate' }], url: '/get-involved' },
                ]
            },
            {
                _key: 'su-2',
                title: [{ _key: 'en', value: 'Corporate' }],
                links: [
                    { _key: 'l3', label: [{ _key: 'en', value: 'Partnerships' }], url: '/about' },
                    { _key: 'l4', label: [{ _key: 'en', value: 'Venue Hire' }], url: '/about' },
                ]
            }
        ]
    }
];

const utilityNav = [
    {
        _key: 'shop',
        label: [{ _key: 'en', value: 'Shop' }],
        url: '#'
    },
    {
        _key: 'membership',
        label: [{ _key: 'en', value: 'Membership' }],
        url: '/get-involved'
    }
];

async function updateHeader() {
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
                headerMenu,
                utilityNav,
                headerStyle: 'ncai'
            });
        } else {
            console.log('Updating existing siteSettings...');
            await client.patch('siteSettings')
                .set({ 
                    headerMenu, 
                    utilityNav,
                    headerStyle: 'ncai' 
                })
                .commit();
        }

        console.log('Successfully updated header architecture in Sanity!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

updateHeader();
