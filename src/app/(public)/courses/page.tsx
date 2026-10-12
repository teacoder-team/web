import type { Metadata } from 'next'

import { getCoursesQuery } from '@/generated/api'

import { CourseCard } from '@/components/course/course-card'

export const metadata: Metadata = {
	title: 'Курсы',
	description:
		'Здесь собраны курсы по веб-разработке, которые помогут вам освоить самые востребованные технологии и инструменты.'
}

export default async function CoursesPage() {
	const courses = await getCoursesQuery()

	return (
		<main className='page-container pb-24 pt-14 sm:pb-32 sm:pt-20'>
			<div className='max-w-3xl'>
				<h1 className='font-serif text-display-xl font-medium tracking-[-0.02em]'>
					Курсы
				</h1>
				<p className='mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground'>
					Здесь собраны курсы по веб-разработке, которые помогут вам
					освоить самые востребованные технологии и инструменты.
				</p>
			</div>
			<div className='mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3'>
				{courses.map(course => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		</main>
	)
}
