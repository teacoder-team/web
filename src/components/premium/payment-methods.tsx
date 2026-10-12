import { type Control, useController } from 'react-hook-form'

import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PAYMENT_METHOD_ICONS } from '@/constants/payment-icons'

import { useAppConfig } from '@/lib/config/use-app-config'
import { cn } from '@/lib/utils'

import type { PaymentFormValues } from '../billing/payment-dialog'
import { Skeleton } from '../ui/skeleton'

interface PaymentMethodsProps {
	control: Control<PaymentFormValues>
}

export function PaymentMethods({ control }: PaymentMethodsProps) {
	const { data: config, isLoading } = useAppConfig()
	const { field: provider } = useController({ control, name: 'provider' })

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
							value={`${field.value}:${provider.value}`}
							onValueChange={value => {
								const option = data.find(
									method => getOptionKey(method) === value
								)
								if (!option) return

								field.onChange(option.id)
								provider.onChange(option.provider)
							}}
							className='flex flex-col gap-4'
						>
							{/* `GET /` lists only the methods that work right now. */}
							{data.map(method => {
								const Icon = PAYMENT_METHOD_ICONS[method.id]
								const key = getOptionKey(method)
								const isSelected =
									field.value === method.id &&
									provider.value === method.provider

								return (
									<Label
										key={key}
										htmlFor={key}
										className={cn(
											'flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-colors duration-200',
											isSelected
												? 'border-primary bg-brand-soft/60'
												: 'border-border bg-input hover:border-foreground/20'
										)}
									>
										<div
											className={cn(
												'flex size-10 shrink-0 items-center justify-center rounded-full',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'bg-brand-soft text-brand'
											)}
										>
											<Icon className='size-5' />
										</div>
										<div className='flex flex-1 flex-col'>
											<span
												className={cn(
													'font-medium text-foreground'
												)}
											>
												{method.name}
											</span>
											<span
												className={cn(
													'mt-0.5 text-sm font-normal text-muted-foreground'
												)}
											>
												{method.description}
											</span>
										</div>
										<RadioGroupItem
											value={key}
											id={key}
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

function getOptionKey(method: { id: string; provider: string }) {
	return `${method.id}:${method.provider}`
}

export function PaymentMethodSkeleton() {
	return (
		<div className='flex items-center gap-3 rounded-2xl border border-border bg-input p-3.5'>
			<Skeleton className='size-10 rounded-full' />
			<div className='flex flex-1 flex-col gap-2'>
				<Skeleton className='h-4 w-1/3' />
				<Skeleton className='h-3 w-2/3' />
			</div>
		</div>
	)
}
