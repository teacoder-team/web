'use client'

import { useEffect, useState } from 'react'

import { MFA_OPTIONS, type MfaOption } from '@/constants/mfa-methods'

import { analytics } from '@/lib/analytics'
import type { MfaTicket } from '@/lib/auth/use-sign-in'

import { CodeStep } from '../code-step'

import { MfaKeyStep } from './mfa-key-step'
import { MfaMethodList } from './mfa-method-list'
import { MfaRecoveryStep } from './mfa-recovery-step'
import { useMfa } from './use-mfa'

interface MfaFormProps {
	ticket: MfaTicket
	onBack: () => void
}

/** Second sign-in step - after a password, a reset code or a social provider. */
export function MfaForm({ ticket, onBack }: MfaFormProps) {
	const [selected, setSelected] = useState<MfaOption | null>(null)

	const {
		selectCodeMethod,
		submitCode,
		submitKey,
		isCodePending,
		isKeyPending
	} = useMfa({ ticket, onExpired: onBack })

	const options = MFA_OPTIONS.filter(option =>
		ticket.methods.includes(option.method)
	)

	useEffect(() => {
		analytics.auth.mfa.methodsShown(ticket.methods)
	}, [ticket.methods])

	function handleSelect(option: MfaOption) {
		analytics.auth.mfa.select(option.id)

		setSelected(option)

		if (option.method !== 'WEBAUTHN') {
			selectCodeMethod(option)
		}
	}

	const handleBack = () => setSelected(null)

	if (!selected) {
		return (
			<MfaMethodList
				options={options}
				onSelect={handleSelect}
				onBack={onBack}
			/>
		)
	}

	if (selected.method === 'TOTP') {
		return (
			<CodeStep
				heading='Введите код'
				description='Откройте приложение-аутентификатор и введите 6-значный код'
				backText='Выбрать другой метод'
				isLoading={isCodePending}
				onSubmit={code => submitCode(selected, code)}
				onBack={handleBack}
			/>
		)
	}

	if (selected.method === 'WEBAUTHN') {
		return (
			<MfaKeyStep
				isLoading={isKeyPending}
				onSubmit={() => submitKey(selected)}
				onBack={handleBack}
			/>
		)
	}

	return (
		<MfaRecoveryStep
			isLoading={isCodePending}
			onSubmit={code => submitCode(selected, code)}
			onBack={handleBack}
		/>
	)
}
