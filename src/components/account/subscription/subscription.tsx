'use client'

import { useGetBillingSubscriptionQuery } from '@/generated/api'

import { Skeleton } from '../../ui/skeleton'
import {
	AccountHeader,
	SettingsRowSkeleton,
	SettingsSection
} from '../account-ui'

import { AutoRenew } from './auto-renew'
import { SubscriptionStatus } from './subscription-status'

export function Subscription() {
	const { data: subscription, isLoading } = useGetBillingSubscriptionQuery()

	return (
		<div className='space-y-8 sm:space-y-10'>
			<AccountHeader
				title='Подписка'
				description='Статус TeaCoder Premium и автопродление.'
			/>

			{isLoading || !subscription ? (
				<>
					<Skeleton className='h-64 w-full rounded-3xl' />
					<SettingsSection title='Управление'>
						<SettingsRowSkeleton />
					</SettingsSection>
				</>
			) : (
				<>
					<SubscriptionStatus subscription={subscription} />
					{subscription.isActive && (
						<SettingsSection title='Управление'>
							<AutoRenew subscription={subscription} />
						</SettingsSection>
					)}
				</>
			)}
		</div>
	)
}
