'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostAuthForgotPasswordMutation } from '@/generated/api'

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

const resetPasswordSchema = z.object({
	email: z
		.string()
		.email({ message: 'Введите корректный адрес электронной почты' }),
	captcha: z.string()
})

export type ResetPassword = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
	const [captchaKey, setCaptchaKey] = useState(0)

	const isCaptchaRequired = useCaptchaRequired()

	const form = useForm<ResetPassword>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
			captcha: ''
		}
	})

	const { mutate, isPending } = usePostAuthForgotPasswordMutation({
		mutation: {
			onSuccess() {
				analytics.auth.resetPassword.success()

				form.reset()
				setCaptchaKey(key => key + 1)
				toast.success('Письмо с инструкциями отправлено на вашу почту')
			},
			onError(error) {
				const message = getErrorMessage(
					error,
					'Ошибка при сбросе пароля'
				)
				analytics.auth.resetPassword.fail(message)

				toast.error(message)

				form.setValue('captcha', '')
				setCaptchaKey(key => key + 1)
			}
		}
	})

	useEffect(() => {
		analytics.auth.resetPassword.view()
	}, [])

	function onSubmit({ email, captcha }: ResetPassword) {
		analytics.auth.resetPassword.submit()

		if (isCaptchaRequired && !captcha) {
			toast.warning('Пройдите капчу!')
			return
		}

		mutate({ data: { email, captchaToken: captcha || undefined } })
	}

	return (
		<AuthWrapper
			heading='Сброс пароля'
			description='Введите вашу почту, чтобы получить ссылку для сброса пароля'
			bottomText='Уже есть аккаунт?'
			bottomLinkText='Войти'
			bottomLinkHref={ROUTES.AUTH.LOGIN()}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-4'
				>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Почта</FormLabel>
									<FormControl>
										<Input
											placeholder='email@teacoder.ru'
											disabled={isPending}
											{...field}
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
						>
							Продолжить
						</Button>
					</div>
				</form>
			</Form>
		</AuthWrapper>
	)
}
