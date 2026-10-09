import type { Metadata } from 'next'

import { EmailVerification } from '@/components/auth/email-verification'

export const metadata: Metadata = {
	title: 'Подтверждение почты',
	referrer: 'no-referrer',
	robots: { index: false, follow: false }
}

export default async function EmailVerificationPage({
	params
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params

	return <EmailVerification key={token} token={token} />
}
