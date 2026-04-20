'use client';

import React, { useState, useEffect } from 'react';
import { getLocalizedValue, portableTextToPlainText } from "@/sanity/lib/utils";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Moon, Snowflake, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// Types for the props passed from the Server Component wrapper
interface OpeningStatusData {
    locale: string;
    hours: any;
    specialStatus: any;
    weather: any;
}

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

export function OpeningStatusClient({ locale, hours, specialStatus, weather }: OpeningStatusData) {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setNow(new Date());

        // Update every minute to keep status current
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // 1. Check for Special Override First (Deterministic)
    if (specialStatus?.isActive && specialStatus?.message) {
        const message = getLocalizedValue(specialStatus.message, locale);
        return (
            <div 
                className="w-full text-center py-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 bg-black text-ivory group-[.notice-theme-dark]/header:bg-white group-[.notice-theme-dark]/header:text-charcoal"
                suppressHydrationWarning
            >
                {message ? (typeof message === 'string' ? message : portableTextToPlainText(message)) : "Temporarily Closed"}
            </div>
        );
    }

    // Helper to format time for display
    const formatTimeDisplay = (time24: string) => {
        if (!time24) return '';
        const [h, m] = time24.split(':').map(Number);
        const suffix = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        return `${h12}${m > 0 ? `:${m.toString().padStart(2, '0')}` : ''} ${suffix}`;
    };

    // If not mounted yet, render a "safe" server-side state (Closed Now) to prevent mismatch
    const calculationTime = now || new Date(); // Fallback for SSR

    const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' });
    const currentDayName = dayFormatter.format(calculationTime).toLowerCase();

    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Nairobi' });
    const timeString = timeFormatter.format(calculationTime);

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayIndex = calculationTime.getDay();

    const getNextOpening = () => {
        for (let i = 0; i < 7; i++) {
            const index = (todayIndex + i) % 7;
            const dayName = daysOfWeek[index];
            const dayHours = hours?.[dayName];

            if (dayHours?.open && dayHours?.close) {
                if (i === 0 && timeString < dayHours.open) {
                    return { day: 'today', time: dayHours.open };
                }
                if (i > 0) {
                    return { day: dayName, time: dayHours.open };
                }
            }
        }
        return null;
    };

    const todayHours = hours?.[currentDayName];
    let statusMessage = "Closed Now";
    let isOpen = false;

    if (todayHours?.open && todayHours?.close && timeString >= todayHours.open && timeString < todayHours.close) {
        statusMessage = `Open until ${formatTimeDisplay(todayHours.close)}`;
        isOpen = true;
    } else {
        const next = getNextOpening();
        if (next) {
            const dayLabel = next.day === 'today' ? '' : `${next.day.charAt(0).toUpperCase() + next.day.slice(1)} `;
            statusMessage = `Closed Now — Opens ${dayLabel}${formatTimeDisplay(next.time)}`;
        }
    }

    return (
        <div 
            className="w-full py-1.5 flex justify-center items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 bg-black text-ivory/90 group-[.notice-theme-dark]/header:bg-white group-[.notice-theme-dark]/header:text-charcoal"
            suppressHydrationWarning
        >
            <div className="flex items-center gap-2" suppressHydrationWarning>
                <div className={`w-1.5 h-1.5 transition-colors duration-500 ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500/50'}`} />
                <span suppressHydrationWarning>
                    {!mounted ? "Checking status..." : `${statusMessage} — Rosslyn Riviera Mall, Nairobi`}
                </span>
            </div>

            {weather?.current && (
                <div className="flex items-center gap-2 pl-4 border-l border-current/20" suppressHydrationWarning>
                    {getWeatherIcon(weather.current.weather_code, weather.current.is_day === 0)}
                    <span>{Math.round(weather.current.temperature_2m)}°C</span>
                </div>
            )}
        </div>
    );
}
