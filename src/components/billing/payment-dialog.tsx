'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostBillingCreateMutation } from '@/generated/api'
import {
	CreatePaymentPayloadProvider,
	RootResponseFeaturesPaymentsItemId
} from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { RECURRING_METHODS, withoutSplit } from '@/lib/billing/payment-methods'
import { useAppConfig } from '@/lib/config/useAppConfig'
import { ROUTES } from '@/lib/routes'

import { PaymentMethods } from '../premium/payment-methods'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
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
	provider: z.nativeEnum(CreatePaymentPayloadProvider, {
		required_error: 'Выберите метод оплаты'
	}),
	email: z.string().email('Введите корректный email').optional()
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	/** Without it the payment is for the subscription. */
	courseId?: string
	summary?: (method: string) => string | null
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
	const { data: config } = useAppConfig()

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
	const provider = form.watch('provider')
	const payments = withoutSplit(config?.features.payments)
	const hasUnstableMethods = Boolean(
		payments?.some(
			p =>
				p.provider === CreatePaymentPayloadProvider.YOOKASSA &&
				(p.id === RootResponseFeaturesPaymentsItemId.BANK_CARD ||
					p.id === RootResponseFeaturesPaymentsItemId.SBP)
		)
	)
	const isSubscription = !courseId
	const hasAutoRenewal =
		isSubscription &&
		(RECURRING_METHODS.includes(method) ||
			provider === CreatePaymentPayloadProvider.ROBOKASSA)
	const summaryText = summary?.(method) ?? null

	useEffect(() => {
		form.clearErrors('method')
	}, [method, provider, form])

	// A method is identified by its id and provider together. Keep the
	// selection on an available pair, preferring the current method id.
	useEffect(() => {
		if (!payments?.length) return
		if (payments.some(p => p.id === method && p.provider === provider))
			return

		const fallback = payments.find(p => p.id === method) ?? payments[0]
		form.setValue('method', fallback.id)
		form.setValue('provider', fallback.provider)
	}, [payments, method, provider, form])

	const onSubmit = ({ method, provider, email }: PaymentFormValues) => {
		mutate({
			data: {
				method,
				provider,
				courseId,
				email: user?.email ? undefined : email
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='block max-h-[calc(100dvh-2rem)] overflow-hidden p-0 sm:max-w-md sm:p-0'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex max-h-[calc(100dvh-2rem)] flex-col'
					>
						<DialogHeader className='shrink-0 px-6 pt-6 pb-4 sm:px-8 sm:pt-8'>
							<DialogTitle>Выберите способ оплаты</DialogTitle>
							{summaryText && (
								<DialogDescription>
									{summaryText}
								</DialogDescription>
							)}
						</DialogHeader>

						<div className='flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 pb-4 sm:px-8'>
							{hasUnstableMethods && (
								<Alert variant='warning'>
									<TriangleAlertIcon className='size-4' />
									<div>
										<AlertTitle>
											Возможны сбои при оплате
										</AlertTitle>
										<AlertDescription>
											Оплата банковской картой и через СБП
											с помощью ЮKassa временно может
											работать нестабильно. Если платёж не
											проходит, воспользуйтесь резервным
											способом оплаты банковской картой
											или через СБП.
										</AlertDescription>
									</div>
								</Alert>
							)}

							<PaymentMethods control={form.control} />

							{!user?.email && (
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
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
						</div>

						<div className='flex shrink-0 flex-col gap-4 border-t border-border px-6 pt-4 pb-6 sm:px-8 sm:pb-8'>
							{isSubscription &&
								method === 'INTERNATIONAL_CARD' &&
								internationalPrice && (
									<p className='text-xs leading-relaxed text-muted-foreground'>
										Из-за высокой комиссии международных
										платёжных систем итоговая стоимость
										составляет{' '}
										<span className='font-semibold text-foreground'>
											{internationalPrice}
										</span>
										.
									</p>
								)}

							{hasAutoRenewal && (
								<p className='text-xs leading-relaxed text-muted-foreground'>
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

							<div className='flex gap-x-3'>
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
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
