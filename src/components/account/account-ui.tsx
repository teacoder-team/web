import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface AccountHeaderProps {
	title: string
	description?: string
	action?: ReactNode
}

export function AccountHeader({
	title,
	description,
	action
}: AccountHeaderProps) {
	return (
		<header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div>
				<h1 className='font-display text-display-lg font-medium text-balance'>
					{title}
				</h1>
				{description && (
					<p className='mt-2 max-w-xl text-muted-foreground'>
						{description}
					</p>
				)}
			</div>
			{action && <div className='shrink-0 max-sm:*:w-full'>{action}</div>}
		</header>
	)
}

interface SettingsSectionProps {
	title?: string
	description?: string
	tone?: 'default' | 'danger'
	children: ReactNode
	className?: string
}

export function SettingsSection({
	title,
	description,
	tone = 'default',
	children,
	className
}: SettingsSectionProps) {
	return (
		<section className={className}>
			{(title || description) && (
				<div className='mb-3 px-1'>
					{title && (
						<h2 className='font-display text-lg font-medium tracking-tight'>
							{title}
						</h2>
					)}
					{description && (
						<p className='mt-1 text-sm text-muted-foreground'>
							{description}
						</p>
					)}
				</div>
			)}
			<div
				className={cn(
					'divide-y divide-border overflow-hidden rounded-3xl border bg-card',
					tone === 'danger'
						? 'border-destructive/30'
						: 'border-border'
				)}
			>
				{children}
			</div>
		</section>
	)
}

interface SettingsRowProps {
	icon?: ReactNode
	title: ReactNode
	badge?: ReactNode
	description?: ReactNode
	children?: ReactNode
	className?: string
}

export function SettingsRow({
	icon,
	title,
	badge,
	description,
	children,
	className
}: SettingsRowProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6',
				className
			)}
		>
			<div className='flex min-w-0 items-start gap-3.5 sm:gap-4'>
				{icon && (
					<span className='flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground [&_svg]:size-[18px]'>
						{icon}
					</span>
				)}
				<div className='min-w-0'>
					<div className='flex flex-wrap items-center gap-2'>
						<h3 className='min-w-0 font-medium'>{title}</h3>
						{badge}
					</div>
					{description && (
						<div className='mt-1 text-sm leading-relaxed text-muted-foreground'>
							{description}
						</div>
					)}
				</div>
			</div>
			{children && (
				<div className='flex w-full shrink-0 flex-wrap items-center gap-2 max-sm:*:flex-1 sm:w-auto sm:justify-end'>
					{children}
				</div>
			)}
		</div>
	)
}

export function SettingsRowSkeleton() {
	return (
		<div className='flex items-center justify-between gap-6 p-4 sm:p-6'>
			<div className='flex items-center gap-4'>
				<div className='size-10 animate-pulse rounded-2xl bg-foreground/6' />
				<div className='space-y-2'>
					<div className='h-4 w-32 animate-pulse rounded-md bg-foreground/6' />
					<div className='h-3 w-56 animate-pulse rounded-md bg-foreground/6' />
				</div>
			</div>
			<div className='h-10 w-28 animate-pulse rounded-full bg-foreground/6' />
		</div>
	)
}
