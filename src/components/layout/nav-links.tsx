'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ROUTES } from '@/constants/routes'

import { cn } from '@/lib/utils'

interface NavLink {
	title: string
	href: Route
}

export const navLinks: NavLink[] = [
	{ title: 'Курсы', href: ROUTES.COURSES.ROOT },
	{ title: 'Об основателе', href: ROUTES.ABOUT },
	{ title: 'Подписка', href: ROUTES.PREMIUM }
]

export function NavLinks() {
	const pathname = usePathname()

	return (
		<nav className='hidden items-center gap-7 md:flex'>
			{navLinks.map((link, index) => {
				const isActive = pathname.startsWith(link.href)

				return (
					<Link
						key={index}
						href={link.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(
							'rounded-sm text-[15px] transition-colors duration-200',
							isActive
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{link.title}
					</Link>
				)
			})}
		</nav>
	)
}
