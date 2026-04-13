'use client'

import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface BookProps {
    title: string
    color?: string
    textColor?: string
    textured?: boolean
    variant?: 'default' | 'simple'
    className?: string
    coverImage?: string
    showTitle?: boolean
    showBranding?: boolean
}

export function Book({
    title,
    color = '#7DC1C1',
    textColor = 'charcoal',
    textured = false,
    variant = 'default',
    className,
    coverImage,
    showTitle = true,
    showBranding = true,
}: BookProps) {
    const isDarkText = textColor === 'black' || textColor === 'charcoal' || textColor === '#1A1A1A'

    return (
        <div className={cn("perspective-[1200px] w-fit group select-none", className)}>
            <div
                className={cn(
                    "relative w-[180px] h-[260px] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] transform-style-3d",
                    "group-hover:rotate-y-[-20deg] group-hover:scale-[1.02]"
                )}
            >
                {/* Book Pages (The Paper Block) */}
                <div
                    className="absolute inset-y-[3px] right-0 w-[16px] transform-style-3d origin-left rotate-y-90 bg-white"
                    style={{
                        transform: 'translateX(178px) translateZ(-18px) rotateY(90deg)',
                        background: 'linear-gradient(90deg, #e0e0e0 0%, #ffffff 10%, #e0e0e0 20%, #ffffff 30%, #e0e0e0 40%, #ffffff 50%, #e0e0e0 60%, #ffffff 70%, #e0e0e0 80%, #ffffff 90%, #e0e0e0 100%)',
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                    }}
                />

                {/* Back Cover */}
                <div
                    className="absolute inset-0 rounded-r-[4px] shadow-sm"
                    style={{
                        backgroundColor: color,
                        transform: 'translateZ(-20px)',
                        filter: 'brightness(0.9)'
                    }}
                />

                {/* Internal Paper Pages (Revealed on hover) */}
                <div
                    className="absolute inset-y-[2px] right-[4px] left-[2px] bg-white rounded-r-[2px] shadow-inner"
                    style={{ transform: 'translateZ(-19px)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
                </div>

                {/* Front Cover Container */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-r-[4px] transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] transform-style-3d origin-left",
                        "group-hover:rotate-y-[-15deg] shadow-[5px_0_20px_rgba(0,0,0,0.2)]"
                    )}
                    style={{ backgroundColor: variant === 'simple' ? '#fff' : color }}
                >
                    {/* Interior of front cover */}
                    <div
                        className="absolute inset-0 bg-[#f0f0f0] rounded-r-[4px]"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    />

                    {/* Cover Content */}
                    <div className="absolute inset-0 flex flex-col items-stretch overflow-hidden rounded-r-[4px]">
                        {/* Variant: Simple (Split cover) */}
                        {variant === 'simple' && (
                            <div className="h-1/2 w-full" style={{ backgroundColor: color }} />
                        )}

                        {/* Background Image Option */}
                        {coverImage && variant === 'default' && (
                            <div className="absolute inset-0 z-0">
                                <img src={coverImage} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10" />
                            </div>
                        )}

                        {/* Texture Overlay (Linen/Noise) */}
                        {textured && (
                            <div
                                className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-multiply"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                    backgroundSize: '80px 80px'
                                }}
                            />
                        )}

                        {/* Spine Crease / Lighting */}
                        <div
                            className="absolute inset-y-0 left-0 w-[40px] pointer-events-none"
                            style={{
                                background: `linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 25%, rgba(255,255,255,0.1) 45%, rgba(0,0,0,0.04) 55%, transparent 100%)`
                            }}
                        />

                        {/* Title & Branding */}
                        <div className="relative z-10 flex-grow p-5 flex flex-col justify-between">
                            {showTitle ? (
                                <h3
                                    className={cn(
                                        "text-[15px] font-bold leading-[1.2] capitalize tracking-tight",
                                        isDarkText ? "text-charcoal" : "text-white"
                                    )}
                                    style={{
                                        color: (variant === 'simple' && !isDarkText) ? 'charcoal' : textColor,
                                        textShadow: coverImage ? '0 1px 4px rgba(0,0,0,0.3)' : 'none'
                                    }}
                                >
                                    {title}
                                </h3>
                            ) : <div />}

                            {showBranding && (
                                <div className="flex flex-col gap-3">
                                    {variant !== 'simple' && (
                                        <div className={cn("w-6 h-6 rounded-sm opacity-20", isDarkText ? "bg-black" : "bg-white")} />
                                    )}
                                    {variant === 'simple' && (
                                        <svg width="20" height="20" viewBox="0 0 100 100" className="opacity-80">
                                            <path d="M50 15L85 75H15L50 15Z" fill="currentColor" />
                                        </svg>
                                    )}
                                    <p className={cn(
                                        "text-[7px] capitalize tracking-[0.3em] font-bold opacity-40",
                                        (variant === 'simple' || isDarkText) ? "text-black" : "text-white"
                                    )}>
                                        NCAI Press
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rounded Edge highlight */}
                    <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    )
}
