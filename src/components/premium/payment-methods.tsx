import type { Control } from 'react-hook-form'

import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PAYMENT_METHOD_ICONS } from '@/constants/payment-icons'

import { useAppConfig } from '@/lib/config/use-app-config'
import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'

import type { PaymentFormValues } from './premium'

interface PaymentMethodsProps {
	control: Control<PaymentFormValues>
}

export function PaymentMethods({ control }: PaymentMethodsProps) {
	const { data: config, isLoading } = useAppConfig()

	const data = config?.features.payments

	if (isLoading || !data)
		return (
			<div className='flex flex-col gap-4'>
				{Array.from({ length: 3 }).map((_, index) => (
					<PaymentMethodSkeleton key={index} />
				))}
			</div>
		)

	return (
		<FormField
			control={control}
			name='method'
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<RadioGroup
							value={field.value}
							onValueChange={field.onChange}
							className='flex flex-col gap-4'
						>
							{/* `GET /` lists only the methods that work right now. */}
							{data.map(method => {
								const Icon = PAYMENT_METHOD_ICONS[method.id]
								const isSelected = field.value === method.id

								return (
									<Label
										key={method.id}
										htmlFor={method.id}
										className={cn(
											'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-200',
											isSelected
												? 'border-blue-500 bg-blue-50 dark:border-border dark:bg-neutral-800'
												: 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-background'
										)}
									>
										<div
											className={cn(
												'flex size-10 items-center justify-center rounded-lg',
												isSelected
													? 'bg-blue-500'
													: 'bg-blue-100'
											)}
										>
											<Icon
												className={cn(
													'size-5',
													isSelected
														? 'text-white'
														: 'text-blue-500'
												)}
											/>
										</div>
										<div className='flex flex-1 flex-col'>
											<span
												className={cn(
													'font-medium',
													isSelected
														? 'text-blue-900 dark:text-white'
														: 'text-foreground'
												)}
											>
												{method.name}
											</span>
											<span
												className={cn(
													'mt-0.5 text-sm font-normal',
													isSelected
														? 'text-blue-700 dark:text-neutral-300'
														: 'text-muted-foreground'
												)}
											>
												{method.description}
											</span>
										</div>
										<RadioGroupItem
											value={method.id}
											id={method.id}
											className='sr-only'
										/>
									</Label>
								)
							})}
						</RadioGroup>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

export function PaymentMethodSkeleton() {
	return (
		<div className='flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-700 dark:bg-neutral-900'>
			<Skeleton className='h-10 w-10 rounded-lg' />
			<div className='flex flex-1 flex-col gap-2'>
				<Skeleton className='h-4 w-1/3' />
				<Skeleton className='h-3 w-2/3' />
			</div>
		</div>
	)
}
