'use client'

import {
	ArrowLeftIcon,
	ChartColumnIcon,
	CookieIcon,
	ShieldCheckIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ComponentType, useState } from 'react'

import { ROUTES } from '@/constants/routes'

import { useConsent } from '@/lib/consent/consent-provider'
import { cn } from '@/lib/utils'

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'

interface CookieCategory {
	id: 'necessary' | 'analytics'
	title: string
	description: string
	services: string
	icon: ComponentType<{ className?: string }>
}

const CATEGORIES: CookieCategory[] = [
	{
		id: 'necessary',
		title: 'Необходимые',
		description:
			'Без них сайт не работает: вход в аккаунт и защита сессии, защита от ботов, распознавание устройств для безопасности аккаунта, выбранная тема.',
		services: 'TeaCoder, Yandex SmartCaptcha',
		icon: ShieldCheckIcon
	},
	{
		id: 'analytics',
		title: 'Аналитика',
		description:
			'Помогают понять, какие курсы и страницы полезны, и находить ошибки. Данные обезличены и не используются для рекламы.',
		services: 'Яндекс Метрика',
		icon: ChartColumnIcon
	}
]

export function CookieDialog() {
	const pathname = usePathname()
	const { consent, isSettingsOpen, save, closeSettings } = useConsent()

	const [isCustomizing, setIsCustomizing] = useState(false)
	const [analytics, setAnalytics] = useState(consent?.analytics ?? true)

	const isLegalPage = pathname.startsWith('/document/')
	const isOpen = isSettingsOpen || (consent === null && !isLegalPage)
	const showSettings = isCustomizing || isSettingsOpen

	function choose(value: boolean) {
		setIsCustomizing(false)
		save({ analytics: value })
	}

	function cancel() {
		setIsCustomizing(false)
		setAnalytics(consent?.analytics ?? true)

		if (isSettingsOpen) {
			closeSettings()
		}
	}

	return (
		<AlertDialog
			open={isOpen}
			onOpenChange={open => {
				if (!open && consent !== null) {
					cancel()
				}
			}}
		>
			<AlertDialogContent className='max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg sm:rounded-2xl'>
				<div className='relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 px-6 pb-6 pt-7 text-white'>
					<div className='pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10' />
					<div className='pointer-events-none absolute -bottom-16 right-16 size-32 rounded-full bg-white/10' />

					<div className='relative flex items-center gap-4'>
						<div className='flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25'>
							<CookieIcon className='size-6' />
						</div>
						<div>
							<AlertDialogTitle className='text-xl font-semibold text-white'>
								{showSettings
									? 'Настройки cookie'
									: 'Мы используем cookie'}
							</AlertDialogTitle>
							<p className='mt-0.5 text-sm text-blue-100'>
								Выбор можно изменить в любой момент
							</p>
						</div>
					</div>
				</div>

				<div className='px-6 py-5'>
					<AlertDialogDescription className='text-sm leading-6 text-muted-foreground'>
						{showSettings
							? 'Выберите, какие cookie и похожие технологии можно использовать. Необходимые нельзя отключить — без них не работают вход и защита аккаунта.'
							: 'Cookie и похожие технологии нужны, чтобы вы могли войти в аккаунт, а мы — защищать его и делать платформу лучше. Аналитические включаются только с вашего согласия.'}{' '}
						<Link
							href={ROUTES.DOCUMENTS.PRIVACY}
							target='_blank'
							className='text-blue-600 hover:text-blue-600/90'
						>
							Политика конфиденциальности
						</Link>
					</AlertDialogDescription>

					{showSettings && (
						<div className='mt-5 space-y-3'>
							{CATEGORIES.map(category => {
								const isNecessary = category.id === 'necessary'
								const isChecked = isNecessary || analytics

								return (
									<label
										key={category.id}
										htmlFor={`cookie-${category.id}`}
										className={cn(
											'flex gap-4 rounded-xl border p-4 transition-colors',
											isChecked
												? 'border-blue-500/40 bg-blue-600/5'
												: 'border-border',
											!isNecessary && 'cursor-pointer'
										)}
									>
										<div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10'>
											<category.icon className='size-5 text-blue-600' />
										</div>
										<div className='min-w-0 flex-1'>
											<div className='flex items-center justify-between gap-3'>
												<span className='font-medium text-foreground'>
													{category.title}
												</span>
												{isNecessary ? (
													<span className='text-xs font-medium text-blue-600'>
														Всегда включены
													</span>
												) : (
													<Switch
														id={`cookie-${category.id}`}
														checked={analytics}
														onCheckedChange={
															setAnalytics
														}
													/>
												)}
											</div>
											<p className='mt-1 text-sm leading-5 text-muted-foreground'>
												{category.description}
											</p>
											<p className='mt-2 text-xs text-muted-foreground/80'>
												{category.services}
											</p>
										</div>
									</label>
								)
							})}
						</div>
					)}
				</div>

				<div className='flex flex-col gap-2 border-t bg-muted/40 px-6 py-4 sm:flex-row sm:justify-end'>
					{showSettings ? (
						<>
							{(isCustomizing || consent !== null) && (
								<Button
									variant='ghost'
									onClick={cancel}
									className='sm:mr-auto'
								>
									<ArrowLeftIcon />
									{consent === null ? 'Назад' : 'Отмена'}
								</Button>
							)}
							<Button
								variant='primary'
								onClick={() => choose(analytics)}
							>
								Сохранить выбор
							</Button>
						</>
					) : (
						<>
							<Button
								variant='ghost'
								onClick={() => setIsCustomizing(true)}
								className='sm:mr-auto'
							>
								Настроить
							</Button>
							<Button
								variant='outline'
								onClick={() => choose(false)}
							>
								Только необходимые
							</Button>
							<Button
								variant='primary'
								onClick={() => choose(true)}
							>
								Принять все
							</Button>
						</>
					)}
				</div>
			</AlertDialogContent>
		</AlertDialog>
	)
}
