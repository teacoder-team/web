import type { Metadata } from 'next'

import { getCoursesQuery } from '@/generated/api'

import { CourseCard } from '@/components/course/course-card'
import { FAQSection } from '@/components/premium/faq'
import { Premium } from '@/components/premium/premium'

import { getCourseLabel } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Подписка'
}

export default async function PremiumPage() {
	// The pricing block works without the course list, so a failed fetch only hides the grid
	const courses = await getCoursesQuery().catch(() => [])
	// Subscription covers PREMIUM courses only; PURCHASE ones are bought separately
	const included = courses.filter(course => course.accessMode === 'PREMIUM')

	return (
		<main className='pb-24 sm:pb-32'>
			<section className='page-container pb-14 pt-16 text-center sm:pb-16 sm:pt-24'>
				<p className='inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground'>
					Подписка TeaCoder
				</p>
				<h1 className='mx-auto mt-7 max-w-3xl font-display text-display-xl font-medium'>
					Все курсы по подписке
					<br />
					<span className='text-brand'>в одном плане</span>.
				</h1>
				<p className='mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground'>
					Подписка открывает закрытые уроки и исходный код курсов с
					пометкой «По подписке». Отменить можно в любой момент.
				</p>
			</section>

			<Premium />

			{included.length > 0 && (
				<section className='page-container mt-24 sm:mt-32'>
					<div className='flex flex-wrap items-end justify-between gap-4'>
						<h2 className='font-serif text-display-lg font-medium tracking-[-0.02em]'>
							Курсы в подписке
						</h2>
						<p className='text-muted-foreground'>
							{included.length} {getCourseLabel(included.length)}
						</p>
					</div>
					<div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{included.map(course => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</section>
			)}

			<div className='mt-24 sm:mt-32'>
				<FAQSection />
			</div>
		</main>
	)
}
