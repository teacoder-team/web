'use client'

import { useGetMfaQuery } from '@/generated/api'

import { useSession } from '@/lib/auth/auth-provider'

import { AccountHeader, SettingsSection } from '../account-ui'

import { AccountActions } from './account-actions'
import { AppearanceForm } from './appearance'
import { AvatarForm } from './avatar-form'
import { DisplayNameForm } from './display-name-form'
import { EmailForm } from './email-form'
import { PasswordForm } from './password-form'
import { TwoStepAuthForm } from './two-step-auth-form'

export function Settings() {
	const { user } = useSession()

	const { data: status } = useGetMfaQuery()

	return (
		<div className='space-y-8 sm:space-y-10'>
			<AccountHeader
				title='Настройки'
				description='Профиль, вход в аккаунт, защита и внешний вид.'
			/>
			<SettingsSection title='Профиль'>
				<AvatarForm user={user} />
				<DisplayNameForm user={user} />
			</SettingsSection>
			<SettingsSection title='Вход в аккаунт'>
				<EmailForm user={user} />
				<PasswordForm user={user} />
			</SettingsSection>
			<SettingsSection
				title='Защита'
				description='Второй шаг при входе: код из приложения или ключ доступа.'
			>
				<TwoStepAuthForm status={status} />
			</SettingsSection>
			<SettingsSection title='Внешний вид'>
				<AppearanceForm />
			</SettingsSection>
			<SettingsSection tone='danger'>
				<AccountActions />
			</SettingsSection>
		</div>
	)
}
