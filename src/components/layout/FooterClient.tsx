'use client'

import { Link } from '@/i18n'

import { ResponsiveDivider } from '@/components/ui/ResponsiveDivider'
import { SocialIcons } from './SocialIcons'
import { AccessibilityToggles } from './AccessibilityToggles'
import { NewsletterSignup } from './NewsletterSignup'
import { usePathname } from 'next/navigation'

const legalLinks = [
    { label: 'Privacy policy', url: '/privacy' },
    { label: 'Accessibility', url: '/accessibility' },
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
            title: 'What\'s On',
            links: [
                { label: 'Exhibitions', url: '/exhibitions' },
                { label: 'Public Programs', url: '/education' },
                { label: 'Events', url: '/events' },
                { label: 'Visit Us', url: '/visit' },
            ],
        },
        {
            title: 'Collection',
            links: [
                { label: 'The Channel', url: '/channel' },
                { label: 'Artists', url: '/artists' },
                { label: 'Collection', url: '/collection' },
                { label: 'Publications', url: '/publications' },
            ],
        },
        {
            title: 'Learn',
            links: [
                { label: 'Academy', url: '/education' },
                { label: 'Resources', url: '/education#resources' },
                { label: 'Fellowships', url: '/about' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Membership', url: '/get-involved' },
                { label: 'Support NCAI', url: '/get-involved' },
                { label: 'Careers', url: '/about/careers' },
                { label: 'About us', url: '/about' },
            ],
        },
    ]

    return (
        <footer className="bg-background-dark text-sun-bleached-paper">
            {/* Newsletter Row - Full Width Section above the swoosh line */}
            <div className="container pt-20 pb-4">
                <div className="max-w-2xl">
                    <NewsletterSignup />
                </div>
            </div>

            {/* Swoosh Line / Top Divider */}
            <ResponsiveDivider variant="curved" weight="medium" className="text-white" />

            {/* Main Footer Content */}
            <div className="container py-24">
                {/* Main Links Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Contact Info Column (Visit Us) */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="text-sm text-sun-bleached-paper/80 space-y-6">
                            <div className="leading-relaxed">
                                <strong className="block font-bold text-white mb-6">Visit Us</strong>
                                {contactInfo?.address ? (
                                    contactInfo.googleMapsUrl ? (
                                        <a href={contactInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                                            {contactInfo.address.split('\n').map((line, i) => (
                                                <span key={i} className="block">{line}</span>
                                            ))}
                                        </a>
                                    ) : (
                                        <div className="block">
                                            {contactInfo.address.split('\n').map((line, i) => (
                                                <span key={i} className="block">{line}</span>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <p>Rosslyn Riviera Mall,<br />Limuru Road, Nairobi</p>
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                {contactInfo?.email && (
                                    <a href={`mailto:${contactInfo.email}`} className="block hover:text-white transition-colors">
                                        {contactInfo.email}
                                    </a>
                                )}
                                {contactInfo?.phone && (
                                    <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="block hover:text-white transition-colors">
                                        {contactInfo.phone}
                                    </a>
                                )}
                            </div>

                            <div className="pt-4">
                                <SocialIcons urls={socialUrls} />
                            </div>
                        </div>
                    </div>

                    {/* Link Categories - Now taking more space (9 columns) */}
                    <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {displayCategories.map((category, index) => (
                            <div key={`${category.title}-${index}`} className="flex flex-col h-full">
                                <h4 className="text-sm font-bold mb-6 text-white min-h-[1.5rem]">
                                    {category.title}
                                </h4>
                                <ul className="space-y-3 flex-grow">
                                    {category.links.map((link, linkIndex) => (
                                         <li key={`${link.label}-${link.url}-${linkIndex}`}>
                                             <Link
                                                 href={link.url}
                                                 className="text-sm text-sun-bleached-paper/80 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline decoration-white/20"
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
            </div>

            {/* Bottom Swoosh/Divider */}
            <ResponsiveDivider variant="straight" weight="thin" className="text-white/10" />

            <div className="container py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Legal Links & Accessibility */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-normal">
                        {legalLinks.map((link, idx) => (
                            <Link
                                key={`${link.label}-${link.url}-${idx}`}
                                href={link.url}
                                className="text-sun-bleached-paper/40 hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="md:ml-4">
                            <AccessibilityToggles />
                        </div>
                    </div>

                    {/* Copyright */}
                    <p className="text-[11px] font-normal text-sun-bleached-paper/30">
                        {copyrightText || `© ${currentYear} Nairobi Contemporary Art Institute`}
                    </p>
                </div>
            </div>
        </footer>
    )
}
