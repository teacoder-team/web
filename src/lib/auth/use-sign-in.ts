'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import type { AuthResponse, SignInResponse } from '@/generated/model'

import type { ApiMfaMethod } from '@/constants/mfa-methods'
import { ROUTES } from '@/constants/routes'
import { SSO_PROVIDERS, isSsoProvider } from '@/constants/sso-providers'

import { setAccessToken } from './token'

export interface MfaTicket {
	mfaToken: string
	methods: ApiMfaMethod[]
}

type SignedIn = Pick<AuthResponse, 'accessToken' | 'linkedProvider'>

/** Only same-site paths - `redirectTo` comes from the URL. */
function getRedirectTarget(redirectTo: string | null) {
	return redirectTo?.startsWith('/') && !redirectTo.startsWith('//')
		? redirectTo
		: ROUTES.ACCOUNT.ROOT
}

function getProviderName(provider: NonNullable<SignedIn['linkedProvider']>) {
	const slug = provider.toLowerCase()

	return isSsoProvider(slug) ? SSO_PROVIDERS[slug].name : provider
}

/** Opens the session: token → auto-link notice → `redirectTo`. */
export function useCompleteSignIn() {
	const router = useRouter()
	const searchParams = useSearchParams()

	return useCallback(
		({ accessToken, linkedProvider }: SignedIn) => {
			setAccessToken(accessToken)

			if (linkedProvider) {
				toast.info(
					`К аккаунту привязан вход через ${getProviderName(linkedProvider)}`
				)
			}

			router.push(getRedirectTarget(searchParams.get('redirectTo')))
		},
		[router, searchParams]
	)
}

/** A first-factor result (password, reset code, social): either signed in or an MFA ticket. */
export function useSignInResult() {
	const completeSignIn = useCompleteSignIn()

	const [mfa, setMfa] = useState<MfaTicket | null>(null)

	const handleSignIn = useCallback(
		(result: SignInResponse) => {
			if (result.mfaRequired) {
				setMfa({
					mfaToken: result.mfaToken,
					methods: result.mfaMethods
				})
			} else {
				completeSignIn(result)
			}
		},
		[completeSignIn]
	)

	const resetMfa = useCallback(() => setMfa(null), [])

	return { mfa, handleSignIn, resetMfa }
}
