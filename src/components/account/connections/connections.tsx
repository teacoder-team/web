'use client'

import { toast } from 'sonner'

import {
	useGetAuthSsoAccountsQuery,
	usePostAuthSsoByProviderLinkMutation
} from '@/generated/api'

import {
	SSO_PROVIDERS,
	type SsoProvider,
	isSsoProvider
} from '@/constants/sso-providers'

import { getErrorMessage } from '@/lib/api/errors'
import { useAppConfig } from '@/lib/config/use-app-config'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
	AccountHeader,
	SettingsRow,
	SettingsRowSkeleton,
	SettingsSection
} from '../account-ui'

import { ConnectionError } from './connection-error'
import { UnlinkProvider } from './unlink-provider'

export function Connections() {
	const { data: config, isLoading: isLoadingConfig } = useAppConfig()
	const { data: accounts, isLoading: isLoadingAccounts } =
		useGetAuthSsoAccountsQuery()

	const providers = config?.features.auth.providers.filter(isSsoProvider)
	const linkedProviders = new Set(
		accounts?.accounts
			.filter(account => account.linked)
			.map(account => account.slug)
	)

	const { mutate, isPending, variables } =
		usePostAuthSsoByProviderLinkMutation()

	/** The provider returns to `/auth/callback/:provider`, which finishes the link. */
	function link(provider: SsoProvider) {
		mutate(
			{ provider },
			{
				onSuccess(data) {
					window.location.assign(data.url)
				},
				onError(error) {
					toast.error(
						getErrorMessage(error, 'Ошибка при подключении')
					)
				}
			}
		)
	}

	return (
		<>
			<div className='space-y-8 sm:space-y-10'>
				<AccountHeader
					title='Связанные аккаунты'
					description='Подключите сервисы, чтобы входить в TeaCoder в один клик.'
				/>
				<SettingsSection>
					{isLoadingConfig || isLoadingAccounts
						? Array.from({ length: 4 }).map((_, index) => (
								<SettingsRowSkeleton key={index} />
							))
						: providers?.map(provider => {
								const meta = SSO_PROVIDERS[provider]
								const isConnected =
									linkedProviders.has(provider)

								return (
									<SettingsRow
										key={provider}
										icon={
											<meta.icon
												style={{ color: meta.color }}
											/>
										}
										title={meta.name}
										badge={
											isConnected && (
												<Badge variant='success'>
													Подключён
												</Badge>
											)
										}
										description={meta.description}
									>
										{isConnected ? (
											<UnlinkProvider
												provider={provider}
											/>
										) : (
											<Button
												variant='outline'
												onClick={() => link(provider)}
												isLoading={
													isPending &&
													variables?.provider ===
														provider
												}
												disabled={isPending}
											>
												Привязать
											</Button>
										)}
									</SettingsRow>
								)
							})}
				</SettingsSection>
			</div>
			<ConnectionError />
		</>
	)
}
