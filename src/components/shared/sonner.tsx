'use client'

import { useTheme } from 'next-themes'
import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
	const { resolvedTheme } = useTheme()

	return (
		<Sonner
			theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
			className='toaster group font-sans tracking-wide'
			toastOptions={{
				classNames: {
					toast: 'group toast group-[.toaster]:rounded-xl group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-popover',
					actionButton:
						'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
					cancelButton:
						'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
				}
			}}
			{...props}
		/>
	)
}
