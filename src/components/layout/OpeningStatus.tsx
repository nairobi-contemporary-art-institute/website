import { sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { OpeningStatusClient } from "./OpeningStatusClient";

const STATUS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    hours,
    specialStatus
  }
`;

async function getWeather() {
    try {
        const res = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=-1.2292&longitude=36.7865&current=temperature_2m,weather_code,is_day&timezone=Africa%2FNairobi',
            { next: { revalidate: 1800 } }
        );
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function OpeningStatus({ locale, initialData }: { locale: string; initialData?: any }) {
    // If we already have the settings from the parent (Header), don't fetch again
    const [settings, weather] = await Promise.all([
        initialData ? Promise.resolve(initialData) : sanityFetch<any>({ query: STATUS_QUERY, tags: ["siteSettings"] }),
        getWeather()
    ]);

    if (!settings) return null;

    return (
        <OpeningStatusClient
            locale={locale}
            hours={settings.hours}
            specialStatus={settings.specialStatus}
            weather={weather}
        />
    );
}
