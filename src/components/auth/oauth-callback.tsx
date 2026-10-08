'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import {
	getGetAuthSsoAccountsQueryQueryKey,
	usePostAuthSsoByProviderCallbackMutation
} from '@/generated/api'

import { ROUTES } from '@/constants/routes'
import { SSO_PROVIDERS, isSsoProvider } from '@/constants/sso-providers'

import { API_ERROR, getErrorMessage, hasApiError } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { useSignInResult } from '@/lib/auth/use-sign-in'

import { EllipsisLoader } from '../shared/ellipsis-loader'

import { MfaForm } from './mfa/mfa-form'

interface OAuthCallbackProps {
	provider: string
}

/** Codes understood by `ConnectionError` on the connections page. */
function getConnectionErrorCode(error: unknown) {
	if (hasApiError(error, API_ERROR.oauthCancelled)) {
		return 'access_denied'
	}

	if (hasApiError(error, API_ERROR.oauthAlreadyLinkedToAnother)) {
		return 'already-linked'
	}

	if (hasApiError(error, API_ERROR.oauthAnotherAlreadyLinked)) {
		return 'another-linked'
	}

	return null
}

/** The provider sends the user here; the query goes to the API as is, exactly once. */
export function OAuthCallback({ provider }: OAuthCallbackProps) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { isAuthorized } = useSession()
	const { mfa, handleSignIn } = useSignInResult()

	const isStarted = useRef(false)

	const providerName = isSsoProvider(provider)
		? SSO_PROVIDERS[provider].name
		: provider

	const { mutate } = usePostAuthSsoByProviderCallbackMutation({
		mutation: {
			onSuccess(result) {
				if (result.intent === 'LINK') {
					queryClient.invalidateQueries({
						queryKey: getGetAuthSsoAccountsQueryQueryKey()
					})
					toast.success(`Аккаунт ${providerName} привязан`)
					router.replace(ROUTES.ACCOUNT.CONNECTIONS)
				} else {
					handleSignIn(result)
				}
			},
			onError(error) {
				// Signed in means this was linking from the settings page.
				if (isAuthorized) {
					const code = getConnectionErrorCode(error)

					if (!code) {
						toast.error(
							getErrorMessage(error, 'Ошибка при подключении')
						)
					}

					router.replace(
						code
							? `${ROUTES.ACCOUNT.CONNECTIONS}?error=${code}`
							: ROUTES.ACCOUNT.CONNECTIONS
					)
				} else {
					toast.error(getErrorMessage(error, 'Ошибка при входе'))
					router.replace(ROUTES.AUTH.LOGIN())
				}
			}
		}
	})

	useEffect(() => {
		// `state` is single-use - a second call (StrictMode, re-render) would fail.
		if (isStarted.current) {
			return
		}

		isStarted.current = true

		const query = window.location.search

		if (!isSsoProvider(provider) || !query) {
			router.replace(ROUTES.AUTH.LOGIN())
			return
		}

		mutate({ provider, data: { query } })
	}, [mutate, provider, router])

	if (mfa) {
		return (
			<MfaForm
				ticket={mfa}
				onBack={() => router.push(ROUTES.AUTH.LOGIN())}
			/>
		)
	}

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<EllipsisLoader />
		</div>
	)
}
