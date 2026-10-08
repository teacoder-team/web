import type { Metadata } from 'next'

import { OAuthCallback } from '@/components/auth/oauth-callback'

export const metadata: Metadata = {
	title: 'Вход через соцсеть',
	robots: {
		index: false,
		follow: false
	}
}

export default async function OAuthCallbackPage({
	params
}: {
	params: Promise<{ provider: string }>
}) {
	const { provider } = await params

	return <OAuthCallback provider={provider} />
}
