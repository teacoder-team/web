'use client'

import { CookieIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId } from 'react'

import { useConsent } from '@/lib/consent/consent-provider'
import { ROUTES } from '@/lib/routes'

import { Button } from '../ui/button'

export function CookieDialog() {
	const pathname = usePathname()
	const titleId = useId()

	const { consent, isSettingsOpen, save, closeSettings } = useConsent()

	const isLegalPage = pathname.startsWith('/document/')
	const isOpen = isSettingsOpen || (consent === null && !isLegalPage)

	// Escape only dismisses when reopened from the footer with a saved choice
	useEffect(() => {
		if (!isSettingsOpen || consent === null) return

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') closeSettings()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [isSettingsOpen, consent, closeSettings])

	if (!isOpen) return null

	return (
		<section
			role='dialog'
			aria-modal='false'
			aria-labelledby={titleId}
			className='fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-[400px] rounded-2xl bg-popover p-5 text-popover-foreground shadow-popover duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none sm:inset-x-auto sm:bottom-5 sm:right-5'
		>
			<div className='flex items-center gap-3'>
				<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary'>
					<CookieIcon className='size-4 text-brand' />
				</span>
				<h2 id={titleId} className='text-[15px] font-medium'>
					Мы используем cookie
				</h2>
			</div>

			<p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
				Нужны для входа в аккаунт и его защиты. Аналитические включаются
				только с вашего согласия.{' '}
				<Link
					href={ROUTES.DOCUMENTS.COOKIES}
					target='_blank'
					className='text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
				>
					Подробнее
				</Link>
			</p>

			<div className='mt-5 flex items-center gap-2'>
				<Button
					size='sm'
					onClick={() => save({ analytics: true })}
					className='flex-1'
				>
					Принять все
				</Button>
				<Button
					variant='secondary'
					size='sm'
					onClick={() => save({ analytics: false })}
					className='flex-1'
				>
					Только необходимые
				</Button>
			</div>
		</section>
	)
}
