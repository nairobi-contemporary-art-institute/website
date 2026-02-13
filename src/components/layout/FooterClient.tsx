'use client'

import { Link } from '@/i18n'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { SocialIcons } from './SocialIcons'
import { AccessibilityToggles } from './AccessibilityToggles'
import { NewsletterSignup } from './NewsletterSignup'
import { usePathname } from 'next/navigation'

const legalLinks = [
    { label: 'Privacy policy', url: '/privacy' },
    { label: 'Accessibility', url: '/visit/accessibility' },
    { label: 'Terms & conditions', url: '/terms' },
    { label: 'Cookie Preferences', url: '/preferences' },
]

interface FooterCategory {
    title: string;
    links: { label: string; url: string; }[];
}

interface FooterClientProps {
    categories?: FooterCategory[];
    socialUrls?: {
        instagram?: string;
        facebook?: string;
        youtube?: string;
        twitter?: string;
    };
    contactInfo?: {
        name?: string;
        address?: string;
        email?: string;
        phone?: string;
        googleMapsUrl?: string;
    };
    copyrightText?: string;
}

export function FooterClient({ categories = [], socialUrls, contactInfo, copyrightText }: FooterClientProps) {
    const currentYear = new Date().getFullYear()
    const pathname = usePathname()
    // Check if the current route is the immersive timeline
    const isImmersive = pathname?.includes('/timeline')

    if (isImmersive) return null

    // Fallback categories if Sanity data is missing
    const displayCategories = categories.length > 0 ? categories : [
        {
            title: 'Learn & Engage',
            links: [
                { label: 'Journal (Channel)', url: '/channel' },
                { label: 'Public Programs', url: '/education' },
                { label: 'Publications', url: '/publications' },
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

    return (
        <footer className="bg-white text-charcoal">
            {/* Top Divider */}
            <ResponsiveDivider variant="curved" weight="medium" className="text-gold" />

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    {/* Contact Info (Visit Us) - Now on the left */}
                    <div className="lg:col-span-3">
                        <h4 className="text-lg font-bold uppercase tracking-tight mb-4 text-deep-umber">
                            Visit Us
                        </h4>
                        <div className="space-y-4 text-sm text-charcoal/90">
                            {contactInfo ? (
                                <div className="leading-snug">
                                    <strong className="block font-semibold mb-1">{contactInfo.name}</strong>
                                    {contactInfo.googleMapsUrl ? (
                                        <a
                                            href={contactInfo.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block hover:text-ochre transition-colors"
                                            aria-label="View on Google Maps"
                                        >
                                            {contactInfo.address?.split('\n').map((line, i) => (
                                                <span key={i} className="block">{line}</span>
                                            ))}
                                        </a>
                                    ) : (
                                        <p>
                                            {contactInfo.address?.split('\n').map((line, i) => (
                                                <span key={i} className="block">{line}</span>
                                            ))}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="leading-snug">
                                    <strong className="block font-semibold mb-1">Nairobi Contemporary Art Institute</strong>
                                    <p>Rosslyn Riviera Mall,<br />Limuru Road, Nairobi</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                {contactInfo?.email && (
                                    <a href={`mailto:${contactInfo.email}`} className="block hover:text-ochre transition-colors">
                                        {contactInfo.email}
                                    </a>
                                )}
                                {contactInfo?.phone && (
                                    <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="block hover:text-ochre transition-colors">
                                        {contactInfo.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Link Categories - Centered */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {displayCategories.map((category) => (
                            <div key={category.title}>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-deep-umber">
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

                    {/* Newsletter Section - Now on the right */}
                    <div className="lg:col-span-3">
                        <NewsletterSignup />
                        <div className="mt-8">
                            <SocialIcons urls={socialUrls} />
                        </div>
                    </div>
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
                        {copyrightText || `© ${currentYear} Nairobi Contemporary Art Institute`}
                    </p>
                </div>
            </div>
        </footer>
    )
}
