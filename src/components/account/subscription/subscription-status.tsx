'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { SubscriptionResponse } from '@/generated/model'

import { ROUTES } from '@/lib/routes'
import { DAY, cn, daysUntil, formatFullDate, pluralize } from '@/lib/utils'

import { Button } from '../../ui/button'

/** Warn when the subscription ends soon without auto-renewal. */
const ENDING_SOON_DAYS = 7

interface SubscriptionStatusProps {
	subscription: SubscriptionResponse
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
	const { isActive, autoRenew, expiresAt, startedAt } = subscription

	const daysLeft = expiresAt ? daysUntil(expiresAt) : null
	const isEndingSoon =
		isActive &&
		!autoRenew &&
		daysLeft !== null &&
		daysLeft <= ENDING_SOON_DAYS

	const title = isActive
		? 'Premium активна'
		: startedAt
			? 'Подписка закончилась'
			: 'Подписки пока нет'

	const description = isActive
		? expiresAt
			? autoRenew
				? `Следующее списание - ${formatFullDate(expiresAt)}. Доступ не прервётся.`
				: `Автопродление выключено: доступ сохранится до ${formatFullDate(expiresAt)}, затем подписка закончится.`
			: 'Все курсы по подписке открыты.'
		: startedAt
			? expiresAt
				? `Подписка закончилась ${formatFullDate(expiresAt)}. Продлите её, чтобы снова открыть курсы по подписке.`
				: 'Продлите подписку, чтобы снова открыть курсы по подписке.'
			: 'Подписка открывает закрытые уроки и исходный код курсов с пометкой «По подписке» и значок Premium в рейтинге.'

	const details = isActive
		? [
				startedAt && {
					label: 'Подключена',
					value: formatFullDate(startedAt)
				},
				expiresAt && {
					label: autoRenew ? 'Следующее списание' : 'Действует до',
					value: formatFullDate(expiresAt)
				},
				{
					label: 'Автопродление',
					value: autoRenew ? 'Включено' : 'Выключено'
				}
			].filter(Boolean)
		: []

	return (
		<section className='relative isolate overflow-hidden rounded-3xl bg-inverse p-6 text-inverse-foreground dark:ring-1 dark:ring-border sm:p-8'>
			<Image
				src='/images/art/hero-grain.webp'
				alt=''
				fill
				sizes='(min-width: 1024px) 900px, 100vw'
				className='-z-20 object-cover object-right-top'
			/>
			<Image
				src='/images/art/sphere-halftone.png'
				unoptimized
				alt=''
				width={960}
				height={960}
				aria-hidden='true'
				className='pointer-events-none absolute -right-16 -top-20 -z-10 hidden w-80 opacity-70 sm:block'
			/>

			<p className='font-mono text-xs uppercase tracking-[0.18em] text-highlight'>
				TeaCoder Premium
			</p>
			<div className='mt-4 flex flex-wrap items-center gap-3'>
				<h2 className='font-display text-display-md font-medium'>
					{title}
				</h2>
				{isEndingSoon && daysLeft !== null && (
					<span className='rounded-full bg-warning px-2.5 py-1 text-xs font-medium text-inverse'>
						Осталось {pluralize(daysLeft, DAY)}
					</span>
				)}
			</div>
			<p className='mt-3 max-w-lg text-inverse-foreground/70'>
				{description}
			</p>

			{details.length > 0 ? (
				<dl className='mt-8 grid gap-6 border-t border-inverse-foreground/10 pt-6 sm:grid-cols-3'>
					{details.map(
						detail =>
							detail && (
								<div key={detail.label}>
									<dt className='text-sm text-inverse-foreground/55'>
										{detail.label}
									</dt>
									<dd
										className={cn(
											'mt-1.5 font-medium',
											detail.value === 'Выключено' &&
												'text-inverse-foreground/60'
										)}
									>
										{detail.value}
									</dd>
								</div>
							)
					)}
				</dl>
			) : (
				<Button size='lg' variant='highlight' className='mt-8' asChild>
					<Link href={ROUTES.PREMIUM}>
						{startedAt ? 'Продлить подписку' : 'Оформить подписку'}
						<ArrowRight />
					</Link>
				</Button>
			)}
		</section>
	)
}
