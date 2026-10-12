'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostBillingCreateMutation } from '@/generated/api'
import { RootResponseFeaturesPaymentsItemId } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'

import { PaymentMethods } from '../premium/payment-methods'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import { Input } from '../ui/input'

export const paymentSchema = z.object({
	method: z.nativeEnum(RootResponseFeaturesPaymentsItemId, {
		required_error: 'Выберите метод оплаты'
	}),
	email: z.string().email('Введите корректный email').optional()
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

const RECURRING_METHODS: string[] = ['BANK_CARD', 'SBP', 'T_PAY']

interface PaymentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	/** Buys this course; without it the payment is for the subscription. */
	courseId?: string
	/** Short line under the title, e.g. the plan and its price. */
	summary?: (method: string) => string | null
	/** Subscription only: price for foreign cards, shown when picked. */
	internationalPrice?: string | null
}

export function PaymentDialog({
	open,
	onOpenChange,
	courseId,
	summary,
	internationalPrice
}: PaymentDialogProps) {
	const { user } = useSession()

	const form = useForm<PaymentFormValues>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			method: RootResponseFeaturesPaymentsItemId.BANK_CARD
		}
	})

	const { mutate, isPending } = usePostBillingCreateMutation({
		mutation: {
			onSuccess(data) {
				onOpenChange(false)
				window.location.assign(data.url)
			},
			onError(error) {
				const message = getErrorMessage(
					error,
					'Не удалось создать платёж. Попробуйте ещё раз или выберите другой способ оплаты.'
				)
				form.setError('method', { type: 'manual', message })
				toast.error(message, { duration: 8000 })
			}
		}
	})

	const method = form.watch('method')
	const isSubscription = !courseId
	const summaryText = summary?.(method) ?? null

	useEffect(() => {
		form.clearErrors('method')
	}, [method, form])

	const onSubmit = ({ method, email }: PaymentFormValues) => {
		mutate({
			data: {
				method,
				courseId,
				email: user?.email ? undefined : email
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Выберите способ оплаты</DialogTitle>
					{summaryText && (
						<DialogDescription>{summaryText}</DialogDescription>
					)}
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<PaymentMethods control={form.control} />

						{isSubscription &&
							method === 'INTERNATIONAL_CARD' &&
							internationalPrice && (
								<p className='mt-4 text-xs leading-relaxed text-muted-foreground'>
									Из-за высокой комиссии международных
									платёжных систем итоговая стоимость
									составляет{' '}
									<span className='font-semibold text-foreground'>
										{internationalPrice}
									</span>
									.
								</p>
							)}

						{isSubscription &&
							RECURRING_METHODS.includes(method) && (
								<p className='mt-4 text-xs leading-relaxed text-muted-foreground'>
									Я даю согласие на будущие автосписания раз в
									месяц и принимаю условия{' '}
									<Link
										href={ROUTES.DOCUMENTS.TERMS}
										className='text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground'
									>
										пользовательского соглашения
									</Link>
									. Автосписания можно отключить в настройках
									аккаунта.
								</p>
							)}

						{!user?.email && (
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem className='mt-4'>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='tony@starkindustries.com'
												disabled={isPending}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className='flex gap-x-3 pt-6'>
							<Button
								type='button'
								variant='outline'
								size='lg'
								className='flex-1'
								onClick={() => onOpenChange(false)}
							>
								Отмена
							</Button>
							<Button
								type='submit'
								size='lg'
								className='flex-1'
								disabled={isPending}
							>
								Продолжить
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
