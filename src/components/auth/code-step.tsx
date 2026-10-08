'use client'

import { ArrowLeftIcon } from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { OtpInput } from '../shared/otp-input'
import { Button } from '../ui/button'

import { AuthWrapper } from './auth-wrapper'

interface CodeStepProps {
	heading: string
	description: string
	backText: string
	isLoading: boolean
	onSubmit: (code: string) => void
	onBack: () => void
	children?: ReactNode
}

/** The "enter a 6-digit code" screen: MFA via app, email confirmation. */
export function CodeStep({
	heading,
	description,
	backText,
	isLoading,
	onSubmit,
	onBack,
	children
}: CodeStepProps) {
	const [code, setCode] = useState('')

	return (
		<AuthWrapper heading={heading} description={description}>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<label
						htmlFor='totp-code'
						className='text-sm font-medium text-foreground'
					>
						Код подтверждения
					</label>

					<OtpInput value={code} onChange={setCode} />
				</div>

				<Button
					onClick={() => onSubmit(code)}
					variant='primary'
					className='w-full'
					disabled={!code.trim() || code.length !== 6}
					isLoading={isLoading}
				>
					Продолжить
				</Button>

				{children}

				<Button variant='ghost' onClick={onBack} className='w-full'>
					<ArrowLeftIcon className='mr-2 h-4 w-4' />
					{backText}
				</Button>
			</div>
		</AuthWrapper>
	)
}
