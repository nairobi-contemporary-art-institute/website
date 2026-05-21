
interface TooltipIconProps {
    className?: string;
    size?: number | string;
}

export function TooltipIcon({ className, size = 14 }: TooltipIconProps) {
    return (
        <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            x="0px" 
            y="0px" 
            width={size} 
            height={size} 
            viewBox="0 0 14 14" 
            enableBackground="new 0 0 14 14" 
            xmlSpace="preserve" 
            role="img"
            className={className}
        >
            <title>Tooltip</title>
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                fill="currentColor"
                d="M7,0C3.133,0,0,3.134,0,7s3.133,7,7,7c3.865,0,7-3.134,7-7S10.865,0,7,0zM8.164,9.41v2.569H5.835V9.41V5.96h2.329V9.41z M8.164,4.152H5.835V2.073h2.329V4.152z"
            />
        </svg>
    )
}
