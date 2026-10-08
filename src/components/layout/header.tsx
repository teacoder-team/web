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
				'sticky left-0 right-0 top-0 z-50 transition-all duration-300',
				isScrolled
					? 'bg-background/85 shadow-sm backdrop-blur-md'
					: 'bg-background'
			)}
		>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 w-full items-center justify-between'>
					<div className='flex items-center'>
						<Link
							href={ROUTES.HOME}
							className='mr-10 flex items-center gap-x-3 text-xl font-bold text-blue-600'
						>
							<Logo className='size-8' />
							TeaCoder
						</Link>
					</div>
					<div className='absolute left-1/2 hidden -translate-x-1/2 items-center md:flex'>
						<NavLinks />
					</div>
					<div className='flex items-center gap-4'>
						<div className='hidden items-center space-x-3 md:flex'>
							{isAuthorized ? (
								<UserMenu />
							) : (
								<div className='flex items-center gap-5'>
									<Button
										variant='outline'
										size='sm'
										className='rounded-full'
										asChild
									>
										<Link href={ROUTES.AUTH.LOGIN()}>
											Войти
										</Link>
									</Button>
									<Button
										variant='primary'
										size='sm'
										className='rounded-full'
										asChild
									>
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
