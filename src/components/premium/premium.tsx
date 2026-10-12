'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { usePostBillingCreateMutation } from '@/generated/api'
import { RootResponseFeaturesPaymentsItemId } from '@/generated/model'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'

import { ROUTES } from '@/constants/routes'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { useAppConfig } from '@/lib/config/use-app-config'
import { formatPrice, monthsTranslator } from '@/lib/utils'

import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

import { PaymentMethods } from './payment-methods'

export const paymentSchema = z.object({
	method: z.nativeEnum(RootResponseFeaturesPaymentsItemId, {
		required_error: 'Выберите метод оплаты'
	}),
	email: z.string().email('Введите корректный email').optional()
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

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
			: `${premium.months} ${monthsTranslator(premium.months)}`
		: null

	const form = useForm<PaymentFormValues>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			method: RootResponseFeaturesPaymentsItemId.BANK_CARD
		}
	})

	const { mutate, isPending } = usePostBillingCreateMutation({
		mutation: {
			onSuccess(data) {
				setIsOpen(false)
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

	useEffect(() => {
		form.clearErrors('method')
	}, [method, form])

	const onSubmit = ({ method, email }: PaymentFormValues) => {
		mutate({ data: { method, email: user?.email ? undefined : email } })
	}

	function handleSubscribe() {
		if (!isAuthorized) {
			return router.push(ROUTES.AUTH.LOGIN(ROUTES.PREMIUM))
		}
		setIsOpen(true)
	}

	return (
		<>
			<section className='page-container grid gap-5 lg:grid-cols-[1.1fr_1fr]'>
				<div className='relative isolate flex min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl bg-inverse p-7 text-inverse-foreground dark:ring-1 dark:ring-border sm:p-10'>
					<Image
						src='/images/art/hero-grain.webp'
						alt=''
						fill
						sizes='(min-width: 1024px) 50vw, 100vw'
						className='-z-20 object-cover object-right-top'
					/>
					<Image
						src='/images/art/sphere-halftone.png'
						unoptimized
						alt=''
						width={960}
						height={960}
						aria-hidden='true'
						className='pointer-events-none absolute -right-20 -top-16 -z-10 w-72 opacity-80 sm:w-96'
					/>

					<p className='font-mono text-xs uppercase tracking-[0.18em] text-highlight'>
						Premium
					</p>

					<div className='mt-16'>
						{premium ? (
							<p className='flex flex-wrap items-baseline gap-x-3'>
								<span className='font-display text-[clamp(3rem,2.2rem+3vw,4.5rem)] font-medium leading-none tracking-[-0.04em]'>
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

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Выберите способ оплаты</DialogTitle>
						{premium && (
							<DialogDescription>
								Подписка Premium -{' '}
								{formatPrice(
									method === 'INTERNATIONAL_CARD'
										? premium.prices.international
										: premium.prices.standard,
									premium.currency
								)}{' '}
								/ {period}
							</DialogDescription>
						)}
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<PaymentMethods control={form.control} />

							{method === 'INTERNATIONAL_CARD' && premium && (
								<p className='mt-4 text-xs leading-relaxed text-muted-foreground'>
									Из-за высокой комиссии международных
									платёжных систем итоговая стоимость
									составляет{' '}
									<span className='font-semibold text-foreground'>
										{formatPrice(
											premium.prices.international,
											premium.currency
										)}
									</span>
									.
								</p>
							)}

							{['BANK_CARD', 'SBP', 'T_PAY'].includes(method) && (
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
									onClick={() => setIsOpen(false)}
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
		</>
	)
}
