import type { Metadata } from 'next'

import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
	title: 'Создать аккаунт',
	description:
		'Регистрация на образовательной платформе TeaCoder: доступ к курсам, прогрессу обучения и подписке.',
	robots: { index: false, follow: true }
}

export default function RegisterPage() {
	return <RegisterForm />
}
