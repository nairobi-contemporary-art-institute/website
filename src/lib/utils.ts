import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatExhibitionDate(startDate: string, endDate: string | undefined, locale: string) {
    if (!startDate) return ''
    const now = new Date()
    const start = new Date(startDate)
    
    const format = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(locale, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    if (start <= now) {
        if (endDate) {
            return `Now until ${format(endDate)}`
        }
        return `Open now`
    } else {
        if (endDate) {
            return `${format(startDate)} — ${format(endDate)}`
        }
        return `From ${format(startDate)}`
    }
}
