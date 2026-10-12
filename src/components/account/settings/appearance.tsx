'use client'

import { Monitor, Moon, Palette, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { SettingsRow } from '../account-ui'

const THEMES = [
	{ value: 'light', label: 'Светлая', icon: Sun },
	{ value: 'dark', label: 'Тёмная', icon: Moon },
	{ value: 'system', label: 'Системная', icon: Monitor }
]

export function AppearanceForm() {
	const { theme, setTheme } = useTheme()

	// The stored theme is only known after hydration
	const [isMounted, setIsMounted] = useState(false)
	useEffect(() => setIsMounted(true), [])

	return (
		<SettingsRow
			icon={<Palette />}
			title='Тема'
			description='Светлая, тёмная или как в системе.'
		>
			<div
				role='radiogroup'
				aria-label='Тема оформления'
				className='flex rounded-full bg-secondary p-1'
			>
				{THEMES.map(option => {
					const isActive = isMounted && theme === option.value

					return (
						<button
							key={option.value}
							type='button'
							role='radio'
							aria-checked={isActive}
							onClick={() => setTheme(option.value)}
							className={cn(
								'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors',
								isActive
									? 'bg-card font-medium text-foreground shadow-card'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							<option.icon className='size-4' />
							{option.label}
						</button>
					)
				})}
			</div>
		</SettingsRow>
	)
}
