import type { Metadata } from 'next'

import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
	title: 'Сброс пароля',
	description:
		'Восстановление доступа к аккаунту TeaCoder по адресу электронной почты.',
	robots: { index: false, follow: true }
}

export default function ResetPasswordPage() {
	return <ResetPasswordForm />
}
