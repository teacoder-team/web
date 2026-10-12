'use client'

import { toast } from 'sonner'

import { usePostAuthSsoByProviderStartMutation } from '@/generated/api'

import {
	SSO_PROVIDERS,
	type SsoProvider,
	isSsoProvider
} from '@/constants/sso-providers'

import { analytics } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/errors'
import { useAppConfig } from '@/lib/config/use-app-config'

import { Button } from '../ui/button'

import { PasskeyLoginButton } from './passkey-login-button'

interface AuthSocialProps {
	isShowPasskey?: boolean
}

export function AuthSocial({ isShowPasskey }: AuthSocialProps) {
	const { data: config, isLoading } = useAppConfig()

	const providers =
		config?.features.auth.providers.filter(isSsoProvider) ?? []

	const { mutate, isPending } = usePostAuthSsoByProviderStartMutation()

	function signInWith(provider: SsoProvider) {
		analytics.auth.social.click(provider)
		analytics.auth.social.redirect(provider)

		mutate(
			{ provider },
			{
				onSuccess(data) {
					analytics.auth.social.success(provider)
					window.location.assign(data.url)
				},
				onError(error) {
					analytics.auth.social.fail(provider, error.message)
					toast.error(
						getErrorMessage(error, 'Ошибка при создании URL')
					)
				}
			}
		)
	}

	// The wrapper shows its own skeleton while the config loads
	if (isLoading) return null

	return (
		<div className='flex flex-col gap-3'>
			{providers.map(provider => {
				const meta = SSO_PROVIDERS[provider]

				return (
					<Button
						key={provider}
						onClick={() => signInWith(meta.id)}
						variant='outline'
						className='h-[42px] w-full [&_svg]:size-5'
						disabled={isPending}
					>
						<meta.icon style={{ color: meta.color }} />
						Продолжить через {meta.name}
					</Button>
				)
			})}

			{isShowPasskey && <PasskeyLoginButton />}
		</div>
	)
}
