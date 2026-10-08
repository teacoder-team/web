import { ArrowLeftIcon } from 'lucide-react'

import type { MfaOption } from '@/constants/mfa-methods'

import { cn } from '@/lib/utils'

import { Button } from '../../ui/button'
import { AuthWrapper } from '../auth-wrapper'

interface MfaMethodListProps {
	options: MfaOption[]
	onSelect: (option: MfaOption) => void
	onBack: () => void
}

export function MfaMethodList({
	options,
	onSelect,
	onBack
}: MfaMethodListProps) {
	return (
		<AuthWrapper
			heading='Подтвердите вход'
			description='Включена многофакторная аутентификация. Выберите способ подтверждения.'
		>
			<div className='space-y-4'>
				{options.map(option => {
					const Icon = option.icon
					return (
						<button
							key={option.id}
							onClick={() => onSelect(option)}
							className={cn(
								'w-full rounded-lg border p-4 text-left transition-all duration-200',
								'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
								'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
								'border-border bg-card'
							)}
						>
							<div className='flex items-center gap-4'>
								<div
									className={cn(
										'flex size-10 items-center justify-center rounded-lg bg-blue-500'
									)}
								>
									<Icon className={cn('size-5 text-white')} />
								</div>
								<div className='min-w-0 flex-1'>
									<h3 className='font-medium text-foreground'>
										{option.name}
									</h3>
									<p className='mt-1 text-sm text-muted-foreground'>
										{option.description}
									</p>
								</div>
							</div>
						</button>
					)
				})}

				<Button
					variant='ghost'
					onClick={onBack}
					className='mt-6 w-full'
				>
					<ArrowLeftIcon className='mr-2 h-4 w-4' />
					Назад к входу
				</Button>
			</div>
		</AuthWrapper>
	)
}
