import type { Metadata } from 'next'
import Image from 'next/image'

import { getCoursesQuery } from '@/generated/api'

import { CourseCard } from '@/components/course/course-card'
import { JsonLd } from '@/components/shared/json-ld'

import { ROUTES } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'
import { breadcrumbSchema, itemListSchema } from '@/lib/seo/schema'
import { COURSE, pluralize } from '@/lib/utils'

export const metadata: Metadata = pageMetadata({
	title: 'Курсы по веб-разработке',
	description:
		'Каталог курсов TeaCoder: фронтенд, бэкенд и инструменты разработчика. Видеоуроки, исходный код проектов и прогресс обучения в личном кабинете.',
	path: ROUTES.COURSES.ROOT
})

export default async function CoursesPage() {
	const courses = await getCoursesQuery()

	return (
		<main className='pb-24 sm:pb-32'>
			<JsonLd
				schema={[
					breadcrumbSchema([
						{ name: 'Главная', path: ROUTES.HOME },
						{ name: 'Курсы', path: ROUTES.COURSES.ROOT }
					]),
					itemListSchema(
						courses.map(course => ({
							path: ROUTES.COURSES.SINGLE(course.slug)
						})),
						'Курсы по веб-разработке'
					)
				]}
			/>

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
					<p className='font-mono text-xs tracking-[0.18em] text-highlight uppercase'>
						Каталог · {pluralize(courses.length, COURSE)}
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
