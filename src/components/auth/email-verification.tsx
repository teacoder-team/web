'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { usePostAuthVerifyMutation } from '@/generated/api'

import { Button } from '@/components/ui/button'

import { ROUTES } from '@/constants/routes'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useSignInResult } from '@/lib/auth/use-sign-in'

import { AuthWrapper } from './auth-wrapper'
import { MfaForm } from './mfa/mfa-form'

export function EmailVerification({ token }: { token: string }) {
	const router = useRouter()
	const started = useRef<string | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const { mfa, handleSignIn } = useSignInResult()
	const { mutate } = usePostAuthVerifyMutation({
		mutation: {
			retry: false,
			onSuccess(result) {
				analytics.auth.register.success()
				toast.success('Почта подтверждена')
				handleSignIn(result)
			},
			onError(error) {
				const message = getErrorMessage(error, 'Не удалось подтвердить почту. Попробуйте войти, чтобы получить новую ссылку.')
				setErrorMessage(message)
				toast.error(message)
			}
		}
	})

	useEffect(() => {
		if (started.current === token) {
			return
		}

		started.current = token
		setErrorMessage(null)

		if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
			setErrorMessage('Ссылка подтверждения недействительна. Войдите, чтобы получить новую.')

			return
		}

		mutate({ data: { token } })
	}, [mutate, token])

	if (mfa) {
		return <MfaForm ticket={mfa} onBack={() => router.replace(ROUTES.AUTH.LOGIN())} />
	}

	return (
		<AuthWrapper
			heading={errorMessage ? 'Не удалось подтвердить почту' : 'Подтверждаем почту'}
			description={errorMessage ?? 'Пожалуйста, подождите. После подтверждения вы войдёте в аккаунт.'}
		>
			{errorMessage ? (
				<Button variant='primary' asChild className='w-full'>
					<Link href={ROUTES.AUTH.LOGIN()}>Войти и получить новую ссылку</Link>
				</Button>
			) : (
				<p role='status' className='text-sm text-muted-foreground'>Проверяем ссылку…</p>
			)}
		</AuthWrapper>
	)
}
