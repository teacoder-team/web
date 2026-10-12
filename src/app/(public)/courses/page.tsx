import type { Metadata } from 'next'
import Image from 'next/image'

import { getCoursesQuery } from '@/generated/api'

import { CourseCard } from '@/components/course/course-card'

import { getCourseLabel } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Курсы',
	description:
		'Здесь собраны курсы по веб-разработке, которые помогут вам освоить самые востребованные технологии и инструменты.'
}

export default async function CoursesPage() {
	const courses = await getCoursesQuery()

	return (
		<main className='pb-24 sm:pb-32'>
			<section className='frame-container pt-2'>
				<div className='relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-inverse px-6 py-10 text-inverse-foreground sm:min-h-[380px] sm:px-12 sm:py-14 lg:px-16'>
					<Image
						src='/images/art/courses-banner.webp'
						alt=''
						fill
						priority
						sizes='100vw'
						className='-z-10 object-cover object-[70%_50%]'
					/>
					<p className='font-mono text-xs uppercase tracking-[0.18em] text-highlight'>
						Каталог · {courses.length}{' '}
						{getCourseLabel(courses.length)}
					</p>
					<h1 className='mt-4 font-display text-display-xl font-medium'>
						Курсы
					</h1>
					<p className='mt-4 max-w-xl text-base leading-relaxed text-inverse-foreground/70 sm:text-lg'>
						Здесь собраны курсы по веб-разработке, которые помогут
						вам освоить самые востребованные технологии и
						инструменты.
					</p>
				</div>
			</section>

			<section className='page-container mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3'>
				{courses.map(course => (
					<CourseCard key={course.id} course={course} />
				))}
			</section>
		</main>
	)
}
