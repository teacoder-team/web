'use client'

import { useQueryClient } from '@tanstack/react-query'
import confetti from 'canvas-confetti'
import { ArrowLeft, Check, Clock, Copy, X } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import {
	getGetBillingSubscriptionQueryQueryKey,
	getGetCoursesLibraryQueryQueryKey,
	getGetUsersMeQueryQueryKey,
	useGetBillingPaymentsByIdQuery
} from '@/generated/api'
import type { PaymentResponse } from '@/generated/model'

import { getApiError } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { env } from '@/lib/config/env'
import { ROUTES } from '@/lib/routes'
import { cn, formatPrice } from '@/lib/utils'

import { Logo } from '../shared/logo'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

const POLL_INTERVAL_MS = 3000

const CONFETTI_DURATION_MS = 5000
// canvas-confetti only understands hex colors
const CONFETTI_COLORS = ['#2563EB', '#38BDF8', '#BAE6FD', '#FFFFFF']

/** Five seconds of bursts from both sides; returns a cleanup. */
function launchConfetti() {
	const end = Date.now() + CONFETTI_DURATION_MS
	const defaults = {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		colors: CONFETTI_COLORS
	}
	const randomInRange = (min: number, max: number) =>
		Math.random() * (max - min) + min

	const interval = window.setInterval(() => {
		const timeLeft = end - Date.now()

		if (timeLeft <= 0) {
			window.clearInterval(interval)
			return
		}

		const particleCount = 50 * (timeLeft / CONFETTI_DURATION_MS)

		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
		})
		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
		})
	}, 250)

	return () => window.clearInterval(interval)
}

type Phase = 'pending' | 'success' | 'failed'

const PENDING_STATUSES: string[] = ['REQUIRES_PAYMENT', 'PROCESSING']

function getPhase(status: PaymentResponse['status']): Phase {
	if (status === 'CAPTURED') return 'success'
	if (PENDING_STATUSES.includes(status)) return 'pending'
	return 'failed'
}

function productLabel(payment: PaymentResponse) {
	return payment.product === 'COURSE' && payment.course
		? `курс «${payment.course.title}»`
		: 'подписка Premium'
}

export function PaymentStatus({ id }: { id: string }) {
	const { status: sessionStatus } = useSession()
	const queryClient = useQueryClient()

	const query = useGetBillingPaymentsByIdQuery(id, {
		query: {
			enabled: sessionStatus === 'authenticated',
			// Keep asking until the provider's webhook settles the payment
			refetchInterval: ({ state }) =>
				state.data && getPhase(state.data.status) === 'pending'
					? POLL_INTERVAL_MS
					: false,
			retry: (count, error) =>
				getApiError(error)?.status !== 404 && count < 3
		}
	})

	const payment = query.data
	const phase = payment ? getPhase(payment.status) : null

	const celebrated = useRef(false)

	useEffect(() => {
		if (phase !== 'success') return

		if (!celebrated.current) {
			celebrated.current = true

			// Access changed on the server - drop cached profile, subscription and library
			for (const queryKey of [
				getGetUsersMeQueryQueryKey(),
				getGetBillingSubscriptionQueryQueryKey(),
				getGetCoursesLibraryQueryQueryKey()
			]) {
				queryClient.invalidateQueries({ queryKey })
			}
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
			return

		return launchConfetti()
	}, [phase, queryClient])

	let content: ReactNode

	if (sessionStatus === 'guest') {
		content = (
			<StatusCard
				tone='neutral'
				icon={<Clock />}
				title='Войдите в аккаунт'
				description='Статус платежа виден только его владельцу.'
			>
				<Button size='lg' className='w-full' asChild>
					<Link href={ROUTES.AUTH.LOGIN(`/payment/${id}`)}>
						Войти
					</Link>
				</Button>
			</StatusCard>
		)
	} else if (sessionStatus === 'loading' || query.isPending) {
		content = <StatusSkeleton />
	} else if (query.isError || !payment) {
		const isMissing = getApiError(query.error)?.status === 404

		content = (
			<StatusCard
				tone='failed'
				icon={<X />}
				title={
					isMissing
						? 'Платёж не найден'
						: 'Не удалось получить статус'
				}
				description={
					isMissing
						? 'Проверьте ссылку или откройте платёж из того же аккаунта, с которого оплачивали.'
						: 'Попробуйте обновить статус ещё раз. Если не поможет - напишите в поддержку.'
				}
				footer={<SupportNote />}
			>
				{!isMissing && (
					<Button
						size='lg'
						className='w-full'
						isLoading={query.isFetching}
						onClick={() => query.refetch()}
					>
						Обновить статус
					</Button>
				)}
				<Button size='lg' variant='outline' className='w-full' asChild>
					<Link href={ROUTES.COURSES.ROOT}>К курсам</Link>
				</Button>
			</StatusCard>
		)
	} else if (phase === 'success') {
		content = (
			<StatusCard
				tone='success'
				icon={<Check />}
				title='Оплата прошла успешно'
				description={
					payment.product === 'COURSE' && payment.course
						? `Курс «${payment.course.title}» теперь ваш - он открыт навсегда.`
						: 'Подписка Premium активирована - все курсы по подписке уже открыты.'
				}
				details={<PaymentDetails payment={payment} />}
			>
				<Button size='lg' className='w-full' asChild>
					<Link href={ROUTES.COURSES.ROOT}>Перейти к курсам</Link>
				</Button>
				{payment.course && (
					<Button
						size='lg'
						variant='outline'
						className='w-full'
						asChild
					>
						<Link href={ROUTES.COURSES.SINGLE(payment.course.slug)}>
							Открыть курс
						</Link>
					</Button>
				)}
			</StatusCard>
		)
	} else if (phase === 'pending') {
		const label = productLabel(payment)

		content = (
			<StatusCard
				tone='pending'
				icon={<Clock />}
				title='Ожидаем подтверждение оплаты'
				description={`${label.charAt(0).toUpperCase()}${label.slice(1)} будет ${
					payment.product === 'COURSE' ? 'начислен' : 'начислена'
				} в течение 5 минут, если оплата пройдёт успешно. Страницу можно не обновлять - статус обновится сам.`}
				details={<PaymentDetails payment={payment} />}
				footer={
					<p className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
						<span className='size-1.5 animate-pulse rounded-full bg-primary' />
						Проверяем статус платежа...
					</p>
				}
			>
				{payment.url && (
					<Button
						size='lg'
						variant='outline'
						className='w-full'
						asChild
					>
						<a href={payment.url}>
							<ArrowLeft />
							Вернуться к оплате
						</a>
					</Button>
				)}
			</StatusCard>
		)
	} else {
		const retryHref = payment.course
			? ROUTES.COURSES.SINGLE(payment.course.slug)
			: ROUTES.PREMIUM

		content = (
			<StatusCard
				tone='failed'
				icon={<X />}
				title={
					payment.status === 'EXPIRED'
						? 'Время на оплату истекло'
						: payment.status === 'CANCELLED'
							? 'Платёж отменён'
							: 'Платёж не прошёл'
				}
				description={
					payment.status === 'EXPIRED'
						? 'Ссылка на оплату действует один час. Оформите оплату заново - это займёт минуту.'
						: 'Произошла ошибка на стороне банка или платёжного провайдера. Попробуйте оплатить ещё раз или выберите другой способ.'
				}
				details={<PaymentDetails payment={payment} />}
				footer={<SupportNote withPaymentId />}
			>
				<Button size='lg' className='w-full' asChild>
					<Link href={retryHref}>Попробовать снова</Link>
				</Button>
			</StatusCard>
		)
	}

	return (
		<div className='relative isolate flex min-h-svh flex-col overflow-hidden bg-background'>
			<div
				aria-hidden='true'
				className={cn(
					'pointer-events-none absolute inset-0 -z-10 transition-colors duration-700',
					phase === 'success'
						? 'bg-[radial-gradient(60%_45%_at_50%_0%,hsl(var(--success)/0.14),transparent_70%)]'
						: phase === 'failed' || query.isError
							? 'bg-[radial-gradient(60%_45%_at_50%_0%,hsl(var(--destructive)/0.12),transparent_70%)]'
							: 'bg-[radial-gradient(60%_45%_at_50%_0%,hsl(var(--primary)/0.14),transparent_70%)]'
				)}
			/>
			<header className='page-container flex h-16 items-center'>
				<Link
					href={ROUTES.HOME}
					className='flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight'
				>
					<Logo className='h-7 w-auto' />
					TeaCoder
				</Link>
			</header>
			<main className='flex flex-1 items-center justify-center px-4 py-12'>
				<div className='w-full max-w-md duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none'>
					{content}
				</div>
			</main>
		</div>
	)
}

const TONES = {
	pending: 'bg-brand-soft text-brand',
	success: 'bg-success-soft text-success',
	failed: 'bg-destructive-soft text-destructive',
	neutral: 'bg-secondary text-foreground'
}

interface StatusCardProps {
	tone: keyof typeof TONES
	icon: ReactNode
	title: string
	description: string
	details?: ReactNode
	footer?: ReactNode
	children?: ReactNode
}

function StatusCard({
	tone,
	icon,
	title,
	description,
	details,
	footer,
	children
}: StatusCardProps) {
	return (
		<section
			aria-live='polite'
			className='rounded-3xl border border-border bg-popover p-6 text-center shadow-[0_24px_64px_-32px_hsl(var(--foreground)/0.25)] sm:p-8'
		>
			<div className='relative mx-auto flex size-16 items-center justify-center'>
				{tone === 'pending' && (
					<span className='absolute inset-0 animate-ping rounded-full bg-primary/15 motion-reduce:animate-none' />
				)}
				<span
					className={cn(
						'relative flex size-16 items-center justify-center rounded-full [&_svg]:size-7',
						TONES[tone]
					)}
				>
					{icon}
				</span>
			</div>

			<h1 className='mt-6 font-display text-2xl font-medium tracking-tight'>
				{title}
			</h1>
			<p className='mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground'>
				{description}
			</p>

			{details && <div className='mt-6'>{details}</div>}

			{children && (
				<div className='mt-6 flex flex-col gap-2.5'>{children}</div>
			)}

			{footer && <div className='mt-6'>{footer}</div>}
		</section>
	)
}

function PaymentDetails({ payment }: { payment: PaymentResponse }) {
	function copyId() {
		navigator.clipboard
			.writeText(payment.id)
			.then(() => toast.success('Номер платежа скопирован'))
			.catch(() => toast.error('Не удалось скопировать'))
	}

	const rows = [
		{
			label: 'Покупка',
			value:
				payment.product === 'COURSE' && payment.course
					? payment.course.title
					: 'Подписка Premium'
		},
		{ label: 'Сумма', value: formatPrice(payment.amount, payment.currency) }
	]

	return (
		<dl className='divide-y divide-border rounded-2xl bg-secondary/60 text-left text-sm'>
			{rows.map(row => (
				<div
					key={row.label}
					className='flex items-baseline justify-between gap-4 px-4 py-3'
				>
					<dt className='shrink-0 text-muted-foreground'>
						{row.label}
					</dt>
					<dd className='truncate text-right font-medium'>
						{row.value}
					</dd>
				</div>
			))}
			<div className='flex items-center justify-between gap-4 px-4 py-2'>
				<dt className='shrink-0 text-muted-foreground'>
					Номер платежа
				</dt>
				<dd className='flex min-w-0 items-center gap-1'>
					<span className='truncate font-mono text-xs'>
						{payment.id}
					</span>
					<button
						type='button'
						onClick={copyId}
						aria-label='Скопировать номер платежа'
						className='flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground'
					>
						<Copy className='size-3.5' />
					</button>
				</dd>
			</div>
		</dl>
	)
}

function SupportNote({ withPaymentId }: { withPaymentId?: boolean }) {
	return (
		<p className='text-sm leading-relaxed text-muted-foreground'>
			{withPaymentId
				? 'Если деньги списались, а доступ не появился, напишите нам на '
				: 'Остались вопросы? Напишите нам на '}
			<a
				href={`mailto:${env.SUPPORT_EMAIL}`}
				className='font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
			>
				{env.SUPPORT_EMAIL}
			</a>
			{withPaymentId ? ' и укажите номер платежа.' : '.'}
		</p>
	)
}

function StatusSkeleton() {
	return (
		<section className='rounded-3xl border border-border bg-popover p-6 sm:p-8'>
			<Skeleton className='mx-auto size-16 rounded-full' />
			<Skeleton className='mx-auto mt-6 h-7 w-2/3' />
			<Skeleton className='mx-auto mt-3 h-4 w-full' />
			<Skeleton className='mx-auto mt-2 h-4 w-4/5' />
			<Skeleton className='mt-6 h-28 w-full rounded-2xl' />
		</section>
	)
}
