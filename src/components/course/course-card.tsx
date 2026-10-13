import Image from 'next/image'
import Link from 'next/link'

import type { CourseListResponseItem } from '@/generated/model'

import { getAppConfig } from '@/lib/config/app-config'
import { ROUTES } from '@/lib/routes'
import { LESSON, pluralize } from '@/lib/utils'

import { CoursePrice } from './course-price'

interface CourseCardProps {
	course: CourseListResponseItem
}

export async function CourseCard({ course }: CourseCardProps) {
	const config = await getAppConfig()
	const currency = config?.features.premium.currency

	const meta = [
		course.lessons > 0 ? pluralize(course.lessons, LESSON) : 'YouTube',
		course.hasMaterials ? 'Исходный код' : null
	].filter(Boolean)

	return (
		<Link
			href={ROUTES.COURSES.SINGLE(course.slug)}
			className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 hover:border-foreground/20'
		>
			<div className='relative aspect-video overflow-hidden border-b border-border bg-muted'>
				{course.thumbnail && (
					<Image
						src={course.thumbnail}
						alt={course.title}
						fill
						sizes='(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw'
						className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
					/>
				)}
			</div>

			<div className='flex flex-1 flex-col p-5 sm:p-6'>
				<h3
					title={course.title}
					className='truncate font-serif text-[1.625rem] leading-[1.2] font-medium tracking-[-0.01em]'
				>
					{course.title}
				</h3>
				{course.shortDescription && (
					<p className='mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground'>
						{course.shortDescription}
					</p>
				)}

				<div className='mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-5 text-sm'>
					<span className='text-muted-foreground'>
						{meta.join(' · ')}
					</span>
					<AccessLabel
						accessMode={course.accessMode}
						price={course.price}
						discountPrice={course.discountPrice}
						currency={currency}
					/>
				</div>
			</div>
		</Link>
	)
}

interface AccessLabelProps {
	accessMode: CourseListResponseItem['accessMode']
	price: number | null
	discountPrice: number | null
	currency: string | undefined
}

function AccessLabel({
	accessMode,
	price,
	discountPrice,
	currency
}: AccessLabelProps) {
	const priceLabel = (
		<CoursePrice
			price={price}
			discountPrice={discountPrice}
			currency={currency}
			className='justify-end'
		/>
	)
	const hasPrice = price !== null && Boolean(currency)

	if (accessMode === 'FREE') {
		return <span className='font-medium text-success'>Бесплатно</span>
	}

	if (accessMode === 'PREMIUM') {
		return (
			<span className='font-medium text-brand'>
				По подписке
				{hasPrice && (
					<span className='font-normal text-muted-foreground'>
						{' '}
						или {priceLabel}
					</span>
				)}
			</span>
		)
	}

	return (
		<span className='font-medium text-foreground'>
			{hasPrice ? priceLabel : 'Покупка'}
		</span>
	)
}
