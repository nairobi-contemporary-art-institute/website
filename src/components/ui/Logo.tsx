import React from 'react'

export function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 61.95 81.25"
            aria-labelledby="ncai-logo-title"
            className={className}
            style={style}
            fill="currentColor"
        >
            <title id="ncai-logo-title">Nairobi Contemporary Art Institute</title>
            <path d="M23.1 0h15.75v55.42H23.1zM46.51 26.93h15.44v54.33H46.51zM0 26.93h15.44v54.33H0z" />
        </svg>
    )
}
