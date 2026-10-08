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
					<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
						<KeyIcon className='h-8 w-8 text-blue-600' />
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
					<ArrowLeftIcon className='mr-2 h-4 w-4' />
					Выбрать другой метод
				</Button>
			</div>
		</AuthWrapper>
	)
}
