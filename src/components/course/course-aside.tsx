'use client'

import {
	ArrowRight,
	BookOpen,
	Code2,
	DownloadCloud,
	Eye,
	Layers,
	LockOpen
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { FaYoutube } from 'react-icons/fa6'
import { toast } from 'sonner'

import { usePostCoursesBySlugMaterialsLinkMutation } from '@/generated/api'
import type { CourseResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { useAppConfig } from '@/lib/config/useAppConfig'
import type { ProgramLesson } from '@/lib/courses/program'
import { ROUTES } from '@/lib/routes'
import { LESSON, formatPrice, pluralize } from '@/lib/utils'

import { PaymentDialog } from '../billing/payment-dialog'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Skeleton } from '../ui/skeleton'

interface CourseAsideProps {
	course: CourseResponse
	lessonCount: number
	sectionCount: number
	completedCount: number
	percentage: number
	nextLesson: ProgramLesson | null
	hasAccess: boolean
	isLoading: boolean
}

export function CourseAside({
	course,
	lessonCount,
	sectionCount,
	completedCount,
	percentage,
	nextLesson,
	hasAccess,
	isLoading
}: CourseAsideProps) {
	const router = useRouter()
	const { isAuthorized, isLoading: isSessionLoading } = useSession()
	const { data: config } = useAppConfig()

	const [isPaymentOpen, setIsPaymentOpen] = useState(false)

	const currency = config?.features.premium.currency
	const price =
		course.price !== null && currency
			? formatPrice(course.price, currency)
			: null

	const courseUrl = ROUTES.COURSES.SINGLE(course.slug)
	const isStarted = completedCount > 0
	const isFinished = lessonCount > 0 && completedCount >= lessonCount

	const materials = usePostCoursesBySlugMaterialsLinkMutation({
		mutation: {
			onSuccess: ({ url }) => window.location.assign(url),
			onError: error =>
				toast.error(
					getErrorMessage(error, 'Не удалось сгенерировать ссылку')
				)
		}
	})

	function requireAuth(action: () => void) {
		if (!isAuthorized) {
			router.push(ROUTES.AUTH.LOGIN(courseUrl))
			return
		}
		action()
	}

	function lessonHref(id: string) {
		const href = ROUTES.COURSES.LESSON(id)
		return isAuthorized ? href : ROUTES.AUTH.LOGIN(href)
	}

	function renderActions() {
		if (isLoading) {
			return <Skeleton className='h-12 w-full rounded-full' />
		}

		if (lessonCount === 0) {
			// The YouTube button below becomes the main action then
			return course.youtubeUrl ? null : (
				<Button size='lg' className='w-full' disabled>
					Уроки скоро появятся
				</Button>
			)
		}

		if (hasAccess && nextLesson) {
			return (
				<Button size='lg' className='w-full' asChild>
					<Link href={lessonHref(nextLesson.id)}>
						{isFinished
							? 'Смотреть снова'
							: isStarted
								? 'Продолжить'
								: 'Начать просмотр'}
						<ArrowRight />
					</Link>
				</Button>
			)
		}

		const buyButton = price && (
			<Button
				size='lg'
				variant={
					course.accessMode === 'PURCHASE' ? 'default' : 'outline'
				}
				className='w-full'
				onClick={() => requireAuth(() => setIsPaymentOpen(true))}
			>
				Купить курс за {price}
			</Button>
		)

		if (course.accessMode === 'PREMIUM') {
			return (
				<div className='flex flex-col gap-2.5'>
					<Button size='lg' className='w-full' asChild>
						<Link href={ROUTES.PREMIUM}>
							Оформить подписку
							<ArrowRight />
						</Link>
					</Button>
					{buyButton}
				</div>
			)
		}

		return buyButton
	}

	return (
		<>
			<div className='overflow-hidden rounded-3xl border border-border bg-card'>
				<div className='p-2'>
					<div className='relative aspect-video overflow-hidden rounded-2xl bg-muted'>
						{course.thumbnail && (
							<Image
								src={course.thumbnail}
								alt={course.title}
								fill
								priority
								sizes='(min-width: 1024px) 380px, 100vw'
								className='object-cover'
							/>
						)}
					</div>
				</div>

				<div className='px-5 pb-5 pt-3'>
					<AccessSummary
						course={course}
						price={price}
						hasAccess={hasAccess && !isLoading}
					/>

					{isAuthorized && isStarted && lessonCount > 0 && (
						<div className='mt-5'>
							<div className='flex items-baseline justify-between text-sm'>
								<span className='text-muted-foreground'>
									Пройдено {completedCount} из {lessonCount}
								</span>
								<span className='font-mono tabular-nums text-foreground'>
									{Math.round(percentage)}%
								</span>
							</div>
							<Progress value={percentage} className='mt-2' />
						</div>
					)}

					<div className='mt-5 flex flex-col gap-2.5'>
						{renderActions()}
						{course.youtubeUrl && (
							<Button
								size='lg'
								variant={
									lessonCount === 0 ? 'default' : 'outline'
								}
								className='w-full'
								asChild
							>
								<Link href={course.youtubeUrl} target='_blank'>
									<FaYoutube />
									Смотреть на YouTube
								</Link>
							</Button>
						)}
						{course.hasMaterials && (
							<Button
								size='lg'
								variant='outline'
								className='w-full'
								isLoading={materials.isPending}
								disabled={
									isSessionLoading || materials.isPending
								}
								onClick={() =>
									requireAuth(() =>
										materials.mutate({ slug: course.slug })
									)
								}
							>
								{!materials.isPending && <DownloadCloud />}
								Скачать исходный код
							</Button>
						)}
					</div>
				</div>

				<dl className='divide-y divide-border border-t border-border text-sm'>
					<MetaRow icon={<BookOpen />} label='Уроки'>
						{lessonCount > 0
							? pluralize(lessonCount, LESSON)
							: 'Только на YouTube'}
					</MetaRow>
					{sectionCount > 0 && (
						<MetaRow icon={<Layers />} label='Разделы'>
							{sectionCount}
						</MetaRow>
					)}
					<MetaRow icon={<Eye />} label='Просмотры'>
						{new Intl.NumberFormat('ru-RU').format(course.views)}
					</MetaRow>
					<MetaRow icon={<Code2 />} label='Исходный код'>
						{course.hasMaterials ? 'Есть' : 'Нет'}
					</MetaRow>
				</dl>
			</div>

			<PaymentDialog
				open={isPaymentOpen}
				onOpenChange={setIsPaymentOpen}
				courseId={course.id}
				summary={() => (price ? `${course.title} - ${price}` : null)}
			/>
		</>
	)
}

function AccessSummary({
	course,
	price,
	hasAccess
}: {
	course: CourseResponse
	price: string | null
	hasAccess: boolean
}) {
	if (course.accessMode === 'FREE') {
		return (
			<p className='font-display text-3xl font-medium tracking-tight text-success'>
				Бесплатно
			</p>
		)
	}

	if (hasAccess) {
		return (
			<p className='flex items-center gap-2.5 font-display text-2xl font-medium tracking-tight'>
				<span className='flex size-8 items-center justify-center rounded-full bg-success-soft text-success'>
					<LockOpen className='size-4' />
				</span>
				Курс доступен
			</p>
		)
	}

	if (course.accessMode === 'PREMIUM') {
		return (
			<div>
				<p className='font-display text-3xl font-medium tracking-tight text-brand'>
					По подписке
				</p>
				{price && (
					<p className='mt-1 text-sm text-muted-foreground'>
						или навсегда за {price}
					</p>
				)}
			</div>
		)
	}

	return (
		<p className='font-display text-3xl font-medium tabular-nums tracking-tight'>
			{price ?? 'Покупка'}
		</p>
	)
}

function MetaRow({
	icon,
	label,
	children
}: {
	icon: ReactNode
	label: string
	children: ReactNode
}) {
	return (
		<div className='flex items-center justify-between gap-4 px-5 py-3.5'>
			<dt className='flex items-center gap-2.5 text-muted-foreground [&_svg]:size-4'>
				{icon}
				{label}
			</dt>
			<dd className='text-right font-medium'>{children}</dd>
		</div>
	)
}
