'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostAuthResetPasswordMutation } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useSignInResult } from '@/lib/auth/use-sign-in'

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
import { MfaForm } from './mfa/mfa-form'

const newPasswordSchema = z.object({
	password: z
		.string()
		.min(6, { message: 'Пароль должен содержать хотя бы 6 символов' })
		.max(128, { message: 'Пароль должен содержать не более 128 символов' })
})

export type NewPassword = z.infer<typeof newPasswordSchema>

/** Opened from the link in the reset email; the token is single-use. */
export function NewPasswordForm() {
	const router = useRouter()
	const { token } = useParams<{ token: string }>()

	const { mfa, handleSignIn } = useSignInResult()

	const form = useForm<NewPassword>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const { mutate, isPending } = usePostAuthResetPasswordMutation({
		mutation: {
			onSuccess(data) {
				analytics.auth.newPassword.success()

				form.reset()
				handleSignIn(data)
			},
			onError(error) {
				const message = getErrorMessage(
					error,
					'Ошибка при сбросе пароля'
				)
				analytics.auth.newPassword.fail(message)

				toast.error(message)
			}
		}
	})

	useEffect(() => {
		analytics.auth.newPassword.view()
	}, [])

	function onSubmit({ password }: NewPassword) {
		analytics.auth.newPassword.submit()

		mutate({ data: { token, newPassword: password } })
	}

	if (mfa) {
		return (
			<MfaForm
				ticket={mfa}
				onBack={() => router.push(ROUTES.AUTH.LOGIN())}
			/>
		)
	}

	return (
		<AuthWrapper
			heading='Новый пароль'
			description='Установите новый пароль для вашего аккаунта'
			bottomText='Уже есть аккаунт?'
			bottomLinkText='Войти'
			bottomLinkHref={ROUTES.AUTH.LOGIN()}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-4'
				>
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
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
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
				</form>
			</Form>
		</AuthWrapper>
	)
}
