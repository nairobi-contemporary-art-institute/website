'use client'

import { useState } from 'react'
import Link from 'next/link'

export function NewsletterSignup() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Placeholder – actual integration TBD
        console.log('Newsletter signup:', email)
        alert('Thank you for subscribing! (Placeholder)')
        setEmail('')
    }

    return (
        <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4">
                Sign up for<br />our newsletter
            </h3>
            <form onSubmit={handleSubmit} className="flex border border-charcoal">
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
                    className="flex-1 px-4 py-3 bg-transparent text-charcoal placeholder:text-umber/90 focus:outline-none"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-charcoal text-ivory font-medium uppercase tracking-wide hover:bg-umber transition-colors duration-200"
                >
                    Sign up
                </button>
            </form>
            <p className="mt-3 text-xs text-umber/80">
                By subscribing, you agree to our{' '}
                <Link href="/privacy" className="underline hover:text-ochre">
                    Privacy Policy
                </Link>{' '}
                and consent to receive updates from NCAI.
            </p>
        </div>
    )
}
