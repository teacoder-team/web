'use client'

import { AlertTriangle } from 'lucide-react'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { env } from '@/lib/config/env'

import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '../../ui/card'

export function ConnectionError() {
	const [isVisible, setIsVisible] = useState(false)
	const [errorInfo, setErrorInfo] = useState<{
		title: string
		description: string
		details: string
	} | null>(null)

	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const error = searchParams.get('error')

		if (error === 'already-linked') {
			setErrorInfo({
				title: 'Аккаунт уже привязан',
				description:
					'Этот аккаунт уже привязан к другому пользователю.',
				details: `Пожалуйста, используйте другой аккаунт или свяжитесь с поддержкой по адресу ${env.SUPPORT_EMAIL}, чтобы решить эту проблему.`
			})
			setIsVisible(true)
		} else if (error === 'email-taken') {
			setErrorInfo({
				title: 'Почта уже используется',
				description:
					'Указанная почта уже используется другим аккаунтом.',
				details:
					'Попробуйте использовать другой адрес электронной почты или восстановить доступ к старому аккаунту.'
			})
			setIsVisible(true)
		} else if (error === 'another-linked') {
			setErrorInfo({
				title: 'Сервис уже привязан',
				description:
					'К вашему профилю уже привязан другой аккаунт этого сервиса.',
				details: `Отвяжите текущий аккаунт, а затем привяжите новый. Если возникли сложности, напишите в поддержку по адресу ${env.SUPPORT_EMAIL}.`
			})
			setIsVisible(true)
		} else if (error === 'access_denied') {
			setErrorInfo({
				title: 'Доступ запрещён',
				description:
					'Вы отменили авторизацию через внешнего провайдера',
				details:
					'Если это было случайно, попробуйте снова. Иначе используйте другой способ входа или свяжитесь с поддержкой.'
			})
			setIsVisible(true)
		}
	}, [searchParams])

	const handleClose = () => {
		setIsVisible(false)

		const params = new URLSearchParams(searchParams.toString())

		params.delete('error')

		router.replace(
			`${window.location.pathname}?${params.toString()}` as Route,
			{
				scroll: false
			}
		)
	}

	if (!isVisible || !errorInfo) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm'>
			<Card className='w-full max-w-md shadow-lg duration-300 animate-in fade-in zoom-in'>
				<CardHeader className='border-b border-border pb-4'>
					<div className='flex items-center gap-2'>
						<AlertTriangle className='h-6 w-6' />
						<CardTitle>{errorInfo.title}</CardTitle>
					</div>
					<CardDescription>{errorInfo.description}</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4 pt-6'>
					<div className='rounded-md bg-muted p-3 text-sm'>
						<p>{errorInfo.details}</p>
					</div>
				</CardContent>
				<CardFooter className='border-t border-border pt-4'>
					<Button
						variant='primary'
						className='w-full'
						onClick={handleClose}
					>
						Понятно
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
