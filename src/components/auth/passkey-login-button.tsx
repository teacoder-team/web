'use client'

import { useMutation } from '@tanstack/react-query'
import { KeyRound } from 'lucide-react'
import { toast } from 'sonner'

import {
	postAuthWebauthnLoginOptionsMutation,
	postAuthWebauthnLoginVerifyMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { useCompleteSignIn } from '@/lib/auth/use-sign-in'
import {
	authenticateWithKey,
	isWebAuthnCancelled
} from '@/lib/webauthn/webauthn'

import { Button } from '../ui/button'

/** Passwordless sign-in: the key's user verification is the second factor. */
export function PasskeyLoginButton() {
	const completeSignIn = useCompleteSignIn()

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const options = await postAuthWebauthnLoginOptionsMutation({})
			const response = await authenticateWithKey(options)

			return postAuthWebauthnLoginVerifyMutation({ response })
		},
		onSuccess: completeSignIn,
		onError(error) {
			if (!isWebAuthnCancelled(error)) {
				toast.error(getErrorMessage(error, 'Ошибка входа по ключу'))
			}
		}
	})

	return (
		<Button
			onClick={() => mutate()}
			variant='outline'
			className='[&_svg]:size-5'
			isLoading={isPending}
		>
			<KeyRound />
			Вход по ключу доступа
		</Button>
	)
}
