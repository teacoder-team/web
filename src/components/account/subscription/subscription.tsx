'use client'

import { useGetBillingSubscriptionQuery } from '@/generated/api'

import { Heading } from '../../shared/heading'
import { Skeleton } from '../../ui/skeleton'

import { AutoRenew } from './auto-renew'
import { SubscriptionStatus } from './subscription-status'

export function Subscription() {
	const { data: subscription, isLoading } = useGetBillingSubscriptionQuery()

	return (
		<div className='w-full'>
			<div className='mx-auto flex h-full max-w-5xl flex-col gap-4 rounded-xl'>
				<Heading
					title='Подписка'
					description='Статус премиум-подписки, автопродление и способ оплаты'
				/>
				<div className='mt-2 space-y-5'>
					{isLoading || !subscription ? (
						<SubscriptionSkeleton />
					) : (
						<>
							<SubscriptionStatus subscription={subscription} />
							{subscription.isActive && (
								<AutoRenew subscription={subscription} />
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

function SubscriptionSkeleton() {
	return (
		<div className='flex items-center justify-between rounded-lg border border-border p-5'>
			<div className='flex items-center gap-x-4'>
				<Skeleton className='hidden size-10 rounded-full md:block' />
				<div className='flex flex-col gap-2'>
					<Skeleton className='h-4 w-40 rounded-md' />
					<Skeleton className='h-3 w-64 rounded-md' />
				</div>
			</div>
			<Skeleton className='h-10 w-36 rounded-lg' />
		</div>
	)
}
