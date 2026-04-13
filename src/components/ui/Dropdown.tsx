'use client'

import * as React from 'react'
import { Menu } from '@base-ui/react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
    trigger: React.ReactNode
    items: Array<{
        label: string
        value: string
        onClick?: () => void
    }>
    className?: string
}

export function Dropdown({ trigger, items, className }: DropdownProps) {
    return (
        <Menu.Root>
            <Menu.Trigger className={cn(
                "flex items-center gap-2 px-4 py-2 text-[10px] font-bold capitalize tracking-[0.2em] border border-charcoal/10 hover:border-charcoal/30 transition-all",
                className
            )}>
                {trigger}
                <ChevronDown className="w-3 h-3 text-charcoal/40" />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner sideOffset={8} align="start">
                    <Menu.Popup className="z-[100] min-w-[160px] bg-white border border-charcoal/10 shadow-xl py-2 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 duration-200">
                        {items.map((item, idx) => (
                            <Menu.Item
                                key={idx}
                                className="px-4 py-2 text-[10px] font-bold capitalize tracking-[0.1em] text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 cursor-pointer outline-none transition-colors"
                                onClick={item.onClick}
                            >
                                {item.label}
                            </Menu.Item>
                        ))}
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    )
}
