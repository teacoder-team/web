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

import { ROUTES } from '@/constants/routes'

import { useMediaSource } from '@/hooks/use-media-source'

import { useSession } from '@/lib/auth/auth-provider'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

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
	const getMediaSource = useMediaSource()

	return (
		<aside className='lg:sticky lg:top-24 lg:self-start'>
			<div className='hidden items-center gap-3 rounded-3xl border border-border bg-card p-4 lg:flex'>
				<Avatar className='size-12'>
					<AvatarImage
						src={getMediaSource(user?.avatar, 'users')}
						alt=''
					/>
					<AvatarFallback className='text-lg'>
						{user?.displayName.slice(0, 1)}
					</AvatarFallback>
				</Avatar>
				<div className='min-w-0'>
					<p className='truncate font-medium'>{user?.displayName}</p>
					{user?.email && (
						<p className='truncate text-sm text-muted-foreground'>
							{user.email}
						</p>
					)}
					{user?.isPremium && (
						<span className='mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand'>
							<Gem className='size-3' />
							Premium
						</span>
					)}
				</div>
			</div>

			<nav
				aria-label='Разделы аккаунта'
				className='-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:mt-4 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden'
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
