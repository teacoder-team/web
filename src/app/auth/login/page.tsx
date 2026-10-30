import type { Metadata } from 'next'

import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
	title: 'Войти в аккаунт',
	description:
		'Вход в аккаунт TeaCoder по почте, ключу доступа или через сторонний сервис.',
	robots: { index: false, follow: true }
}

export default function LoginPage() {
	return <LoginForm />
}
