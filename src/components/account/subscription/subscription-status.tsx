'use client'

import { GemIcon } from 'lucide-react'
import Link from 'next/link'

import type { SubscriptionResponse } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { daysTranslator, daysUntil, formatFullDate } from '@/lib/utils'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'

/** Shown when the subscription is about to end without auto-renewal. */
const ENDING_SOON_DAYS = 7

interface SubscriptionStatusProps {
	subscription: SubscriptionResponse
}

function getState(subscription: SubscriptionResponse) {
	const { isActive, autoRenew, expiresAt, startedAt } = subscription

	if (isActive) {
		const left = expiresAt ? daysUntil(expiresAt) : null
		const isEndingSoon =
			!autoRenew && left !== null && left <= ENDING_SOON_DAYS

		return {
			badge: isEndingSoon
				? {
						variant: 'warning' as const,
						label: `Осталось ${left} ${daysTranslator(left ?? 0)}`
					}
				: { variant: 'success' as const, label: 'Активна' },
			description: expiresAt
				? autoRenew
					? `Следующее списание — ${formatFullDate(expiresAt)}. Доступ не прервётся.`
					: `Автопродление выключено: доступ сохранится до ${formatFullDate(expiresAt)}, затем подписка закончится.`
				: 'Премиум активен.'
		}
	}

	if (startedAt) {
		return {
			badge: { variant: 'error' as const, label: 'Закончилась' },
			description: expiresAt
				? `Подписка закончилась ${formatFullDate(expiresAt)}. Продлите её, чтобы снова открыть исходный код всех проектов.`
				: 'Подписка закончилась. Продлите её, чтобы снова открыть исходный код всех проектов.',
			action: 'Продлить'
		}
	}

	return {
		badge: { variant: 'neutral' as const, label: 'Нет подписки' },
		description:
			'С подпиской открывается исходный код всех проектов платформы, премиум-уроки и значок Premium в рейтинге.',
		action: 'Оформить подписку'
	}
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
	const state = getState(subscription)

	return (
		<Card className='shadow-none'>
			<CardContent className='flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between'>
				<div className='flex items-start gap-x-4'>
					<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
						<GemIcon className='size-5 stroke-[1.7px] text-white' />
					</div>
					<div className='space-y-1'>
						<div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center'>
							<h2 className='font-semibold'>TeaCoder Premium</h2>
							<Badge variant={state.badge.variant}>
								{state.badge.label}
							</Badge>
						</div>
						<p className='text-sm text-muted-foreground'>
							{state.description}
						</p>
					</div>
				</div>
				{state.action && (
					<Button variant='primary' className='md:w-auto' asChild>
						<Link href={ROUTES.PREMIUM}>{state.action}</Link>
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
