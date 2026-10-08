'use client'

import { FaGoogle } from 'react-icons/fa6'
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

import { Heading } from '../../shared/heading'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'
import { Skeleton } from '../../ui/skeleton'

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

	const { mutate, isPending } = usePostAuthSsoByProviderLinkMutation()

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
			<div className='w-full'>
				<div className='mx-auto flex h-full max-w-5xl flex-col gap-4 rounded-xl'>
					<Heading
						title='Сторонние сервисы'
						description='Подключите и управляйте своими аккаунтами на сторонних сервисах, таких как Google и GitHub'
					/>
					<div className='mt-2 space-y-5'>
						{isLoadingConfig || isLoadingAccounts
							? Array.from({ length: 4 }).map((_, index) => (
									<ConnectionsSkeleton key={index} />
								))
							: providers?.map((provider, index) => {
									const meta = SSO_PROVIDERS[provider]

									const isConnected =
										linkedProviders.has(provider)

									return (
										<Card
											key={index}
											className='shadow-none'
										>
											<CardContent className='flex items-center justify-between p-4'>
												<div className='flex items-center gap-x-3'>
													<div className='rounded-full bg-blue-600 p-2.5'>
														{provider ===
														'google' ? (
															<FaGoogle className='size-5 text-white' />
														) : (
															<meta.icon className='size-5 text-white' />
														)}
													</div>
													<div>
														<h2 className='font-semibold'>
															{meta.name}
														</h2>
														<p className='text-sm text-muted-foreground'>
															{meta.description}
														</p>
													</div>
												</div>
												{isConnected ? (
													<UnlinkProvider
														provider={provider}
													/>
												) : (
													<Button
														onClick={() =>
															link(provider)
														}
														variant='outline'
														isLoading={isPending}
													>
														Привязать
													</Button>
												)}
											</CardContent>
										</Card>
									)
								})}
					</div>
				</div>
			</div>
			<ConnectionError />
		</>
	)
}

export function ConnectionsSkeleton() {
	return (
		<Card className='shadow-none'>
			<CardContent className='flex items-center justify-between p-4'>
				<div className='flex items-center gap-x-3'>
					<Skeleton className='h-10 w-10 rounded-full' />
					<div className='flex flex-1 flex-col gap-2'>
						<Skeleton className='h-4 w-24 rounded-md' />
						<Skeleton className='h-3 w-40 rounded-md' />
					</div>
				</div>
				<Skeleton className='h-10 w-28 rounded-lg' />
			</CardContent>
		</Card>
	)
}
