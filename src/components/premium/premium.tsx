'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CodeIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { usePostBillingCreateMutation } from '@/generated/api'
import { RootResponseFeaturesPaymentsItemId } from '@/generated/model'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
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

import { FAQSection } from './faq'
import { PaymentMethods } from './payment-methods'

export const paymentSchema = z.object({
	method: z.nativeEnum(RootResponseFeaturesPaymentsItemId, {
		required_error: 'Выберите метод оплаты'
	}),
	email: z.string().email('Введите корректный email').optional()
})

export type PaymentFormValues = z.infer<typeof paymentSchema>

export function Premium() {
	const [isOpen, setIsOpen] = useState(false)

	const router = useRouter()

	const { isAuthorized, user, isLoading } = useSession()
	const { data: config } = useAppConfig()

	const premium = config?.features.premium

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
				form.setError('method', {
					type: 'manual',
					message: getErrorMessage(
						error,
						'Не удалось создать платеж. Попробуйте позже.'
					)
				})
			}
		}
	})

	const method = form.watch('method')

	const onSubmit = ({ method, email }: PaymentFormValues) => {
		mutate({ data: { method, email: user?.email ? undefined : email } })
	}

	return (
		<>
			<main className='mx-auto my-20 overflow-x-hidden'>
				<div className='mx-auto w-full pb-14 text-center'>
					<h1 className='text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl'>
						Откройте весь исходный код
					</h1>
					<p className='mx-auto mt-6 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:max-w-sm md:max-w-lg md:text-base lg:max-w-2xl lg:text-xl'>
						Единый премиум-план предоставляет полный и
						неограниченный доступ ко всему исходному коду всех
						проектов
					</p>
				</div>

				<div className='relative mx-auto flex justify-center px-6 lg:px-8'>
					<div
						aria-hidden='true'
						className='pointer-events-none absolute left-1/2 top-24 -z-10 w-[100vw] -translate-x-1/2 -rotate-[10deg] scale-x-150 transform'
					>
						<div className='flex flex-col'>
							<div className='h-12 w-full bg-blue-200 opacity-90 dark:bg-blue-700' />
							<div className='h-12 w-full bg-blue-300 opacity-80 dark:bg-blue-800' />
							<div className='h-12 w-full bg-blue-400 opacity-70 dark:bg-blue-900' />
						</div>
					</div>

					<Card className='relative z-20 w-full max-w-[25rem] rounded-2xl'>
						<CardHeader className='text-center'>
							<div className='mb-2 flex justify-center'>
								<div className='flex size-14 items-center justify-center rounded-full bg-blue-100 p-3.5 dark:border dark:border-border dark:bg-neutral-800'>
									<CodeIcon className='size-11 text-blue-600' />
								</div>
							</div>
							<h2 className='text-2xl font-bold text-foreground'>
								Доступ к исходному коду
							</h2>
							<p className='mt-3 text-sm text-neutral-500 dark:text-neutral-400'>
								Единый план для всех проектов
							</p>
						</CardHeader>

						<CardContent className='flex flex-col items-center gap-6'>
							<div className='text-center'>
								{premium ? (
									<>
										<span className='text-5xl font-extrabold text-foreground'>
											{formatPrice(
												premium.prices.standard,
												premium.currency
											)}
										</span>
										<span className='ml-1 text-lg text-neutral-500 dark:text-neutral-400'>
											/{' '}
											{premium.months === 1
												? 'месяц'
												: `${premium.months} ${monthsTranslator(premium.months)}`}
										</span>
									</>
								) : (
									<Skeleton className='mx-auto h-12 w-48 rounded-lg' />
								)}
							</div>
							<p className='text-center text-neutral-600 dark:text-neutral-300'>
								Полный доступ к исходному коду всех проектов.
								Больше никаких ограничений!
							</p>
						</CardContent>

						<CardFooter className='flex justify-center'>
							<Button
								onClick={() => {
									if (!isAuthorized)
										return router.push(
											ROUTES.AUTH.LOGIN(ROUTES.PREMIUM)
										)
									setIsOpen(true)
								}}
								variant='primary'
								size='lg'
								className='w-full'
								isLoading={isLoading}
								disabled={user?.isPremium || isLoading}
							>
								{user?.isPremium
									? 'У вас уже есть подписка'
									: 'Оплатить'}
							</Button>
						</CardFooter>
					</Card>
				</div>

				<FAQSection />
			</main>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Выберите способ оплаты</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='mt-2'
						>
							<PaymentMethods control={form.control} />

							{method === 'INTERNATIONAL_CARD' && premium && (
								<p className='mt-4 text-xs text-muted-foreground'>
									Из-за высокой комиссии международных
									платёжных систем итоговая стоимость
									составляет{' '}
									<span className='font-semibold'>
										{formatPrice(
											premium.prices.international,
											premium.currency
										)}
									</span>
									.
								</p>
							)}

							{['BANK_CARD', 'SBP', 'T_PAY'].includes(method) && (
								<p className='mt-4 text-xs text-muted-foreground'>
									Я даю согласие на будущие автосписания раз в
									месяц и принимаю условия{' '}
									<Link
										href='/document/terms-of-use'
										className='text-blue-500 underline'
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
									variant='primary'
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
