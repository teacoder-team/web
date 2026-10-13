import { ArrowLeftIcon } from 'lucide-react'

import type { MfaOption } from '@/lib/auth/mfa-options'
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
			<div className='space-y-3'>
				{options.map(option => {
					const Icon = option.icon
					return (
						<button
							key={option.id}
							onClick={() => onSelect(option)}
							className={cn(
								'group w-full rounded-2xl border border-border bg-input p-4 text-left transition-colors duration-200',
								'hover:border-foreground/20',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden'
							)}
						>
							<div className='flex items-center gap-4'>
								<div
									className={cn(
										'flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand'
									)}
								>
									<Icon className='size-5' />
								</div>
								<div className='min-w-0 flex-1'>
									<h3 className='font-medium text-foreground'>
										{option.name}
									</h3>
									<p className='mt-0.5 text-sm text-muted-foreground'>
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
					<ArrowLeftIcon />
					Назад к входу
				</Button>
			</div>
		</AuthWrapper>
	)
}
