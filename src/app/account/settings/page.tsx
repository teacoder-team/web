import type { Metadata } from 'next'

import { Settings } from '@/components/account/settings/settings'

export const metadata: Metadata = {
	title: 'Настройки аккаунта'
}

export default function SettingsPage() {
	return <Settings />
}
