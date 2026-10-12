import { KeyRound, ListOrdered, Smartphone } from 'lucide-react'

import type { MfaStatusResponse } from '@/generated/model'

import { Badge } from '../../ui/badge'
import { SettingsRow } from '../account-ui'

import { DisableTotpForm } from './disable-totp-form'
import { EnableTotpForm } from './enable-totp-form'
import { PasskeyModal } from './passkey-modal'
import { RecoveryCodesModal } from './recovery-codes-modal'
import { RegisterPasskeyForm } from './register-passkey-form'

interface TwoFactorAuthFormProps {
	status: MfaStatusResponse | undefined
}

export function TwoStepAuthForm({ status }: TwoFactorAuthFormProps) {
	const isTotpEnabled = !!status?.totp.enabled
	const hasKeys = (status?.webauthn.credentials ?? 0) > 0
	const hasRecoveryCodes = (status?.recoveryCodes.total ?? 0) > 0

	return (
		<>
			<SettingsRow
				icon={<Smartphone />}
				title='Приложение-аутентификатор'
				badge={
					isTotpEnabled ? (
						<Badge variant='success'>Включено</Badge>
					) : (
						<Badge variant='neutral'>Выключено</Badge>
					)
				}
				description={
					isTotpEnabled
						? 'При входе мы попросим код из приложения-аутентификатора.'
						: 'Защитите аккаунт одноразовыми кодами из приложения на телефоне.'
				}
			>
				{isTotpEnabled ? <DisableTotpForm /> : <EnableTotpForm />}
			</SettingsRow>

			<SettingsRow
				icon={<KeyRound />}
				title='Ключи доступа'
				badge={hasKeys && <Badge variant='success'>Добавлены</Badge>}
				description={
					hasKeys
						? 'Ключ доступа подтверждает вход вместо кода - биометрией или аппаратным ключом.'
						: 'Добавьте ключ доступа, чтобы входить по отпечатку, лицу или аппаратному ключу.'
				}
			>
				{hasKeys && <PasskeyModal />}
				<RegisterPasskeyForm />
			</SettingsRow>

			{hasRecoveryCodes && (
				<SettingsRow
					icon={<ListOrdered />}
					title='Резервные коды'
					description='Одноразовые коды на случай, если вы потеряете доступ к телефону или ключу.'
				>
					<RecoveryCodesModal />
				</SettingsRow>
			)}
		</>
	)
}
