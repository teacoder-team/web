import type { Metadata } from 'next'

import { Sessions } from '@/components/account/sessions/sessions'

export const metadata: Metadata = {
	title: 'Уcтройства'
}

export default function SessionsPage() {
	return <Sessions />
}
