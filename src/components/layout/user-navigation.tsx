'use client'

import {
	ChartArea,
	Gem,
	Link2,
	MonitorSmartphone,
	Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useSession } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

import { UserAvatar } from '../shared/user-avatar'

export const links = [
	{ title: 'Мой прогресс', href: ROUTES.ACCOUNT.ROOT, icon: ChartArea },
	{ title: 'Настройки', href: ROUTES.ACCOUNT.SETTINGS, icon: Settings },
	{ title: 'Подписка', href: ROUTES.ACCOUNT.SUBSCRIPTION, icon: Gem },
	{
		title: 'Устройства',
		href: ROUTES.ACCOUNT.SESSIONS,
		icon: MonitorSmartphone
	},
	{
		title: 'Связанные аккаунты',
		href: ROUTES.ACCOUNT.CONNECTIONS,
		icon: Link2
	}
]

export function UserNavigation() {
	const pathname = usePathname()
	const { user } = useSession()

	const navRef = useRef<HTMLElement>(null)

	// On phones the tabs scroll sideways - bring the current one into view.
	useEffect(() => {
		const nav = navRef.current
		const active = nav?.querySelector<HTMLElement>('[aria-current=page]')

		if (!nav || !active) return

		nav.scrollTo({
			left:
				active.offsetLeft - (nav.clientWidth - active.clientWidth) / 2,
			behavior: 'smooth'
		})
	}, [pathname])

	return (
		<aside className='min-w-0 lg:sticky lg:top-24 lg:self-start'>
			<div className='flex items-center gap-3 rounded-3xl border border-border bg-card p-3 sm:p-4'>
				<UserAvatar
					name={user?.displayName}
					src={user?.avatar}
					className='size-11 sm:size-12'
					fallbackClassName='text-lg'
				/>
				<div className='min-w-0'>
					<p className='truncate font-medium'>{user?.displayName}</p>
					{user?.email && (
						<p className='truncate text-sm text-muted-foreground'>
							{user.email}
						</p>
					)}
					{user?.isPremium && (
						<span className='mt-1 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand'>
							<Gem className='size-3' />
							Premium
						</span>
					)}
				</div>
			</div>

			<nav
				ref={navRef}
				aria-label='Разделы аккаунта'
				className='-mx-4 mt-3 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mt-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden'
			>
				{links.map(link => {
					const isActive = pathname === link.href

					return (
						<Link
							key={link.href}
							href={link.href}
							aria-current={isActive ? 'page' : undefined}
							className={cn(
								'flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors lg:rounded-xl lg:px-3',
								isActive
									? 'bg-card font-medium text-foreground shadow-card'
									: 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
							)}
						>
							<link.icon
								className={cn(
									'size-4 shrink-0',
									isActive && 'text-brand'
								)}
							/>
							{link.title}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
