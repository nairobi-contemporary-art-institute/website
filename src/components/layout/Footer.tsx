import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { FooterClient } from "@/components/layout/FooterClient";
import { getLocalizedValue } from "@/sanity/lib/utils";

interface SiteSettings {
    footerCategories?: Array<{
        title: { _key: string; value: string }[];
        links: { label: { _key: string; value: string }[]; url: string }[];
    }>;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        youtube?: string;
        twitter?: string;
    };
    contactInfo?: {
        name?: string;
        address?: string;
        googleMapsUrl?: string;
        email?: string;
        phone?: string;
    };
    copyrightText?: { _key: string; value: string }[];
}

export async function Footer({ locale }: { locale: string }) {
    const settings = await sanityFetch<SiteSettings>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings']
    });

    const footerCategories = settings?.footerCategories?.map((cat) => ({
        title: getLocalizedValue(cat.title, locale) || 'Untitled',
        links: cat.links?.map((link) => ({
            label: getLocalizedValue(link.label, locale) || 'Untitled',
            url: link.url
        })) || []
    })) || [];

    const copyrightText = getLocalizedValue(settings?.copyrightText, locale);

    return (
        <FooterClient
            categories={footerCategories}
            socialUrls={settings?.socialLinks}
            copyrightText={copyrightText}
            contactInfo={settings?.contactInfo}
        />
    );
}
