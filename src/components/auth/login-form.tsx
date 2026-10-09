'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostAuthLoginMutation } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useSignInResult } from '@/lib/auth/use-sign-in'
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
import { MfaForm } from './mfa/mfa-form'
import { VerifyEmailStep } from './verify-email-step'

const loginSchema = z.object({
	email: z
		.string()
		.email({ message: 'Введите корректный адрес электронной почты' }),
	password: z
		.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' }),
	captcha: z.string()
})

export type Login = z.infer<typeof loginSchema>

export function LoginForm() {
	const [captchaKey, setCaptchaKey] = useState(0)
	const [verification, setVerification] = useState<{ email: string; resendAfter: number } | null>(null)

	const isCaptchaRequired = useCaptchaRequired()
	const { mfa, handleSignIn, resetMfa } = useSignInResult()

	const form = useForm<Login>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			captcha: ''
		}
	})

	const { mutate, mutateAsync, isPending } = usePostAuthLoginMutation({
		mutation: {
			onSuccess(data, variables) {
				form.setValue('captcha', '')
				setCaptchaKey(key => key + 1)

				if ('emailVerificationRequired' in data) {
					setVerification({ email: variables.data.email, resendAfter: data.resendAfter })

					return
				}

				setVerification(null)
				if (data.mfaRequired) {
					analytics.auth.login.mfaRequested(data.mfaMethods)
				} else {
					analytics.auth.login.success()
				}

				form.reset()
				handleSignIn(data)
			},
			onError(error) {
				const message = getErrorMessage(error, 'Ошибка при входе')
				analytics.auth.login.fail(message)

				toast.error(message)

				form.setValue('captcha', '')
				setCaptchaKey(key => key + 1)
			}
		}
	})

	useEffect(() => {
		analytics.auth.login.view()
	}, [])

	function onSubmit({ email, password, captcha }: Login) {
		analytics.auth.login.submit()

		if (isCaptchaRequired && !captcha) {
			toast.warning('Пройдите капчу!')
			return
		}

		mutate({
			data: { email, password, captchaToken: captcha || undefined }
		})
	}

	if (verification) {
		return (
			<VerifyEmailStep
				email={verification.email}
				resendAfter={verification.resendAfter}
				onBack={() => setVerification(null)}
				onResend={async captchaToken => {
					const { email, password } = form.getValues()
					const result = await mutateAsync({ data: { email, password, captchaToken } })

					return 'emailVerificationRequired' in result ? result.resendAfter : null
				}}
			/>
		)
	}

	return mfa ? (
		<MfaForm ticket={mfa} onBack={resetMfa} />
	) : (
		<AuthWrapper
			heading='Войти в аккаунт'
			description='Для входа на сайт используйте ваш email и пароль, которые были указаны при регистрации на сайте'
			bottomText='Еще нет аккаунта?'
			bottomLinkText='Регистрация'
			bottomLinkHref={ROUTES.AUTH.REGISTER}
			isShowSocial
			isShowPasskey
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-4'>
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
												analytics.auth.login.emailInput()
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
									<div className='flex items-center justify-between'>
										<FormLabel>Пароль</FormLabel>
										<Link
											href={ROUTES.AUTH.RECOVERY}
											className='ml-auto inline-block text-sm underline'
										>
											Забыли пароль?
										</Link>
									</div>
									<FormControl>
										<Input
											type='password'
											placeholder='******'
											disabled={isPending}
											{...field}
											onChange={e => {
												field.onChange(e)
												analytics.auth.login.passwordInput()
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
							className='flex w-full flex-col items-center justify-center'
						/>
						<Button
							type='submit'
							variant='primary'
							size='lg'
							isLoading={isPending}
							className='w-full'
							onClick={() => analytics.auth.login.click()}
						>
							Продолжить
						</Button>
					</div>
				</form>
			</Form>
		</AuthWrapper>
	)
}
