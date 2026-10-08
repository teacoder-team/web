import type { Metadata } from 'next'

import { PaymentSuccess } from '@/components/payment/payment-success'

export const metadata: Metadata = {
	title: 'Успешная оплата',
	robots: {
		index: false,
		follow: false
	}
}

export default function PaymentSuccessPage() {
	return <PaymentSuccess />
}
