import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { CourseListResponseItem } from '@/generated/model'

import { ROUTES } from '@/lib/routes'
import {
	LESSON,
	formatPrice,
	getDiscountPercent,
	getPayablePrice,
	pluralize
} from '@/lib/utils'

import { Reveal } from '../motion/reveal'
import { Button } from '../ui/button'

interface FeaturedCourseProps {
	course: CourseListResponseItem
	currency: string | undefined
}

export function FeaturedCourse({ course, currency }: FeaturedCourseProps) {
	const href = ROUTES.COURSES.SINGLE(course.slug)
	const payable = getPayablePrice(course.price, course.discountPrice)
	const discount = getDiscountPercent(course.price, course.discountPrice)

	const meta = [
		course.lessons > 0 ? pluralize(course.lessons, LESSON) : null,
		course.upcomingLessons > 0
			? `ещё ${course.upcomingLessons} скоро`
			: null
	].filter(Boolean)

	return (
		<section className='frame-container pt-2 pb-3 sm:pb-5'>
			<Reveal>
				<div className='relative isolate overflow-hidden rounded-[1.75rem] bg-inverse text-inverse-foreground'>
					<Image
						src='/images/art/panel-grain.webp'
						alt=''
						fill
						sizes='100vw'
						className='-z-10 object-cover'
					/>

					<div className='grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14 lg:p-14'>
						<div>
							<span className='inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-3.5 py-1.5 font-mono text-xs tracking-[0.14em] text-highlight uppercase'>
								<span className='size-1.5 rounded-full bg-highlight' />
								Ранний доступ
							</span>

							<h2 className='mt-6 font-serif text-display-lg font-medium tracking-[-0.02em]'>
								{course.title}
							</h2>

							{course.shortDescription && (
								<p className='mt-4 max-w-xl text-base leading-relaxed text-inverse-foreground/70 sm:text-lg'>
									{course.shortDescription}
								</p>
							)}

							{meta.length > 0 && (
								<p className='mt-5 text-sm text-inverse-foreground/55'>
									{meta.join(' · ')}
								</p>
							)}

							<div className='mt-8 flex flex-wrap items-center gap-x-6 gap-y-4'>
								{payable !== null && currency && (
									<span className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
										<span className='font-display text-display-md font-medium tabular-nums'>
											{formatPrice(payable, currency)}
										</span>
										{discount !== null &&
											course.price !== null && (
												<>
													<s className='text-sm text-inverse-foreground/45 tabular-nums decoration-inverse-foreground/40'>
														{formatPrice(
															course.price,
															currency
														)}
													</s>
													<span className='rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success'>
														−{discount}%
													</span>
												</>
											)}
									</span>
								)}

								<Button size='lg' variant='highlight' asChild>
									<Link href={href}>
										Открыть курс
										<ArrowRight />
									</Link>
								</Button>
							</div>
						</div>

						{course.thumbnail && (
							<Link
								href={href}
								aria-hidden='true'
								tabIndex={-1}
								className='group relative aspect-video overflow-hidden rounded-2xl ring-1 ring-inverse-foreground/10'
							>
								<Image
									src={course.thumbnail}
									alt=''
									fill
									sizes='(min-width: 1024px) 440px, 100vw'
									className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]'
								/>
							</Link>
						)}
					</div>
				</div>
			</Reveal>
		</section>
	)
}
