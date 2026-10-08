'use client'

import { toast } from 'sonner'

import { usePostAuthVerifyMutation } from '@/generated/api'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useCompleteSignIn } from '@/lib/auth/use-sign-in'

import { CodeStep } from './code-step'

interface VerifyEmailStepProps {
	email: string
	onBack: () => void
}

/** Registration step two: the code from the email activates the account and signs in. */
export function VerifyEmailStep({ email, onBack }: VerifyEmailStepProps) {
	const completeSignIn = useCompleteSignIn()

	const { mutate, isPending } = usePostAuthVerifyMutation({
		mutation: {
			onSuccess(data) {
				analytics.auth.register.success()

				completeSignIn(data)
			},
			onError(error) {
				const message = getErrorMessage(error, 'Ошибка при верификации')
				analytics.auth.register.fail(message)

				toast.error(message)
			}
		}
	})

	return (
		<CodeStep
			heading='Подтвердите почту'
			description={`Мы отправили 6-значный код на ${email}`}
			backText='Назад'
			isLoading={isPending}
			onSubmit={code => mutate({ data: { email, code } })}
			onBack={onBack}
		/>
	)
}
