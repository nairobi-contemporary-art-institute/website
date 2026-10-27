import { getRequestConfig } from 'next-intl/server';
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Centrally defined locales for the application.
 * These are used by Next-Intl (middleware, routing, and server-side logic)
 * as well as the Sanity Studio configuration.
 */
export const languages = [
    { id: 'en', title: 'English' },
    { id: 'sw', title: 'Kiswahili' },
    { id: 'ar', title: 'Arabic' },
    { id: 'hi', title: 'Hindi' },
    { id: 'de', title: 'German' },
    { id: 'pt', title: 'Portuguese' },
    { id: 'fr', title: 'French' },
    { id: 'es', title: 'Spanish' },
    { id: 'am', title: 'Amharic' },
    { id: 'so', title: 'Somali' }
] as const;

export const locales = languages.map((lang) => lang.id);
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * Next-Intl Routing configuration.
 */
export const routing = defineRouting({
    locales,
    defaultLocale
});

/**
 * Navigation helpers tied to the routing configuration.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);

type Messages = { [key: string]: string | Messages };

/**
 * Layer a locale's messages over the default locale's, so any key a
 * translation hasn't caught up with falls back to English instead of
 * rendering as a raw key path.
 */
function mergeMessages(base: Messages, override: Messages): Messages {
    const merged: Messages = { ...base };
    for (const [key, value] of Object.entries(override)) {
        const baseValue = base[key];
        merged[key] =
            typeof value === 'object' && typeof baseValue === 'object'
                ? mergeMessages(baseValue, value)
                : value;
    }
    return merged;
}

/**
 * Next-Intl Request configuration (Server-side).
 * This is the default export expected by the next-intl/plugin.
 */
export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming locale is supported
    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    const fallback: Messages = (await import(`../messages/${defaultLocale}.json`)).default;
    const messages =
        locale === defaultLocale
            ? fallback
            : mergeMessages(fallback, (await import(`../messages/${locale}.json`)).default);

    return { locale, messages };
});
