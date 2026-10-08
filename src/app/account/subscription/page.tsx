import type { Metadata } from 'next'

import { Subscription } from '@/components/account/subscription/subscription'

export const metadata: Metadata = {
	title: 'Подписка'
}

export default function SubscriptionPage() {
	return <Subscription />
}
