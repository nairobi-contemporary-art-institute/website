'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface EventRSVPFormProps {
    eventTitle: string
    eventSlug: string
    locale: string
}

export function EventRSVPForm({ eventTitle, eventSlug, locale }: EventRSVPFormProps) {
    const t = useTranslations('Pages.events.registration')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')
        setErrorMessage('')

        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get('email'),
            name: formData.get('name'),
            eventTitle,
            eventSlug,
            locale,
            consent: formData.get('consent') === 'on'
        }

        try {
            const response = await fetch('/api/events/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (result.success) {
                setStatus('success')
            } else {
                setStatus('error')
                setErrorMessage(result.error || 'Failed to register. Please try again.')
            }
        } catch (error) {
            setStatus('error')
            setErrorMessage('Connection error. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-charcoal text-off-white p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold tracking-tight">
                    {locale === 'en' ? 'Registration Complete' : 'Usajili Umekamilika'}
                </h3>
                <p className="text-off-white/70 font-light leading-relaxed">
                    {locale === 'en'
                        ? `Thank you for registering for ${eventTitle}. We have sent a confirmation email to your inbox.`
                        : `Asante kwa kujisajili kwa ajili ya ${eventTitle}. Tumekutumia barua pepe ya uthibitisho.`
                    }
                </p>
                <div className="pt-4">
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-xs font-mono capitalize tracking-widest border-b border-off-white/30 hover:border-off-white transition-colors pb-1"
                    >
                        {locale === 'en' ? 'Register another person' : 'Sajili mtu mwingine'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 border border-charcoal/5 shadow-sm space-y-8">
            <div className="space-y-2">
                <h3 className="font-mono text-xs capitalize tracking-widest text-charcoal/60">
                    {locale === 'en' ? 'Registration' : 'Usajili'}
                </h3>
                <p className="text-charcoal font-medium">
                    {locale === 'en'
                        ? 'Join us for this event. Please fill in your details below.'
                        : 'Jiunge nasi kwa tukio hili. Tafadhali jaza maelezo yako hapa chini.'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <label htmlFor="name" className="block text-xs font-mono capitalize tracking-widest text-charcoal/40 mb-2 transition-colors group-focus-within:text-umber">
                            {locale === 'en' ? 'Full Name' : 'Jina Kamili'}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder={locale === 'en' ? 'e.g. Jane Doe' : 'k.m. Jane Doe'}
                            className="w-full bg-stone-50 border-b border-charcoal/10 py-3 px-0 focus:outline-none focus:border-umber transition-colors text-charcoal placeholder:text-charcoal/20"
                        />
                    </div>

                    <div className="relative group">
                        <label htmlFor="email" className="block text-xs font-mono capitalize tracking-widest text-charcoal/40 mb-2 transition-colors group-focus-within:text-umber">
                            {locale === 'en' ? 'Email Address' : 'Anwani ya Barua Pepe'}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="jane@example.com"
                            className="w-full bg-stone-50 border-b border-charcoal/10 py-3 px-0 focus:outline-none focus:border-umber transition-colors text-charcoal placeholder:text-charcoal/20"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-3 select-none cursor-pointer group">
                    <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        className="mt-1.5 h-4 w-4 border-charcoal/20 text-umber focus:ring-umber accent-umber"
                    />
                    <label htmlFor="consent" className="text-xs text-charcoal/60 leading-relaxed cursor-pointer group-hover:text-charcoal transition-colors">
                        {locale === 'en'
                            ? 'I consent to receive updates about future events and news from NCAI. You can unsubscribe at any time.'
                            : 'Ninakubali kupokea taarifa kuhusu matukio ya baadaye na habari kutoka NCAI. Unaweza kujiondoa wakati wowote.'
                        }
                    </label>
                </div>

                {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-mono capitalize tracking-wider">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={cn(
                        "w-full py-5 font-mono text-xs capitalize tracking-[0.3em] transition-all duration-300",
                        status === 'loading'
                            ? "bg-charcoal/20 text-charcoal/40 cursor-wait"
                            : "bg-charcoal text-off-white hover:bg-umber"
                    )}
                >
                    {status === 'loading'
                        ? (locale === 'en' ? 'Processing...' : 'Inashughulikiwa...')
                        : (locale === 'en' ? 'Confirm RSVP' : 'Thibitisha RSVP')
                    }
                </button>
            </form>

            <p className="text-[10px] text-charcoal/30 font-mono capitalize tracking-widest leading-relaxed">
                By registering, you agree to our privacy policy and terms of service.
            </p>
        </div>
    )
}
