'use client'

import { ChartArea, LogOut, Menu, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/constants/routes'

import { useSession } from '@/lib/auth/auth-provider'
import { useSignOut } from '@/lib/auth/use-sign-out'

import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '../ui/sheet'

import { navLinks } from './nav-links'

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	const { isAuthorized } = useSession()

	const { mutate } = useSignOut(() => setIsOpen(false))

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger className='md:hidden' asChild>
				<Button
					variant='ghost'
					size='icon'
					className='size-10 rounded-full [&_svg]:size-5'
				>
					<Menu />
					<span className='sr-only'>Открыть меню</span>
				</Button>
			</SheetTrigger>
			<SheetContent className='flex flex-col gap-4' side='left'>
				<div className='flex flex-col gap-2'>
					<SheetTitle>TeaCoder</SheetTitle>
					<SheetDescription className='text-pretty text-[13px]'>
						Образовательная платформа по веб разработке
					</SheetDescription>
				</div>
				<div className='flex flex-col gap-2'>
					{navLinks.map((link, index) => (
						<Button
							key={index}
							onClick={() => {
								router.push(link.href)
								setIsOpen(false)
							}}
							variant='ghost'
							size='sm'
							className='justify-start'
						>
							{link.title}
						</Button>
					))}
					<Separator className='my-1' />
					{isAuthorized ? (
						<>
							<Button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.ROOT)
									setIsOpen(false)
								}}
								variant='ghost'
								size='sm'
								className='justify-start'
							>
								<ChartArea />
								Мой прогресс
							</Button>
							<Button
								onClick={() => {
									router.push(ROUTES.ACCOUNT.SETTINGS)
									setIsOpen(false)
								}}
								variant='ghost'
								size='sm'
								className='justify-start'
							>
								<Settings />
								Настройки
							</Button>
							<Button
								onClick={() => mutate()}
								variant='ghost'
								size='sm'
								className='justify-start !text-red-500'
							>
								<LogOut />
								Выйти
							</Button>
						</>
					) : (
						<>
							<Button
								onClick={() => {
									router.push(ROUTES.AUTH.LOGIN())
									setIsOpen(false)
								}}
								variant='outline'
								size='sm'
							>
								Войти
							</Button>
							<Button
								onClick={() => {
									router.push(ROUTES.AUTH.REGISTER)
									setIsOpen(false)
								}}
								variant='primary'
								size='sm'
							>
								Регистрация
							</Button>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
