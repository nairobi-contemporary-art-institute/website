'use client'

import React, { useEffect, useState } from 'react'
import { Footprints, Car, CarTaxiFront, BusFront, Motorbike } from 'lucide-react'
import { Link } from '@/i18n'
import { getLocalizedValue, portableTextToPlainText } from '@/sanity/lib/utils'

interface DayHours { open?: string; close?: string }

interface VisitUsProps {
    locale: string
    hours?: Record<string, DayHours | undefined>
    specialStatus?: { isActive?: boolean; message?: any }
    contactInfo?: { address?: string; phone?: string; googleMapsUrl?: string }
    labels: {
        title: string
        openingHours: string
        location: string
        open: string
        closed: string
        today: string
        tomorrow: string
        fullHours: string
        viewMap: string
        directions: string
        walk: string
        car: string
        taxi: string
        matatu: string
        bodaBoda: string
    }
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// Modes that suit Rosslyn Riviera, Nairobi (no tram/rail/cycling).
const TRANSPORT = [
    { key: 'walk', Icon: Footprints },
    { key: 'car', Icon: Car },
    { key: 'taxi', Icon: CarTaxiFront },
    { key: 'matatu', Icon: BusFront },
    { key: 'bodaBoda', Icon: Motorbike },
] as const

const fmt = (t?: string) => {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}${h >= 12 ? 'pm' : 'am'}`
}

function nairobiClock(date: Date) {
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Africa/Nairobi' }).format(date).toLowerCase()
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Nairobi' }).format(date)
    return { day, time }
}

export function VisitUs({ locale, hours, specialStatus, contactInfo, labels }: VisitUsProps) {
    const [now, setNow] = useState<Date | null>(null)
    useEffect(() => {
        setNow(new Date())
        const id = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(id)
    }, [])

    const range = (d?: DayHours) => (d?.open && d?.close ? `${fmt(d.open)}–${fmt(d.close)}` : labels.closed)

    let status: React.ReactNode = null
    let todayLine: string | null = null
    let tomorrowLine: string | null = null
    if (now) {
        const { day, time } = nairobiClock(now)
        const next = nairobiClock(new Date(now.getTime() + 24 * 3600 * 1000))
        const today = hours?.[day]
        const isOpen = !!(today?.open && today?.close && time >= today.open && time < today.close)
        status = (
            <span className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-1.5 w-1.5 ${isOpen ? 'bg-emerald-400' : 'bg-red-400/70'}`} />
                {isOpen ? labels.open : labels.closed}
            </span>
        )
        const abbr = (d: string) => d.charAt(0).toUpperCase() + d.slice(1, 3)
        todayLine = `${labels.today} (${abbr(day)}): ${range(today)}`
        tomorrowLine = `${labels.tomorrow}: ${range(hours?.[next.day])}`
    }

    const override = specialStatus?.isActive ? getLocalizedValue(specialStatus.message, locale) : null
    const overrideText = override ? (typeof override === 'string' ? override : portableTextToPlainText(override)) : null
    const mapHref = contactInfo?.googleMapsUrl

    return (
        <section className="shrink-0 bg-charcoal text-white" aria-labelledby="visit-us-heading">
            <div className="page-container grid grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-12 md:py-10">
                <h2 id="visit-us-heading" className="text-2xl font-bold tracking-tight md:col-span-3 md:text-3xl">
                    {labels.title}
                </h2>

                <div className="flex flex-col gap-1 md:col-span-3">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">{labels.openingHours}</h3>
                    {overrideText ? (
                        <p className="text-sm text-white/80">{overrideText}</p>
                    ) : (
                        <div className="min-h-[72px] text-sm text-white/60" suppressHydrationWarning>
                            {status && <div className="text-white/80">{status}</div>}
                            {todayLine && <p>{todayLine}</p>}
                            {tomorrowLine && <p>{tomorrowLine}</p>}
                        </div>
                    )}
                    <Link href="/visit#opening-hours" className="mt-3 text-sm font-bold text-white/80 transition-colors duration-[600ms] hover:text-white">
                        {labels.fullHours}
                    </Link>
                </div>

                <div className="flex flex-col gap-1 md:col-span-3">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">{labels.location}</h3>
                    <address className="whitespace-pre-line text-sm not-italic text-white/60">
                        {contactInfo?.address || 'Rosslyn Riviera Mall\nNairobi, Kenya'}
                        {contactInfo?.phone && `\n${contactInfo.phone}`}
                    </address>
                    {mapHref ? (
                        <a href={mapHref} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-bold text-white/80 transition-colors duration-[600ms] hover:text-white">
                            {labels.viewMap}
                        </a>
                    ) : (
                        <Link href="/visit#directions-map" className="mt-3 text-sm font-bold text-white/80 transition-colors duration-[600ms] hover:text-white">
                            {labels.viewMap}
                        </Link>
                    )}
                </div>

                <nav aria-label={labels.directions} className="md:col-span-3">
                    <ul className="flex flex-wrap items-start gap-3">
                        {TRANSPORT.map(({ key, Icon }) => (
                            <li key={key}>
                                <Link
                                    href="/visit#directions-map"
                                    title={labels[key]}
                                    aria-label={labels[key]}
                                    className="flex h-11 w-11 items-center justify-center text-white opacity-60 transition-opacity duration-[600ms] ease-in-out hover:opacity-100 focus-visible:opacity-100"
                                >
                                    <Icon className="h-7 w-7" strokeWidth={1.25} aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    )
}
