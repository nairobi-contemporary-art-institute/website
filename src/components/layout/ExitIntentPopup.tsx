'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Check, Mail, ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { getLocalizedValueAsString } from '@/sanity/lib/utils'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { Logo } from '@/components/ui/Logo'

function RandomArtGrid({ works }: { works: any[] }) {
    const [columns, setColumns] = useState<{ id: string, work: any }[][]>([[], [], []]);
    const totalDesired = 9;

    useEffect(() => {
        if (!works || works.length === 0) return;
        const worksWithImages = works.filter(w => w.mainImage?.asset);
        if (worksWithImages.length === 0) return;

        // Initial distribution (shortest column approach)
        const initialDistribution: { id: string, work: any }[][] = [[], [], []];
        const colHeights = [0, 0, 0];
        
        for (let i = 0; i < totalDesired; i++) {
            const work = worksWithImages[Math.floor(Math.random() * worksWithImages.length)];
            const ref = work.mainImage?.asset?._ref || '';
            const dimensions = ref.includes('-') ? ref.split('-')[2]?.split('x') : null;
            const aspectRatio = dimensions ? (parseInt(dimensions[0]) || 1) / (parseInt(dimensions[1]) || 1) : 0.8;
            const heightFactor = 1 / aspectRatio;

            const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
            initialDistribution[shortestColIndex].push({
                id: Math.random().toString(36).substr(2, 9),
                work
            });
            colHeights[shortestColIndex] += heightFactor;
        }
        
        setColumns(initialDistribution);

        const interval = setInterval(() => {
            setColumns(prev => {
                const next = prev.map(col => [...col]);
                const colIndexToChange = Math.floor(Math.random() * 3);
                const itemIndexToChange = Math.floor(Math.random() * next[colIndexToChange].length);
                
                const newWork = worksWithImages[Math.floor(Math.random() * worksWithImages.length)];
                
                // Replace the item with a new ID to trigger transition
                next[colIndexToChange][itemIndexToChange] = {
                    id: Math.random().toString(36).substr(2, 9),
                    work: newWork
                };
                
                return next;
            });
        }, 800);

        return () => clearInterval(interval);
    }, [works]);

    return (
        <div className="w-full h-[450px] overflow-hidden relative">
            <div className="flex gap-4 w-full absolute inset-0">
                {columns.map((column, colIdx) => (
                    <div key={colIdx} className="flex-1 flex flex-col gap-4">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {column.map((item) => {
                                const ref = item.work.mainImage?.asset?._ref || '';
                                const dimensions = ref.includes('-') ? ref.split('-')[2]?.split('x') : null;
                                const aspectRatio = dimensions ? (parseInt(dimensions[0]) || 1) / (parseInt(dimensions[1]) || 1) : 0.8;
                                
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                                        transition={{ 
                                            opacity: { duration: 0.5 },
                                            layout: { duration: 0.8, ease: "circOut" }
                                        }}
                                        className="relative w-full overflow-hidden"
                                        style={{ aspectRatio: `${aspectRatio}` }}
                                    >
                                        <Image
                                            src={urlFor(item.work.mainImage).width(400).url()}
                                            alt=""
                                            fill
                                            sizes="(max-width: 768px) 33vw, 15vw"
                                            className="object-contain"
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ExitIntentPopupProps {
    settings?: {
        isActive?: boolean
        title?: any
        description?: any
        cooldownDays?: number
    }
    works?: any[]
}

export default function ExitIntentPopup({ settings, works = [] }: ExitIntentPopupProps) {
    const locale = useLocale()
    const [isVisible, setIsVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    // Subscription preferences
    const [preferences, setPreferences] = useState({
        exhibitions: true,
        artistNews: true,
        events: true,
        programs: true
    })

    const title = getLocalizedValueAsString(settings?.title, locale) || (locale === 'sw' ? 'Kuwa wa kwanza kujua' : 'Be the first to know')
    const description = getLocalizedValueAsString(settings?.description, locale) || (locale === 'sw' ? 'Ili kupata habari za hivi punde kuhusu maonyesho mapya, kazi zinazopatikana, na habari za wasanii, jiandikishe kwa jarida letu.' : 'To stay up to date about new exhibitions, available works, and artist news, sign up for our newsletter.')
    const cooldownDays = settings?.cooldownDays ?? 1

    const handleClose = useCallback(() => {
        setIsVisible(false)
        localStorage.setItem('ncai_exit_intent_last_shown', Date.now().toString())
    }, [])

    useEffect(() => {
        if (settings?.isActive === false) return;

        const checkExitIntent = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                const lastShown = localStorage.getItem('ncai_exit_intent_last_shown')
                const now = Date.now()
                const cooldown = cooldownDays * 24 * 60 * 60 * 1000

                if (!lastShown || now - parseInt(lastShown) > cooldown) {
                    setIsVisible(true)
                }
            }
        }

        document.addEventListener('mouseleave', checkExitIntent)
        return () => document.removeEventListener('mouseleave', checkExitIntent)
    }, [cooldownDays, settings?.isActive])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    preferences,
                    source: 'exit_intent'
                })
            })

            const data = await response.json()
            if (response.ok) {
                setStatus('success')
                setTimeout(() => {
                    handleClose()
                }, 3000)
            } else {
                setStatus('error')
                setMessage(data.error || 'Something went wrong')
            }
        } catch (error) {
            setStatus('error')
            setMessage('Network error')
        }
    }

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col md:flex-row min-h-[600px]">
                            <div className="hidden md:flex md:w-1/2 bg-stone-950 p-12 flex-col justify-between text-white border-r border-stone-800 relative">
                                <div className="z-10 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2">
                                            <Logo className="h-10 w-auto" />
                                        </div>
                                        <span className="text-3xl font-bold tracking-tight uppercase">NCAI</span>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-center py-12">
                                    <div className="w-full aspect-[4/3] max-w-md relative">
                                        <RandomArtGrid works={works} />
                                    </div>
                                </div>

                                <div className="text-[10px] text-stone-500 uppercase tracking-[0.2em] z-10 relative font-medium">
                                    © {new Date().getFullYear()} NAIROBI CONTEMPORARY ART INSTITUTE
                                </div>
                            </div>

                            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        <div className="w-20 h-20 bg-stone-100 flex items-center justify-center mx-auto mb-6">
                                            <Check className="text-stone-900" size={40} />
                                        </div>
                                        <h2 className="text-3xl font-medium tracking-tight mb-4">You're on the list</h2>
                                        <p className="text-stone-500 max-w-xs mx-auto leading-relaxed">
                                            Thank you for joining our community. We look forward to sharing our latest news with you.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h2 className="text-4xl font-semibold tracking-tight mb-4 leading-tight">{title}</h2>
                                            <p className="text-stone-500 text-lg leading-relaxed max-w-md">
                                                {description}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Email address"
                                                    required
                                                    className="w-full px-0 py-4 bg-transparent border-b border-stone-200 outline-none focus:border-stone-900 transition-colors text-lg placeholder:text-stone-300"
                                                />
                                                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={20} />
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-6">
                                                    Select your preferences
                                                </p>
                                                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                                    {Object.entries(preferences).map(([key, value]) => (
                                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                            <div
                                                                onClick={() => togglePreference(key as keyof typeof preferences)}
                                                                className={`w-5 h-5 border transition-colors flex items-center justify-center ${value ? 'bg-stone-900 border-stone-900' : 'border-stone-300 group-hover:border-stone-500'
                                                                    }`}
                                                            >
                                                                {value && (
                                                                    <Check size={12} className="text-white" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-stone-600 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full h-16 bg-stone-900 text-white flex items-center justify-center gap-3 hover:bg-stone-800 transition-all font-medium group text-lg"
                                            >
                                                {status === 'loading' ? (
                                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin" />
                                                ) : (
                                                    <>
                                                        Subscribe Now
                                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                                    </>
                                                )}
                                            </button>

                                            {status === 'error' && (
                                                <p className="text-sm text-red-500 text-center mt-4">{message}</p>
                                            )}

                                            <p className="text-[11px] text-stone-500 text-center leading-relaxed mt-8">
                                                By subscribing, you agree to receive promotional emails. <br /> You can unsubscribe at any time.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
