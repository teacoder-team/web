import type { Metadata } from 'next'

import { PaymentStatus } from '@/components/payment/payment-status'

export const metadata: Metadata = {
	title: 'Статус оплаты',
	robots: { index: false, follow: false }
}

export default async function PaymentPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <PaymentStatus key={id} id={id} />
}
