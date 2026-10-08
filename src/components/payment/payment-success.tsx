'use client'

import confetti from 'canvas-confetti'
import { BookOpenIcon, CheckCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { ROUTES } from '@/constants/routes'

import { Card, CardContent, CardDescription } from '../ui/card'

export function PaymentSuccess() {
	useEffect(() => {
		const duration = 5 * 1000
		const animationEnd = Date.now() + duration
		const defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 0
		}

		const randomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min

		const interval = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now()
			if (timeLeft <= 0) return clearInterval(interval)

			const particleCount = 50 * (timeLeft / duration)
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			})
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			})
		}, 250)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4'>
			<div className='absolute left-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 blur-xl' />

			<div className='absolute bottom-0 right-0 h-40 w-40 rounded-full bg-gradient-to-tl from-emerald-500/15 to-emerald-300/5 blur-2xl' />

			<Card className='w-full max-w-md rounded-xl border-0 bg-card shadow-md dark:border'>
				<CardContent className='flex flex-col items-center p-8 text-center'>
					<div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-neutral-800'>
						<CheckCircleIcon className='h-8 w-8 text-emerald-600' />
					</div>

					<h1 className='mb-3 text-2xl font-semibold text-foreground'>
						Оплата прошла успешно
					</h1>

					<CardDescription className='mb-8'>
						Спасибо за покупку! Теперь у вас есть доступ ко всем
						премиум материалам.
					</CardDescription>

					<Button
						size='lg'
						className='w-full bg-emerald-600 text-white hover:bg-emerald-600/90'
						asChild
					>
						<Link href={ROUTES.COURSES.ROOT}>
							<BookOpenIcon className='mr-2 h-4 w-4' />
							Перейти к курсам
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
