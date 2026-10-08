import { KeyIcon, ShieldIcon, SmartphoneIcon } from 'lucide-react'
import type { ComponentType } from 'react'

import type { MfaChallengePayloadMethod } from '@/generated/model'

/** Screen ids - also the method names analytics has always reported. */
export type MfaMethod = 'totp' | 'passkey' | 'recovery'

export type ApiMfaMethod = MfaChallengePayloadMethod

export interface MfaOption {
	id: MfaMethod
	method: ApiMfaMethod
	name: string
	description: string
	icon: ComponentType<{ className?: string }>
}

export const MFA_OPTIONS: MfaOption[] = [
	{
		id: 'totp',
		method: 'TOTP',
		name: 'Приложение-аутентификатор',
		description: 'Коды из приложения на телефоне',
		icon: SmartphoneIcon
	},
	{
		id: 'passkey',
		method: 'WEBAUTHN',
		name: 'Passkey',
		description: 'Биометрия или ключ доступа',
		icon: KeyIcon
	},
	{
		id: 'recovery',
		method: 'RECOVERY_CODE',
		name: 'Резервный код',
		description: 'Используйте одноразовые запасные коды',
		icon: ShieldIcon
	}
]
