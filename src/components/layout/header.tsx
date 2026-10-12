'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/constants/routes'

import { useSession } from '@/lib/auth/auth-provider'
import { cn } from '@/lib/utils'

import { Logo } from '../shared/logo'
import { Button } from '../ui/button'

import { MobileNav } from './mobile-nav'
import { NavLinks } from './nav-links'
import { UserMenu } from './user-menu'

export function Header() {
	const { isAuthorized } = useSession()

	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header
			className={cn(
				'sticky inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
				isScrolled
					? 'border-border bg-background/80 backdrop-blur-xl'
					: 'border-transparent bg-background'
			)}
		>
			<div className='frame-container'>
				<div className='flex h-16 items-center justify-between gap-6 px-1 sm:px-3'>
					<div className='flex items-center gap-10'>
						<Link
							href={ROUTES.HOME}
							className='flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight'
						>
							<Logo className='h-7 w-auto' />
							TeaCoder
						</Link>
						<NavLinks />
					</div>
					<div className='flex items-center gap-2'>
						<div className='hidden items-center md:flex'>
							{isAuthorized ? (
								<UserMenu />
							) : (
								<div className='flex items-center gap-2'>
									<Button variant='ghost' size='sm' asChild>
										<Link href={ROUTES.AUTH.LOGIN()}>
											Войти
										</Link>
									</Button>
									<Button size='sm' asChild>
										<Link href={ROUTES.AUTH.REGISTER}>
											Регистрация
										</Link>
									</Button>
								</div>
							)}
						</div>
						<div className='md:hidden'>
							<MobileNav />
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
