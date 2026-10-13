'use client'

import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { useSession } from '@/lib/auth/auth-provider'
import { useAppConfig } from '@/lib/config/useAppConfig'
import { ROUTES } from '@/lib/routes'
import { MONTH, formatPrice, pluralize } from '@/lib/utils'

import { PaymentDialog } from '../billing/payment-dialog'
import { Skeleton } from '../ui/skeleton'

const BENEFITS = [
	'Закрытые уроки всех курсов с пометкой «По подписке»',
	'Исходный код и материалы этих курсов',
	'Новые курсы по подписке - сразу после выхода',
	'Значок Premium в таблице лидеров'
]

export function Premium() {
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	const { isAuthorized, user, isLoading } = useSession()
	const { data: config } = useAppConfig()

	const premium = config?.features.premium
	const period = premium
		? premium.months === 1
			? 'месяц'
			: pluralize(premium.months, MONTH)
		: null

	function handleSubscribe() {
		if (!isAuthorized) {
			return router.push(ROUTES.AUTH.LOGIN(ROUTES.PREMIUM))
		}
		setIsOpen(true)
	}

	return (
		<>
			<section className='page-container grid gap-5 lg:grid-cols-[1.1fr_1fr]'>
				<div className='relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl bg-inverse p-7 text-inverse-foreground sm:p-10 dark:ring-1 dark:ring-border'>
					<Image
						src='/images/art/hero-grain.webp'
						alt=''
						fill
						sizes='(min-width: 1024px) 50vw, 100vw'
						className='-z-20 object-cover object-top-right'
					/>
					<Image
						src='/images/art/sphere-halftone.png'
						unoptimized
						alt=''
						width={960}
						height={960}
						aria-hidden='true'
						className='pointer-events-none absolute -top-16 -right-20 -z-10 w-72 opacity-80 sm:w-96'
					/>

					<p className='font-mono text-xs tracking-[0.18em] text-highlight uppercase'>
						Premium
					</p>

					<div className='mt-16'>
						{premium ? (
							<p className='flex flex-wrap items-baseline gap-x-3'>
								<span className='font-display text-[clamp(3rem,2.2rem+3vw,4.5rem)] leading-none font-medium tracking-[-0.04em]'>
									{formatPrice(
										premium.prices.standard,
										premium.currency
									)}
								</span>
								<span className='text-lg text-inverse-foreground/60'>
									/ {period}
								</span>
							</p>
						) : (
							<Skeleton className='h-16 w-56 rounded-2xl bg-inverse-foreground/10' />
						)}
						<p className='mt-4 max-w-sm text-inverse-foreground/65'>
							Автопродление каждый период. Отменить можно в любой
							момент в настройках аккаунта.
						</p>

						<Button
							size='xl'
							variant='highlight'
							onClick={handleSubscribe}
							isLoading={isLoading}
							disabled={user?.isPremium || isLoading}
							className='mt-8 w-full sm:w-auto'
						>
							{user?.isPremium ? (
								'У вас уже есть подписка'
							) : (
								<>
									Оформить подписку
									<ArrowRight />
								</>
							)}
						</Button>
					</div>
				</div>

				<div className='flex flex-col rounded-3xl border border-border bg-card p-7 sm:p-10'>
					<h2 className='font-display text-display-md font-medium'>
						Что входит
					</h2>
					<ul className='mt-8 space-y-5'>
						{BENEFITS.map(benefit => (
							<li key={benefit} className='flex gap-3.5'>
								<span className='mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand'>
									<Check
										className='size-3.5'
										strokeWidth={3}
									/>
								</span>
								<span className='leading-relaxed'>
									{benefit}
								</span>
							</li>
						))}
					</ul>
					<p className='mt-auto border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground'>
						Курсы, которые продаются только отдельной покупкой, в
						подписку не входят. Бесплатные курсы открыты всем.
					</p>
				</div>
			</section>

			<PaymentDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				internationalPrice={
					premium
						? formatPrice(
								premium.prices.international,
								premium.currency
							)
						: null
				}
				summary={method =>
					premium
						? `Подписка Premium - ${formatPrice(
								method === 'INTERNATIONAL_CARD'
									? premium.prices.international
									: premium.prices.standard,
								premium.currency
							)} / ${period}`
						: null
				}
			/>
		</>
	)
}
