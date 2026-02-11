'use client'

import Link from 'next/link'
import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { SocialIcons } from './SocialIcons'
import { AccessibilityToggles } from './AccessibilityToggles'
import { NewsletterSignup } from './NewsletterSignup'

// Placeholder footer data – will be replaced with Sanity fetch
const footerCategories = [
    {
        title: 'Learn & Engage',
        links: [
            { label: 'Journal (Channel)', url: '/channel' },
            { label: 'Public Programs', url: '/education' },
            { label: 'Exhibitions', url: '/exhibitions' },
            { label: 'Artists', url: '/artists' },
            { label: 'Collection', url: '/collection' },
        ],
    },
    {
        title: 'Get Involved',
        links: [
            { label: 'Become a Member', url: '/membership' },
            { label: 'Donate', url: '/support' },
            { label: 'Jobs & Internships', url: '/careers' },
            { label: 'Volunteer', url: '/volunteer' },
        ],
    },
    {
        title: 'NCAI',
        links: [
            { label: 'About us', url: '/about' },
            { label: 'Visit', url: '/visit' },
            { label: 'Contact', url: '/contact' },
            { label: 'Press', url: '/press' },
            { label: 'Styleguide', url: '/styleguide' },
        ],
    },
]

const legalLinks = [
    { label: 'Privacy policy', url: '/privacy' },
    { label: 'Terms & conditions', url: '/terms' },
    { label: 'About ncai.art', url: '/about' },
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-ivory text-charcoal">
            {/* Top Divider */}
            <ResponsiveDivider variant="straight" weight="thin" className="text-umber/30" />

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Newsletter Section */}
                    <div className="lg:col-span-5">
                        <NewsletterSignup />
                        <div className="mt-8">
                            <SocialIcons />
                        </div>
                    </div>

                    {/* Link Categories */}
                    {footerCategories.map((category) => (
                        <div key={category.title} className="lg:col-span-2">
                            <h4 className="text-lg font-bold uppercase tracking-tight mb-4">
                                {category.title}
                            </h4>
                            <ul className="space-y-2">
                                {category.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.url}
                                            className="text-sm text-charcoal/90 hover:text-ochre transition-colors duration-200 underline-offset-2 hover:underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <ResponsiveDivider variant="straight" weight="thin" className="text-umber/30" />

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Legal Links & Accessibility */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.url}
                                className="text-charcoal/90 hover:text-ochre transition-colors duration-200 underline-offset-2 hover:underline"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <AccessibilityToggles />
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-charcoal/90">
                        © {currentYear} Nairobi Contemporary Art Institute
                    </p>
                </div>
            </div>
        </footer>
    )
}
