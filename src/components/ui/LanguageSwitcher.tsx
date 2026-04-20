'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter, languages } from '@/i18n'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Translation symbol provided by user.
 */
const TranslateIcon = ({ className }: { className?: string }) => (
    <svg 
        id='Flat' 
        xmlns='http://www.w3.org/2000/svg' 
        viewBox='0 0 256 256'
        className={className}
        fill="currentColor"
    >
        <path d='M235.57178,214.21094l-56-112a4.00006,4.00006,0,0,0-7.15528,0l-22.854,45.708a92.04522,92.04522,0,0,1-55.57275-20.5752A99.707,99.707,0,0,0,123.90723,60h28.08691a4,4,0,0,0,0-8h-60V32a4,4,0,0,0-8,0V52h-60a4,4,0,0,0,0,8h91.90772a91.74207,91.74207,0,0,1-27.91895,62.03357A91.67371,91.67371,0,0,1,65.23389,86.667a4,4,0,0,0-7.542,2.668,99.63009,99.63009,0,0,0,24.30469,38.02075A91.5649,91.5649,0,0,1,23.99414,148a4,4,0,0,0,0,8,99.54451,99.54451,0,0,0,63.99951-23.22461,100.10427,100.10427,0,0,0,57.65479,22.97192L116.4165,214.21094a4,4,0,1,0,7.15528,3.57812L138.46631,188H213.522l14.89453,29.78906a4,4,0,1,0,7.15528-3.57812ZM142.46631,180l33.52783-67.05566L209.522,180Z'/>
    </svg>
)

/**
 * A sophisticated language switcher component.
 * Displays English and Swahili inline, with all other languages in a dropdown.
 */
export function LanguageSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Primary languages are English and Swahili
    const primaryLocales = ['en', 'sw']
    const otherLocales = languages.filter(lang => !primaryLocales.includes(lang.id))

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale })
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div 
            ref={containerRef}
            className="relative flex items-center gap-4 text-[10px] md:text-xs font-semibold capitalize tracking-widest leading-none"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Primary Languages */}
            <nav className="flex items-center gap-4" aria-label="Primary languages">
                {languages.filter(lang => primaryLocales.includes(lang.id)).map((lang) => (
                    <button
                        key={lang.id}
                        onClick={() => handleLocaleChange(lang.id)}
                        className={cn(
                            'hover:opacity-100 transition-all cursor-pointer opacity-70',
                            locale === lang.id && 'opacity-100 underline underline-offset-4'
                        )}
                        aria-label={`Switch language to ${lang.title}`}
                        aria-current={locale === lang.id ? 'page' : undefined}
                    >
                        {lang.id}
                    </button>
                ))}
            </nav>

            {/* Other Languages Dropdown */}
            <div className="relative flex items-center h-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "hover:opacity-100 transition-all cursor-pointer p-1 -m-1 h-full flex items-center",
                        isOpen || !primaryLocales.includes(locale) ? "opacity-100" : "opacity-70"
                    )}
                    aria-label="More languages"
                    aria-expanded={isOpen}
                >
                    <TranslateIcon className="w-4 h-4" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-full right-[-1.5rem] md:right-[-3rem] lg:right-[-3rem] mt-3 pt-2 group z-[100]"
                        >
                            <div className="bg-background-dark/95 backdrop-blur-md shadow-2xl border border-white/10 py-3 min-w-[140px] rounded-none overflow-hidden flex flex-col">
                                <div className="px-4 py-2 mb-1 text-[7px] tracking-[0.2em] text-white/40 border-b border-white/5 uppercase font-black">
                                    More Languages (Coming Soon)
                                </div>
                                {otherLocales.map((lang) => (
                                    <div
                                        key={lang.id}
                                        className="px-4 py-2.5 text-left transition-all capitalize tracking-widest text-[10px] text-white/20 cursor-not-allowed flex items-center justify-between group/lang"
                                    >
                                        <span>{lang.title}</span>
                                        <span className="text-[6px] font-black uppercase tracking-tighter opacity-0 group-hover/lang:opacity-100 transition-opacity text-white/40">Soon</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
