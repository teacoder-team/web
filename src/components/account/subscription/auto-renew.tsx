'use client'

import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
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
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { SettingsRow } from '../account-ui'

interface AutoRenewProps {
	subscription: SubscriptionResponse
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

	const { autoRenew, expiresAt } = subscription

	const toggle = (value: boolean) => mutate({ data: { autoRenew: value } })

	return (
		<SettingsRow
			icon={<RefreshCw />}
			title='Автопродление'
			badge={
				autoRenew ? (
					<Badge variant='success'>Включено</Badge>
				) : (
					<Badge variant='neutral'>Выключено</Badge>
				)
			}
			description={
				autoRenew
					? 'Подписка продлевается автоматически. Отключить можно в любой момент - оплаченный период останется у вас.'
					: 'Включите автопродление, чтобы доступ не прервался.'
			}
		>
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
				<Button onClick={() => toggle(true)} isLoading={isPending}>
					Включить
				</Button>
			)}
		</SettingsRow>
	)
}
