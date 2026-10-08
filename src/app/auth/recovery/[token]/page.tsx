import type { Metadata } from 'next'

import { NewPasswordForm } from '@/components/auth/new-password-form'

export const metadata: Metadata = {
	title: 'Новый пароль',
	// The reset token is in the URL - never pass it on to other sites.
	referrer: 'no-referrer',
	robots: {
		index: false,
		follow: false
	}
}

export default function NewPasswordPage() {
	return <NewPasswordForm />
}
