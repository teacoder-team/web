'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import { usePostBillingCreateMutation } from '@/generated/api'
import { CreatePaymentPayloadMethod } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import {
	SPLIT_MONTHS,
	SPLIT_PARTS,
	findSplit
} from '@/lib/billing/payment-methods'
import { useAppConfig } from '@/lib/config/useAppConfig'
import { MONTH, cn, formatPrice, plural } from '@/lib/utils'

import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import { Input } from '../ui/input'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SplitPaymentButtonProps {
	courseId: string
	/** Amount to pay for the course right now, discount included. */
	amount: number
	currency: string
	/** Sends guests to sign-in; resolves the action only for signed-in users. */
	requireAuth: (action: () => void) => void
}

export function SplitPaymentButton({
	courseId,
	amount,
	currency,
	requireAuth
}: SplitPaymentButtonProps) {
	const { user } = useSession()
	const { data: config } = useAppConfig()

	const [isEmailOpen, setIsEmailOpen] = useState(false)
	const [email, setEmail] = useState('')

	const split = findSplit(config?.features.payments)

	const { mutate, isPending } = usePostBillingCreateMutation({
		mutation: {
			onSuccess(data) {
				window.location.assign(data.url)
			},
			onError(error) {
				toast.error(
					getErrorMessage(
						error,
						'Не удалось создать платёж в Яндекс Сплит. Попробуйте ещё раз или выберите другой способ оплаты.'
					),
					{ duration: 8000 }
				)
			}
		}
	})

	if (!split) return null

	const part = formatPrice(amount / SPLIT_PARTS, currency)
	const isEmailValid = EMAIL_PATTERN.test(email.trim())

	function createPayment(receiptEmail?: string) {
		if (!split) return

		mutate({
			data: {
				method: CreatePaymentPayloadMethod.YANDEX_SPLIT,
				provider: split.provider,
				courseId,
				email: receiptEmail
			}
		})
	}

	function handleClick() {
		requireAuth(() => {
			if (user?.email) {
				createPayment()
			} else {
				setIsEmailOpen(true)
			}
		})
	}

	function handleEmailSubmit() {
		if (!isEmailValid) return

		setIsEmailOpen(false)
		createPayment(email.trim())
	}

	return (
		<>
			<button
				type='button'
				onClick={handleClick}
				disabled={isPending}
				className={cn(
					'group relative mt-2 w-full cursor-pointer overflow-hidden rounded-2xl border border-brand/30 bg-brand-soft/50 p-4 text-left',
					'transition-[border-color,background-color,box-shadow,transform] duration-200',
					'hover:border-brand/60 hover:bg-brand-soft hover:shadow-card-hover active:scale-[0.98]',
					'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
					'disabled:cursor-default disabled:opacity-70'
				)}
			>
				<span className='flex items-center justify-between gap-3'>
					<span className='flex h-10 items-center rounded-full bg-white px-4 shadow-card'>
						<Image
							src='/images/payments/yandex-split-logo.svg'
							alt='Яндекс Сплит'
							width={1000}
							height={143}
							unoptimized
							className='h-4.5 w-auto'
						/>
					</span>
					<span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:translate-x-0.5'>
						{isPending ? (
							<Loader2 className='size-4 animate-spin' />
						) : (
							<ArrowRight className='size-4' />
						)}
					</span>
				</span>

				<span className='mt-4 block leading-tight font-medium'>
					Оплатить частями
				</span>
				<span className='mt-1 block text-sm leading-snug text-muted-foreground'>
					Сегодня{' '}
					<span className='font-medium text-foreground'>{part}</span>{' '}
					- четверть цены, остальное за {SPLIT_MONTHS}{' '}
					{plural(SPLIT_MONTHS, MONTH)}
				</span>

				<span
					aria-hidden='true'
					className='mt-4 grid grid-cols-4 gap-1.5'
				>
					{Array.from({ length: SPLIT_PARTS }).map((_, index) => (
						<span
							key={index}
							className={cn(
								'h-1.5 rounded-full transition-colors duration-300',
								index === 0
									? 'bg-brand'
									: 'bg-brand/20 group-hover:bg-brand/40'
							)}
							style={{ transitionDelay: `${index * 60}ms` }}
						/>
					))}
				</span>
				<span className='mt-2 flex justify-between text-xs text-muted-foreground'>
					<span>Сегодня 1/{SPLIT_PARTS}</span>
					<span>Без переплат</span>
				</span>
			</button>

			<Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Почта для чека</DialogTitle>
						<DialogDescription>
							К аккаунту не привязана почта. Укажите её, чтобы мы
							отправили чек об оплате.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={event => {
							event.preventDefault()
							handleEmailSubmit()
						}}
						className='grid gap-4'
					>
						<Input
							type='email'
							placeholder='tony@starkindustries.com'
							value={email}
							onChange={event => setEmail(event.target.value)}
							autoFocus
						/>
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsEmailOpen(false)}
							>
								Отмена
							</Button>
							<Button type='submit' disabled={!isEmailValid}>
								Продолжить
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}
