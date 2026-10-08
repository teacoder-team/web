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
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

import { PasskeyLoginButton } from './passkey-login-button'

const ICON_ROW_COLUMNS: Record<number, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4'
}

interface AuthSocialProps {
	isShowPasskey?: boolean
}

export function AuthSocial({ isShowPasskey }: AuthSocialProps) {
	const { data: config, isLoading } = useAppConfig()

	const providers =
		config?.features.auth.providers.filter(isSsoProvider) ?? []

	const featured = providers.slice(0, 2)
	const others = providers.slice(2)

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

	function renderButton(provider: SsoProvider, withName: boolean) {
		const meta = SSO_PROVIDERS[provider]

		return (
			<Button
				key={provider}
				onClick={() => signInWith(meta.id)}
				variant='outline'
				className='[&_svg]:size-[21px]'
				disabled={isPending}
			>
				<meta.icon
					style={{
						color: meta.color
					}}
				/>
				{withName && meta.name}
			</Button>
		)
	}

	return (
		<div className='flex flex-col gap-4'>
			{isLoading ? (
				<>
					<div className='grid w-full grid-cols-2 gap-4'>
						{Array.from({ length: 2 }).map((_, i) => (
							<Skeleton
								key={i}
								className='h-10 w-full rounded-lg'
							/>
						))}
					</div>

					<div className='grid w-full grid-cols-3 gap-4'>
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={i}
								className='h-10 w-full rounded-lg'
							/>
						))}
					</div>
				</>
			) : (
				<>
					{featured.length > 0 && (
						<div
							className={cn(
								'grid w-full gap-4',
								ICON_ROW_COLUMNS[featured.length]
							)}
						>
							{featured.map(provider =>
								renderButton(provider, true)
							)}
						</div>
					)}

					{others.length > 0 && (
						<div
							className={cn(
								'grid w-full gap-4',
								ICON_ROW_COLUMNS[Math.min(others.length, 4)]
							)}
						>
							{others.map(provider =>
								renderButton(provider, false)
							)}
						</div>
					)}
				</>
			)}

			{isShowPasskey && <PasskeyLoginButton />}
		</div>
	)
}
