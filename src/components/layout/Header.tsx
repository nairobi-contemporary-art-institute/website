import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { HeaderClient } from "@/components/layout/HeaderClient";
import { OpeningStatus } from "@/components/layout/OpeningStatus";
import { getLocalizedValue } from "@/sanity/lib/utils";

// Define the type for the Sanity response
interface SiteSettings {
    headerMenu?: Array<{
        label: { _key: string; value: string }[];
        url: string;
    }>;
}

export async function Header({ locale }: { locale: string }) {
    const settings = await sanityFetch<SiteSettings>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings']
    });

    const navLinks = settings?.headerMenu?.map((link) => ({
        label: getLocalizedValue(link.label, locale) || 'Untitled',
        href: link.url
    })) || [];

    return (
        <HeaderClient
            locale={locale}
            openingStatus={<OpeningStatus locale={locale} />}
            navLinks={navLinks}
        />
    );
}
