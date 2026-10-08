'use client'

import {
	ChartArea,
	GemIcon,
	LinkIcon,
	MonitorSmartphone,
	Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ROUTES } from '@/constants/routes'

import { cn } from '@/lib/utils'

import { buttonVariants } from '../ui/button'

export const links = [
	{
		title: 'Мой прогресс',
		href: ROUTES.ACCOUNT.ROOT,
		icon: ChartArea
	},
	{
		title: 'Настройки аккаунта',
		href: ROUTES.ACCOUNT.SETTINGS,
		icon: Settings
	},
	{
		title: 'Подписка',
		href: ROUTES.ACCOUNT.SUBSCRIPTION,
		icon: GemIcon
	},
	{
		title: 'Устройства',
		href: ROUTES.ACCOUNT.SESSIONS,
		icon: MonitorSmartphone
	},
	{
		title: 'Связанные аккаунты',
		href: ROUTES.ACCOUNT.CONNECTIONS,
		icon: LinkIcon
	}
]

export function UserNavigation() {
	const pathname = usePathname()

	return (
		<div className='group flex flex-col gap-4 py-2'>
			<nav className='grid gap-3 px-0 md:px-2'>
				{links.map((link, index) => {
					const isActive = pathname === link.href

					return (
						<Link
							key={index}
							href={link.href}
							className={cn(
								buttonVariants({
									variant: 'ghost',
									size: 'lg'
								}),
								'hover:bg-muted',
								isActive && 'h-10 bg-muted',
								'h-10 justify-start'
							)}
						>
							<link.icon className='mr-2 size-4' />
							{link.title}
						</Link>
					)
				})}
			</nav>
		</div>
	)
}
