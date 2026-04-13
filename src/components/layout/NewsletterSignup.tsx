'use client'

import { useState } from 'react'
import Link from 'next/link'

export function NewsletterSignup() {
    const [email, setEmail] = useState('')
    const [consent, setConsent] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!consent) {
            setStatus('error')
            setMessage('Please agree to the privacy policy')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            setStatus('success')
            setMessage('Thank you for subscribing!')
            setEmail('')
        } catch (err: any) {
            setStatus('error')
            setMessage(err.message || 'Failed to subscribe')
        }
    }

    return (
        <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4 text-white">
                Sign up for<br />our newsletter
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="border border-sun-bleached-paper/30 focus-within:border-white transition-colors">
                    <label htmlFor="newsletter-email" className="sr-only">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="newsletter-email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 bg-transparent text-sun-bleached-paper placeholder:text-sun-bleached-paper/40 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-6 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-white/90 transition-all duration-200 disabled:opacity-50 text-sm"
                >
                    {status === 'loading' ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
            <div className="mt-4 flex items-start gap-2">
                <input
                    type="checkbox"
                    id="newsletter-consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-3 w-3 rounded border-sun-bleached-paper/30 bg-transparent text-white focus:ring-white"
                    required
                />
                <label htmlFor="newsletter-consent" className="text-[10px] text-sun-bleached-paper/60 leading-tight">
                    By subscribing, you agree to our{' '}
                    <Link href="/privacy" className="underline hover:text-white">
                        Privacy Policy
                    </Link>{' '}
                    and consent to receive updates from NCAI.
                </label>
            </div>
            {(status === 'success' || status === 'error') && (
                <p className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-green-500' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
