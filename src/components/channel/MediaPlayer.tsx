"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from 'next/dynamic'
import { Play, Maximize2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Dynamic import to avoid SSR issues with player
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface MediaPlayerProps {
    type: 'video' | 'audio' | 'article'
    url?: string
    audioUrl?: string
    thumbnail?: string
}

export function MediaPlayer({ type, url, audioUrl, thumbnail }: MediaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isTheater, setIsTheater] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [showPlayer, setShowPlayer] = useState(false)
    const playerRef = useRef<any>(null)

    useEffect(() => {
        setMounted(true)
        return () => {
            // Force stop and try to pause internal player on unmount to minimize AbortError
            setIsPlaying(false)
            if (playerRef.current) {
                try {
                    const internalPlayer = playerRef.current.getInternalPlayer()
                    if (internalPlayer && typeof internalPlayer.pause === 'function') {
                        internalPlayer.pause()
                    }
                } catch (e) {
                    // Ignore errors during unmount cleanup
                }
            }
        }
    }, [])

    // Clean URL to prevent loading issues from spaces
    const cleanUrl = url?.trim()

    // Lock body scroll when theater mode is active
    useEffect(() => {
        if (isTheater) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isTheater])

    // Auto-theater on mobile landscape
    useEffect(() => {
        if (!mounted) return

        const mq = window.matchMedia('(orientation: landscape)')
        const handleOrientationChange = (e: MediaQueryListEvent | MediaQueryList) => {
            const isMobile = window.innerWidth < 1024
            if (isMobile && e.matches) {
                setIsTheater(true)
            }
        }

        mq.addEventListener('change', handleOrientationChange)
        return () => mq.removeEventListener('change', handleOrientationChange)
    }, [mounted])

    const handlePlay = useCallback(() => {
        setShowPlayer(true)
        setIsPlaying(true)
    }, [])

    if (type === 'article') return null

    // Audio Player
    if (type === 'audio' && audioUrl) {
        return (
            <div className="w-full bg-stone-100 p-6 border border-charcoal/5 mb-12">
                <audio controls className="w-full h-12 accent-umber focus:outline-none">
                    <source src={audioUrl} />
                    Your browser does not support the audio element.
                </audio>
            </div>
        )
    }

    // Video Player
    if (type === 'video' && cleanUrl && mounted) {
        return (
            <>
                <div className={cn(
                    "relative aspect-video w-full transition-all duration-500 ease-in-out bg-black overflow-hidden group mb-12 shadow-2xl",
                    isTheater
                        ? "fixed inset-0 z-[100] h-[100dvh] w-screen flex items-center justify-center m-0 max-w-none rounded-none bg-black/95 backdrop-blur-sm"
                        : "max-w-5xl mx-auto rounded-none"
                )}>
                    {hasError ? (
                        <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                            <X className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-sm font-bold capitalize tracking-widest opacity-80">Video failed to load</p>
                            <p className="text-xs mt-2 opacity-40 break-all">URL: {cleanUrl}</p>
                        </div>
                    ) : !showPlayer ? (
                        /* Custom thumbnail / play button overlay */
                        <button
                            onClick={handlePlay}
                            className="absolute inset-0 w-full h-full cursor-pointer z-10 flex items-center justify-center bg-black group/play"
                            aria-label="Play video"
                        >
                            {/* Thumbnail */}
                            {thumbnail && (
                                <Image
                                    src={thumbnail}
                                    alt="Video thumbnail"
                                    fill
                                    className="object-cover opacity-80 group-hover/play:opacity-60 transition-opacity duration-500"
                                    sizes="(max-width: 1024px) 100vw, 1024px"
                                    priority
                                />
                            )}

                            {/* Play button */}
                            <div className="relative z-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center pl-1 shadow-2xl transform hover:scale-110 transition-all duration-300">
                                <Play className="w-8 h-8 md:w-10 md:h-10 fill-charcoal text-charcoal" />
                            </div>
                        </button>
                    ) : (
                        <>
                            {/* Theater controls */}
                            <div className={cn(
                                "absolute top-6 right-6 z-[110] flex items-center gap-3 transition-all duration-300",
                                isTheater ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
                            )}>
                                {isTheater && (
                                    <span className="text-[10px] capitalize tracking-widest text-white/40 font-bold bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                        Theater Mode
                                    </span>
                                )}
                                <button
                                    onClick={() => setIsTheater(!isTheater)}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    aria-label={isTheater ? "Exit Theater Mode" : "Enter Theater Mode"}
                                >
                                    {isTheater ? (
                                        <X className="w-5 h-5 text-white" />
                                    ) : (
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    )}
                                </button>
                            </div>

                            <div className={cn(
                                "w-full h-full flex items-center justify-center",
                                isTheater ? "p-4 md:p-12" : ""
                            )}>
                                <ReactPlayer
                                    ref={playerRef}
                                    url={cleanUrl}
                                    playing={isPlaying}
                                    controls
                                    width="100%"
                                    height="100%"
                                    onError={() => setHasError(true)}
                                    config={{
                                        youtube: {
                                            playerVars: { autoplay: 1 }
                                        },
                                        mid: {
                                            playerVars: { autoplay: 1 }
                                        },
                                        vimeo: {
                                            playerOptions: { autoplay: true }
                                        }
                                    }}
                                    className={cn(
                                        "transition-all duration-500",
                                        isTheater ? "max-h-[85vh] !max-w-[95vw] shadow-2xl ring-1 ring-white/10" : ""
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>
            </>
        )
    }

    return null
}

