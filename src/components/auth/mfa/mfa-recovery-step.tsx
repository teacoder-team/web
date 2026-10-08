'use client'

import { ArrowLeftIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { AuthWrapper } from '../auth-wrapper'

interface MfaRecoveryStepProps {
	isLoading: boolean
	onSubmit: (code: string) => void
	onBack: () => void
}

export function MfaRecoveryStep({
	isLoading,
	onSubmit,
	onBack
}: MfaRecoveryStepProps) {
	const [code, setCode] = useState('')

	return (
		<AuthWrapper
			heading='Введите резервный код'
			description='Введите один из ваших запасных кодов восстановления. Каждый код можно использовать только один раз'
		>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<label
						htmlFor='recovery-code'
						className='text-sm font-medium text-foreground'
					>
						Резервный код
					</label>
					<Input
						id='recovery-code'
						type='text'
						placeholder='Введите ваш резервный код'
						value={code}
						onChange={e => setCode(e.target.value)}
						className='font-mono'
						autoComplete='one-time-code'
					/>
					<p className='text-xs text-muted-foreground'>
						Код восстановления для доступа к аккаунту
					</p>
				</div>

				<Button
					onClick={() => onSubmit(code.trim())}
					variant='primary'
					className='w-full'
					isLoading={isLoading}
					disabled={!code.trim() || code.trim().length !== 11}
				>
					Продолжить
				</Button>

				<Button
					variant='ghost'
					onClick={onBack}
					className='w-full'
					disabled={isLoading}
				>
					<ArrowLeftIcon className='mr-2 h-4 w-4' />
					Выбрать другой метод
				</Button>
			</div>
		</AuthWrapper>
	)
}
