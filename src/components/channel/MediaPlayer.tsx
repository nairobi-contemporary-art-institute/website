"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from 'next/dynamic'
import { Play, Pause, Maximize2, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Dynamic import to avoid SSR issues with player
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

/**
 * Custom Slim Audio Player (Option A)
 */
function CustomAudioPlayer({ url }: { url: string }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    const togglePlay = () => {
        if (audioRef.current && isMounted.current) {
            if (isPlaying) {
                audioRef.current.pause()
                setIsPlaying(false)
            } else {
                const playPromise = audioRef.current.play()
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            if (isMounted.current) setIsPlaying(true)
                        })
                        .catch((error) => {
                            console.warn("Playback interrupted or blocked:", error)
                            if (isMounted.current) setIsPlaying(false)
                        })
                }
            }
        }
    }

    const onTimeUpdate = () => {
        if (audioRef.current && isMounted.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
    }

    const onLoadedMetadata = () => {
        if (audioRef.current && isMounted.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = (parseFloat(e.target.value) / 100) * duration
        if (audioRef.current && isMounted.current) {
            audioRef.current.currentTime = time
            setProgress(parseFloat(e.target.value))
        }
    }

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="w-full bg-ivory border border-charcoal/10 p-4 md:px-8 mb-12 shadow-sm rounded-sm">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => { if (isMounted.current) setIsPlaying(false) }}
            />
            <div className="flex items-center gap-6">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center hover:scale-105 transition-transform"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono tracking-widest text-charcoal/40 uppercase">
                        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="relative h-1 bg-charcoal/10 overflow-hidden group">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={seek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="absolute top-0 left-0 h-full bg-ochre transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

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
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    
    const playerRef = useRef<any>(null)
    const isMounted = useRef(true)

    // Handle mount/unmount safety
    useEffect(() => {
        isMounted.current = true
        setMounted(true)
        
        return () => {
            isMounted.current = false
            // Avoid setting state on unmounted component
            // We manually pause the internal player if it exists
            if (playerRef.current) {
                try {
                    const internal = playerRef.current.getInternalPlayer()
                    if (internal && typeof internal.pause === 'function') {
                        internal.pause()
                    }
                } catch (e) { /* ignore */ }
            }
        }
    }, [])

    // Clean URL to prevent loading issues from spaces
    const cleanUrl = url?.trim()

    // Lock body scroll when theater mode is active
    useEffect(() => {
        if (isTheater) {
            document.body.style.overflow = 'hidden'
            // Only auto-play if the player is actually ready
            if (showPlayer && isPlayerReady && isMounted.current) {
                setIsPlaying(true)
            }
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isTheater, showPlayer, isPlayerReady])

    // Auto-theater on mobile landscape
    useEffect(() => {
        if (!mounted) return

        const mq = window.matchMedia('(orientation: landscape)')
        const handleOrientationChange = (e: MediaQueryListEvent | MediaQueryList) => {
            const isMobile = window.innerWidth < 1024
            if (isMobile && e.matches && isMounted.current) {
                setIsTheater(true)
            }
        }

        mq.addEventListener('change', handleOrientationChange)
        return () => mq.removeEventListener('change', handleOrientationChange)
    }, [mounted])

    const handlePlay = useCallback(() => {
        if (!isMounted.current) return
        setShowPlayer(true)
        // We don't set isPlaying=true yet, we wait for onReady if possible 
        // or just set it and let ReactPlayer handle it, but wait a tick
        setTimeout(() => {
            if (isMounted.current) setIsPlaying(true)
        }, 50)
    }, [])

    const handleReady = useCallback(() => {
        if (isMounted.current) {
            setIsPlayerReady(true)
        }
    }, [])

    if (type === 'article') return null

    // Audio Player
    if (type === 'audio' && audioUrl) {
        return <CustomAudioPlayer url={audioUrl} />
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
                            <button 
                                onClick={() => { setHasError(false); setMounted(false); setTimeout(() => setMounted(true), 10); }}
                                className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/10 px-4 py-2 hover:bg-white/20 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" /> Retry
                            </button>
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
                            {/* Theater controls - moved to top-left (offset) to avoid YouTube's native corner overlays */}
                            <div className={cn(
                                "absolute top-24 left-6 z-[200] flex items-center gap-3 transition-all duration-300",
                                isTheater 
                                    ? "opacity-100 translate-y-0" 
                                    : "opacity-0 translate-y-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                            )}>
                                {isTheater && (
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold bg-charcoal/80 px-4 py-2 backdrop-blur-md shadow-2xl ring-1 ring-white/20">
                                            Theater Mode
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsTheater(!isTheater);
                                    }}
                                    className="p-4 bg-white/20 hover:bg-white/40 backdrop-blur-2xl rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,0,0,0.5)] ring-1 ring-white/30"
                                    aria-label={isTheater ? "Exit Theater Mode" : "Enter Theater Mode"}
                                >
                                    {isTheater ? (
                                        <X className="w-6 h-6 text-white" />
                                    ) : (
                                        <Maximize2 className="w-6 h-6 text-white" />
                                    )}
                                </button>
                            </div>

                            <div className={cn(
                                "w-full h-full flex items-center justify-center",
                                isTheater ? "p-4 md:p-12" : ""
                            )}>
                                <ReactPlayer
                                    ref={playerRef}
                                    src={cleanUrl}
                                    playing={isPlaying}
                                    controls
                                    width="100%"
                                    height="100%"
                                    onReady={handleReady}
                                    onPlay={() => { if (isMounted.current) setIsPlaying(true) }}
                                    onPause={() => { if (isMounted.current) setIsPlaying(false) }}
                                    onError={() => { if (isMounted.current) setHasError(true) }}
                                    config={{
                                        youtube: {
                                            playerVars: { autoplay: 1, rel: 0, modestbranding: 1 }
                                        },
                                        vimeo: {
                                            playerOptions: { autoplay: true, dnt: true }
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

