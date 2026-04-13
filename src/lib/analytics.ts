'use client'

/**
 * Analytics utility for NCAI website.
 * Provides a unified interface for tracking events across GA4/GTM.
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        ; (window as any).gtag('config', GA_TRACKING_ID, {
            page_path: url,
        })
    }
}

// Track specific events
export const event = ({ action, category, label, value }: {
    action: string
    category: string
    label: string
    value?: number
}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        ; (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}

/**
 * Custom hook for tracking events
 */
export const useAnalytics = () => {
    return {
        trackEvent: event,
        trackPageView: pageview,
    }
}
