'use client'

import {
	BookOpen,
	Gem,
	LogOut,
	type LucideIcon,
	Menu,
	UserRound,
	X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { useSession } from '@/lib/auth/auth-provider'
import { useSignOut } from '@/lib/auth/useSignOut'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

import { Logo } from '../shared/logo'
import { UserAvatar } from '../shared/user-avatar'
import { Button } from '../ui/button'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '../ui/sheet'

import { navLinks } from './nav-links'
import { links as accountLinks } from './user-navigation'

const NAV_ICONS: Record<string, LucideIcon> = {
	[ROUTES.COURSES.ROOT]: BookOpen,
	[ROUTES.ABOUT]: UserRound,
	[ROUTES.PREMIUM]: Gem
}

interface DrawerLinkProps {
	href: string
	title: string
	icon: LucideIcon
	isActive: boolean
}

function DrawerLink({ href, title, icon: Icon, isActive }: DrawerLinkProps) {
	return (
		<SheetClose asChild>
			<Link
				href={href}
				aria-current={isActive ? 'page' : undefined}
				className={cn(
					'flex h-12 items-center gap-3.5 rounded-2xl px-4 text-[15px] transition-colors',
					isActive
						? 'bg-secondary font-medium text-foreground'
						: 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
				)}
			>
				<Icon
					className={cn(
						'size-[18px] shrink-0',
						isActive && 'text-brand'
					)}
				/>
				{title}
			</Link>
		</SheetClose>
	)
}

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false)

	const pathname = usePathname()

	const { isAuthorized, user } = useSession()

	const { mutate } = useSignOut(() => setIsOpen(false))

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='size-10 rounded-full [&_svg]:size-5'
				>
					<Menu />
					<span className='sr-only'>Открыть меню</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side='right'
				className='flex w-[88%] max-w-[360px] flex-col gap-0 rounded-l-4xl border-none p-0 sm:max-w-[360px]'
			>
				<div className='flex h-16 shrink-0 items-center justify-between pr-3 pl-6'>
					<SheetTitle asChild>
						<span className='flex items-center gap-2.5 text-lg font-semibold tracking-tight'>
							<Logo className='h-7 w-auto' />
							TeaCoder
						</span>
					</SheetTitle>
					<SheetDescription className='sr-only'>
						Навигация по платформе
					</SheetDescription>
					<SheetClose asChild>
						<Button
							variant='ghost'
							size='icon'
							className='size-10 rounded-full [&_svg]:size-5'
						>
							<X />
							<span className='sr-only'>Закрыть меню</span>
						</Button>
					</SheetClose>
				</div>

				<div className='min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pt-2 pb-4'>
					{isAuthorized && user && (
						<SheetClose asChild>
							<Link
								href={ROUTES.ACCOUNT.ROOT}
								className='flex items-center gap-3 rounded-2xl bg-secondary p-3.5'
							>
								<UserAvatar
									name={user.displayName}
									src={user.avatar}
									className='size-11'
								/>
								<div className='min-w-0'>
									<p className='truncate font-medium'>
										{user.displayName}
									</p>
									{user.email && (
										<p className='truncate text-sm text-muted-foreground'>
											{user.email}
										</p>
									)}
								</div>
								{user.isPremium && (
									<Gem
										aria-label='Premium'
										className='ml-auto size-4 shrink-0 text-brand'
									/>
								)}
							</Link>
						</SheetClose>
					)}

					<nav aria-label='Основная навигация'>
						<p className='mb-2 px-4 eyebrow'>Платформа</p>
						<div className='space-y-1'>
							{navLinks.map(link => (
								<DrawerLink
									key={link.href}
									href={link.href}
									title={link.title}
									icon={NAV_ICONS[link.href] ?? BookOpen}
									isActive={pathname.startsWith(link.href)}
								/>
							))}
						</div>
					</nav>

					{isAuthorized && (
						<nav aria-label='Разделы аккаунта'>
							<p className='mb-2 px-4 eyebrow'>Аккаунт</p>
							<div className='space-y-1'>
								{accountLinks.map(link => (
									<DrawerLink
										key={link.href}
										href={link.href}
										title={link.title}
										icon={link.icon}
										isActive={pathname === link.href}
									/>
								))}
							</div>
						</nav>
					)}
				</div>

				<div className='shrink-0 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
					{isAuthorized ? (
						<Button
							variant='outline'
							size='lg'
							className='w-full text-destructive hover:text-destructive'
							onClick={() => mutate()}
						>
							<LogOut />
							Выйти
						</Button>
					) : (
						<div className='grid gap-2.5'>
							<Button size='lg' asChild>
								<SheetClose asChild>
									<Link href={ROUTES.AUTH.REGISTER}>
										Регистрация
									</Link>
								</SheetClose>
							</Button>
							<Button variant='outline' size='lg' asChild>
								<SheetClose asChild>
									<Link href={ROUTES.AUTH.LOGIN()}>
										Войти
									</Link>
								</SheetClose>
							</Button>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
