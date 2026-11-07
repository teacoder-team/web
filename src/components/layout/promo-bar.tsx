'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { CourseListResponseItem } from '@/generated/model'

import { ROUTES } from '@/lib/routes'
import { formatPrice, getDiscountPercent, getPayablePrice } from '@/lib/utils'

interface PromoBarProps {
	course: CourseListResponseItem | null
	currency: string | undefined
}

/** Strip above the header; the home page shows the full banner instead. */
export function PromoBar({ course, currency }: PromoBarProps) {
	const pathname = usePathname()

	if (!course || pathname === ROUTES.HOME) return null

	const href = ROUTES.COURSES.SINGLE(course.slug)
	const payable = getPayablePrice(course.price, course.discountPrice)
	const discount = getDiscountPercent(course.price, course.discountPrice)

	return (
		<Link
			href={href}
			className='group block bg-primary text-primary-foreground'
		>
			<div className='frame-container flex h-11 items-center justify-center gap-2.5 px-4 text-[13px] sm:gap-3 sm:text-sm'>
				<span className='shrink-0 rounded-full bg-primary-foreground/20 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase'>
					Новое
				</span>

				<span className='truncate'>
					<span className='font-medium'>{course.title}</span>
					<span className='text-primary-foreground/75'>
						{' '}
						- уже в раннем доступе
					</span>
				</span>

				{payable !== null && currency && (
					<span className='hidden shrink-0 items-center gap-2 sm:flex'>
						<span className='font-medium tabular-nums'>
							{formatPrice(payable, currency)}
						</span>
						{discount !== null && (
							<span className='rounded-full bg-primary-foreground px-1.5 py-0.5 text-[11px] font-semibold text-primary'>
								−{discount}%
							</span>
						)}
					</span>
				)}

				<ArrowRight className='size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5' />
			</div>
		</Link>
	)
}
