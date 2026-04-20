import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { HeaderSwitcher } from "@/components/layout/HeaderSwitcher";
import { OpeningStatus } from "@/components/layout/OpeningStatus";
import { getLocalizedValue } from "@/sanity/lib/utils";

// Define the types for the Sanity response
type LocalizedString = { _key: string; value?: string; text?: string }[];

interface HeaderMenuLink {
    label: LocalizedString;
    url: string;
}

interface HeaderMenuColumn {
    title?: LocalizedString;
    links?: HeaderMenuLink[];
}

interface HeaderMenuItem {
    label: LocalizedString;
    url: string;
    columns?: HeaderMenuColumn[];
}

interface SiteSettings {
    headerFeaturedImages?: any[];
    headerStyle?: string;
    headerMenu?: HeaderMenuItem[];
    utilityNav?: HeaderMenuLink[];
}

export async function Header({ locale }: { locale: string }) {
    const settings = await sanityFetch<SiteSettings>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings'],
        revalidate: 0
    });

    const navLinks = settings?.headerMenu?.map((item) => {
        const label = getLocalizedValue(item.label, locale) || 'Untitled';
        const href = item.url === '/programme' ? '/whats-on' : item.url;
        
        return {
            label,
            href,
            columns: item.columns?.map(col => ({
                title: getLocalizedValue(col.title, locale),
                links: col.links?.map(link => ({
                    label: getLocalizedValue(link.label, locale) || 'Untitled',
                    href: link.url === '/programme' ? '/whats-on' : link.url
                }))
            }))
        };
    }) || [];

    const utilityLinks = settings?.utilityNav?.map((item) => ({
        label: getLocalizedValue(item.label, locale) || 'Untitled',
        href: item.url
    })) || [];

    const headerStyle = settings?.headerStyle || 'ncai';

    return (
        <HeaderSwitcher
            locale={locale}
            openingStatus={<OpeningStatus locale={locale} initialData={settings} />}
            navLinks={navLinks}
            utilityLinks={utilityLinks}
            headerStyle={headerStyle}
            featuredImages={settings?.headerFeaturedImages}
        />
    );
}
