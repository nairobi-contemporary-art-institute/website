import Link from "next/link"
import { cn } from "@/lib/utils"

interface ResourceListProps {
    resources: Array<{ url: string; size?: number; name?: string }>
}

function formatBytes(bytes: number, decimals = 1) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function ResourceList({ resources }: ResourceListProps) {
    if (!resources || resources.length === 0) return null

    return (
        <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-umber border-b border-umber/20 pb-2">Resources</h3>
            <ul className="space-y-3">
                {resources.map((res, i) => (
                    <li key={res.url + i}>
                        <a
                            href={`${res.url}?dl=`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-3 border border-charcoal/10 hover:border-charcoal/30 bg-white transition-all hover:bg-stone-50"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-umber/60 group-hover:text-umber transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-charcoal group-hover:text-black transition-colors">
                                    {res.name || 'Download Resource'}
                                </span>
                            </div>
                            {res.size && (
                                <span className="text-xs font-mono text-charcoal/40 group-hover:text-charcoal/60 transition-colors">
                                    {formatBytes(res.size)}
                                </span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
