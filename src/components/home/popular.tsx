import type { CourseListResponseItem } from '@/generated/model'

import { CourseCard } from '../course/course-card'

interface PopularProps {
	courses: CourseListResponseItem[]
}

export function Popular({ courses }: PopularProps) {
	return (
		<div className='mx-auto max-w-7xl py-10 antialiased md:py-20'>
			<h2 className='mb-4 text-center text-3xl font-semibold text-foreground md:mb-6 md:text-4xl lg:text-5xl'>
				Популярные курсы
			</h2>
			<p className='mx-auto mb-6 max-w-2xl text-center text-base text-muted-foreground md:mb-8 md:text-lg'>
				Cамые популярные курсы среди пользователей платформы
			</p>
			<div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 px-5 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 md:px-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4'>
				{courses.map(course => (
					<CourseCard key={course.id} course={course} />
				))}
			</div>
		</div>
	)
}
