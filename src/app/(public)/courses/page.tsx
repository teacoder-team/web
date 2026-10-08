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
		<main className='mx-auto my-20 max-w-7xl'>
			<div className='mx-auto w-full text-center'>
				<h1 className='text-center text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl'>
					Курсы
				</h1>
				<p className='mx-auto mt-6 max-w-2xl text-center text-base text-neutral-600 dark:text-neutral-300 md:text-lg'>
					Здесь собраны курсы по веб-разработке, которые помогут вам
					освоить самые востребованные технологии и инструменты.
				</p>
			</div>
			<div className='my-20 grid gap-8 px-5 sm:grid-cols-2 md:grid-cols-2 md:px-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
				{courses.map(course => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		</main>
	)
}
