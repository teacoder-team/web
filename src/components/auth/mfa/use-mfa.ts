'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import {
	usePostAuthMfaChallengeMutation,
	usePostAuthMfaConfirmMutation,
	usePostAuthWebauthnLoginOptionsMutation,
	usePostAuthWebauthnLoginVerifyMutation
} from '@/generated/api'

import type { MfaOption } from '@/constants/mfa-methods'

import { analytics } from '@/lib/analytics'
import {
	API_ERROR,
	getApiError,
	getErrorMessage,
	hasApiError
} from '@/lib/api/errors'
import { type MfaTicket, useCompleteSignIn } from '@/lib/auth/use-sign-in'
import {
	authenticateWithKey,
	isWebAuthnCancelled
} from '@/lib/webauthn/webauthn'

interface UseMfaOptions {
	ticket: MfaTicket
	/** The ticket is gone (5 minutes or a spent token) - back to the first step. */
	onExpired: () => void
}

export function useMfa({ ticket, onExpired }: UseMfaOptions) {
	const { mfaToken } = ticket

	const completeSignIn = useCompleteSignIn()

	const [challengeId, setChallengeId] = useState<string | null>(null)
	// Spans the browser prompt too, not only the two requests around it.
	const [isKeyPending, setIsKeyPending] = useState(false)

	const challenge = usePostAuthMfaChallengeMutation()
	const confirm = usePostAuthMfaConfirmMutation()
	const keyOptions = usePostAuthWebauthnLoginOptionsMutation()
	const keyVerify = usePostAuthWebauthnLoginVerifyMutation()

	function handleError(error: unknown, option: MfaOption) {
		const message = getErrorMessage(error, 'Ошибка при входе')

		analytics.auth.mfa.fail(option.id, message)
		toast.error(message)

		if (hasApiError(error, API_ERROR.mfaSessionExpired)) {
			onExpired()
		}
	}

	async function startChallenge(option: MfaOption) {
		setChallengeId(null)

		const { challengeId } = await challenge.mutateAsync({
			data: { mfaToken, method: option.method }
		})

		setChallengeId(challengeId)

		return challengeId
	}

	/** Called when a code method is picked: the API opens a check for it. */
	function selectCodeMethod(option: MfaOption) {
		startChallenge(option).catch(error => handleError(error, option))
	}

	async function submitCode(option: MfaOption, code: string) {
		analytics.auth.mfa.submit(option.id)

		try {
			const id = challengeId ?? (await startChallenge(option))

			const result = await confirm.mutateAsync({
				data: { mfaToken, challengeId: id, code }
			})

			analytics.auth.mfa.success(option.id)
			completeSignIn(result)
		} catch (error) {
			handleError(error, option)
		}
	}

	async function submitKey(option: MfaOption) {
		analytics.auth.mfa.passkeyStart()
		setIsKeyPending(true)

		try {
			const options = await keyOptions.mutateAsync({ data: { mfaToken } })
			const response = await authenticateWithKey(options)

			analytics.auth.mfa.passkeySuccess()

			const result = await keyVerify.mutateAsync({
				data: { response, mfaToken }
			})

			analytics.auth.mfa.success(option.id)
			completeSignIn(result)
		} catch (error) {
			if (getApiError(error)) {
				handleError(error, option)
			} else {
				analytics.auth.mfa.passkeyFail(
					error instanceof Error ? error.message : undefined
				)

				if (!isWebAuthnCancelled(error)) {
					toast.error('Ошибка входа по ключу')
				}
			}
		} finally {
			setIsKeyPending(false)
		}
	}

	return {
		selectCodeMethod,
		submitCode,
		submitKey,
		isCodePending: challenge.isPending || confirm.isPending,
		isKeyPending
	}
}
