import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { HeaderClientLegacy } from "@/components/layout/legacy/HeaderClientLegacy";
import { OpeningStatus } from "@/components/layout/OpeningStatus";
import { getLocalizedValue } from "@/sanity/lib/utils";

// Define the type for the Sanity response
interface SiteSettings {
    headerMenu?: Array<{
        label: any;
        url: string;
        columns?: Array<{
            title: any;
            links: Array<{
                label: any;
                url: string;
            }>;
        }>;
    }>;
}

export async function HeaderLegacy({ locale }: { locale: string }) {
    const settings = await sanityFetch<SiteSettings>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings']
    });

    const navLinks = settings?.headerMenu?.map((item) => ({
        label: getLocalizedValue(item.label, locale) || 'Untitled',
        href: item.url,
        columns: item.columns?.map(col => ({
            title: getLocalizedValue(col.title, locale),
            links: col.links?.map(link => ({
                label: getLocalizedValue(link.label, locale) || 'Untitled',
                href: link.url
            }))
        }))
    })) || [];

    return (
        <HeaderClientLegacy
            locale={locale}
            openingStatus={<OpeningStatus locale={locale} initialData={settings} />}
            navLinks={navLinks}
        />
    );
}
