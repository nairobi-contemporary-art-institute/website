"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Play } from "lucide-react"

// Dynamic import to avoid SSR issues with player
import ReactPlayerProps from 'react-player'

// Dynamic import to avoid SSR issues with player
// Forced cast to any to avoid build type errors with dynamic component props
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface MediaPlayerProps {
    type: 'video' | 'audio' | 'article'
    url?: string
    audioUrl?: string
    thumbnail?: string
}

export function MediaPlayer({ type, url, audioUrl, thumbnail }: MediaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
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
    if (type === 'video' && url && mounted) {
        return (
            <div className="relative aspect-video w-full max-w-5xl mx-auto bg-black overflow-hidden group mb-12 shadow-2xl">
                <ReactPlayer
                    url={url}
                    playing={isPlaying}
                    controls
                    width="100%"
                    height="100%"
                    light={thumbnail || true} // Use thumbnail as preview
                    playIcon={
                        <div className="w-24 h-24 bg-white/90 backdrop-blur flex items-center justify-center pl-1 shadow-2xl transform hover:scale-110 transition-transform duration-300 group-hover:bg-white">
                            <Play className="w-10 h-10 fill-charcoal text-charcoal" />
                        </div>
                    }
                />
            </div>
        )
    }

    return null
}
