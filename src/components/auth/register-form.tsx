'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostAuthRegisterMutation } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useCaptchaRequired } from '@/lib/captcha/captcha'

import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import { Input } from '../ui/input'

import { AuthWrapper } from './auth-wrapper'
import { CaptchaField } from './captcha-field'
import { VerifyEmailStep } from './verify-email-step'

const registerSchema = z.object({
	name: z.string().min(1, { message: 'Имя обязательно' }),
	email: z
		.string()
		.min(1, { message: 'Email обязателен' })
		.email({ message: 'Введите корректный адрес электронной почты' }),
	password: z
		.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' }),
	captcha: z.string()
})

export type Register = z.infer<typeof registerSchema>

export function RegisterForm() {
	const [pendingEmail, setPendingEmail] = useState<string | null>(null)
	const [captchaKey, setCaptchaKey] = useState(0)

	const isCaptchaRequired = useCaptchaRequired()

	const form = useForm<Register>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			captcha: ''
		}
	})

	// A captcha token is single-use: every attempt needs a fresh widget.
	function resetCaptcha() {
		form.setValue('captcha', '')
		setCaptchaKey(key => key + 1)
	}

	const { mutate, isPending } = usePostAuthRegisterMutation({
		mutation: {
			onSuccess(_, { data }) {
				resetCaptcha()
				setPendingEmail(data.email)
			},
			onError(error) {
				const message = getErrorMessage(error, 'Ошибка при регистрации')
				analytics.auth.register.fail(message)

				toast.error(message)

				resetCaptcha()
			}
		}
	})

	useEffect(() => {
		analytics.auth.register.view()
	}, [])

	function onSubmit({ name, email, password, captcha }: Register) {
		analytics.auth.register.submit()

		if (isCaptchaRequired && !captcha) {
			toast.warning('Пройдите капчу!')
			return
		}

		mutate({
			data: { name, email, password, captchaToken: captcha || undefined }
		})
	}

	if (pendingEmail) {
		return (
			<VerifyEmailStep
				email={pendingEmail}
				onBack={() => setPendingEmail(null)}
			/>
		)
	}

	return (
		<AuthWrapper
			heading='Создать аккаунт'
			description='Для регистрации достаточно ввести своё имя, email и придумать пароль'
			bottomText='Уже есть аккаунт?'
			bottomLinkText='Войти'
			bottomLinkHref={ROUTES.AUTH.LOGIN()}
			isShowSocial
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя</FormLabel>
									<FormControl>
										<Input
											placeholder='Tony Stark'
											disabled={isPending}
											{...field}
											onChange={e => {
												field.onChange(e)
												analytics.auth.register.nameInput()
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Почта</FormLabel>
									<FormControl>
										<Input
											placeholder='tony@starkindustries.com'
											disabled={isPending}
											{...field}
											onChange={e => {
												field.onChange(e)
												analytics.auth.register.emailInput()
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='******'
											disabled={isPending}
											{...field}
											onChange={e => {
												field.onChange(e)
												analytics.auth.register.passwordInput()
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<CaptchaField
							control={form.control}
							name='captcha'
							resetKey={captchaKey}
							className='flex flex-col items-center justify-center'
						/>
						<Button
							type='submit'
							variant='primary'
							size='lg'
							isLoading={isPending}
							className='w-full'
							onClick={() => analytics.auth.register.click()}
						>
							Продолжить
						</Button>
					</div>
				</form>
			</Form>
		</AuthWrapper>
	)
}
