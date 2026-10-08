'use client'

import { useQueryClient } from '@tanstack/react-query'
import { CreditCardIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetBillingSubscriptionQueryQueryKey,
	usePatchBillingSubscriptionMutation
} from '@/generated/api'
import type { SubscriptionResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { formatFullDate } from '@/lib/utils'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'

interface AutoRenewProps {
	subscription: SubscriptionResponse
}

function describePaymentMethod(
	method: SubscriptionResponse['paymentMethod']
): string | null {
	if (!method) {
		return null
	}

	const title = method.title ?? 'Выбранный способ оплаты'

	return method.last4 ? `${title} •••• ${method.last4}` : title
}

/** Cancelling a subscription means switching auto-renewal off - the paid period stays. */
export function AutoRenew({ subscription }: AutoRenewProps) {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isPending } = usePatchBillingSubscriptionMutation({
		mutation: {
			onSuccess(data) {
				setIsOpen(false)
				queryClient.setQueryData(
					getGetBillingSubscriptionQueryQueryKey(),
					data
				)
				toast.success(
					data.autoRenew
						? 'Автопродление включено'
						: 'Автопродление отключено'
				)
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Не удалось изменить автопродление')
				)
			}
		}
	})

	const { autoRenew, expiresAt, paymentMethod } = subscription

	const toggle = (value: boolean) => mutate({ data: { autoRenew: value } })

	const paymentMethodLabel = describePaymentMethod(paymentMethod)

	return (
		<Card className='shadow-none'>
			<CardContent className='flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between'>
				<div className='flex items-start gap-x-4'>
					<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
						<CreditCardIcon className='size-5 stroke-[1.7px] text-white' />
					</div>
					<div className='space-y-1'>
						<h2 className='font-semibold'>Автопродление</h2>
						<p className='text-sm text-muted-foreground'>
							{autoRenew
								? 'Подписка продлевается автоматически раз в месяц. Отключить можно в любой момент — оплаченный период останется у вас.'
								: 'Автопродление выключено. Включите его, чтобы доступ не прервался.'}
						</p>
						{paymentMethodLabel && (
							<p className='text-sm text-muted-foreground'>
								Способ оплаты: {paymentMethodLabel}
							</p>
						)}
					</div>
				</div>
				<div>
					{autoRenew ? (
						<ConfirmDialog
							open={isOpen}
							onOpenChange={setIsOpen}
							title='Отменить подписку?'
							description={
								expiresAt
									? `Автоматические списания прекратятся, а премиум останется у вас до ${formatFullDate(expiresAt)}. Включить продление можно в любой момент.`
									: 'Автоматические списания прекратятся, а оплаченный период останется у вас. Включить продление можно в любой момент.'
							}
							confirmText='Отменить подписку'
							destructive
							handleConfirm={() => toggle(false)}
							isLoading={isPending}
						>
							<Button variant='outline'>Отменить подписку</Button>
						</ConfirmDialog>
					) : (
						<Button
							variant='primary'
							onClick={() => toggle(true)}
							isLoading={isPending}
						>
							Включить
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
