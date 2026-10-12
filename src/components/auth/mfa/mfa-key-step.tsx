import { ArrowLeftIcon, KeyIcon } from 'lucide-react'

import { Button } from '../../ui/button'
import { AuthWrapper } from '../auth-wrapper'

interface MfaKeyStepProps {
	isLoading: boolean
	onSubmit: () => void
	onBack: () => void
}

export function MfaKeyStep({ isLoading, onSubmit, onBack }: MfaKeyStepProps) {
	return (
		<AuthWrapper
			heading='Ключ доступа'
			description='Подтвердите личность с помощью биометрии или ключа'
		>
			<div className='space-y-4'>
				<div className='flex flex-col items-center py-8'>
					<div className='mb-5 flex size-16 items-center justify-center rounded-full bg-brand-soft'>
						<KeyIcon className='size-7 text-brand' />
					</div>
					<p className='text-center text-sm text-muted-foreground'>
						Следуйте подсказкам браузера или устройства, чтобы
						завершить аутентификацию
					</p>
				</div>

				<Button
					onClick={onSubmit}
					variant='primary'
					className='w-full'
					isLoading={isLoading}
				>
					{isLoading ? 'Аутентификация...' : 'Использовать ключ'}
				</Button>

				<Button
					variant='ghost'
					onClick={onBack}
					className='w-full'
					disabled={isLoading}
				>
					<ArrowLeftIcon />
					Выбрать другой метод
				</Button>
			</div>
		</AuthWrapper>
	)
}
