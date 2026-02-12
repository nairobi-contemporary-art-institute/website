import { client, sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getLocalizedValue } from "@/sanity/lib/utils";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Moon, Snowflake, Sun } from "lucide-react";

const STATUS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    hours,
    specialStatus
  }
`;

interface OpeningStatusProps {
    locale: string;
}

// Open-Meteo WMO Weather Codes
function getWeatherIcon(code: number, isNight: boolean) {
    if (code === 0) return isNight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />;
    if (code >= 1 && code <= 3) return <CloudSun className="w-3 h-3" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-3 h-3" />;
    if (code >= 51 && code <= 57) return <CloudDrizzle className="w-3 h-3" />;
    if (code >= 61 && code <= 67) return <CloudRain className="w-3 h-3" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-3 h-3" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-3 h-3" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="w-3 h-3" />;
    return <Cloud className="w-3 h-3" />;
}

async function getWeather() {
    try {
        // Rosslyn Riviera Mall Coordinates: -1.2292, 36.7865
        const res = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=-1.2292&longitude=36.7865&current=temperature_2m,weather_code,is_day&timezone=Africa%2FNairobi',
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        return null;
    }
}

export async function OpeningStatus({ locale }: OpeningStatusProps) {
    const [settings, weather] = await Promise.all([
        sanityFetch<any>({
            query: STATUS_QUERY,
            tags: ["siteSettings"],
        }),
        getWeather()
    ]);

    if (!settings) return null;

    const { hours, specialStatus } = settings;

    // 1. Check for Special Override First
    if (specialStatus?.isActive && specialStatus?.message) {
        const message = getLocalizedValue(specialStatus.message, locale);
        return (
            <div className="bg-umber text-ivory w-full text-center py-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                {message || "Temporarily Closed"}
            </div>
        );
    }

    // Nairobi Time Logic
    const now = new Date();
    const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' });
    const currentDayName = dayFormatter.format(now).toLowerCase();

    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Nairobi' });
    const timeString = timeFormatter.format(now);

    const formatTimeDisplay = (time24: string) => {
        if (!time24) return '';
        const [h, m] = time24.split(':').map(Number);
        const suffix = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        return `${h12}${m > 0 ? `:${m.toString().padStart(2, '0')}` : ''} ${suffix}`;
    };

    const todayHours = hours?.[currentDayName];
    let statusMessage = "Closed Today";
    let isOpen = false;

    if (todayHours?.open && todayHours?.close) {
        if (timeString >= todayHours.open && timeString < todayHours.close) {
            statusMessage = `Open until ${formatTimeDisplay(todayHours.close)}`;
            isOpen = true;
        } else if (timeString < todayHours.open) {
            statusMessage = `Opening at ${formatTimeDisplay(todayHours.open)}`;
            isOpen = false;
        } else {
            statusMessage = "Closed Now";
            isOpen = false;
        }
    }

    return (
        <div className="w-full bg-charcoal border-b border-ivory/10 py-1.5 flex justify-center items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-ivory/90">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500/50'}`} />
                <span>{statusMessage} — Rosslyn Riviera Mall, Limuru Rd, Nairobi</span>
            </div>

            {weather?.current && (
                <div className="flex items-center gap-2 pl-4 border-l border-ivory/20">
                    {getWeatherIcon(weather.current.weather_code, weather.current.is_day === 0)}
                    <span>{Math.round(weather.current.temperature_2m)}°C</span>
                </div>
            )}
        </div>
    );
}
