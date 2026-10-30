import type { Metadata } from 'next'

import { getCoursesBySlugLessonsQuery } from '@/generated/api'

import { CourseDetails } from '@/components/course/course-details'
import { JsonLd } from '@/components/shared/json-ld'

import { getAppConfig } from '@/lib/config/app-config'
import { getCourse } from '@/lib/courses/get-course'
import { ROUTES } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'
import { breadcrumbSchema, courseSchema } from '@/lib/seo/schema'

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params

	const course = await getCourse(slug)

	return pageMetadata({
		title: course.title,
		description:
			course.shortDescription ??
			`Курс «${course.title}» на TeaCoder: видеоуроки, исходный код проекта и прогресс обучения.`,
		path: ROUTES.COURSES.SINGLE(course.slug),
		...(course.thumbnail && {
			image: { url: course.thumbnail, alt: course.title }
		})
	})
}

export default async function CoursePage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	const [course, lessons, config] = await Promise.all([
		getCourse(slug),
		getCoursesBySlugLessonsQuery(slug),
		getAppConfig()
	])

	const path = ROUTES.COURSES.SINGLE(course.slug)

	return (
		<>
			<JsonLd
				schema={[
					courseSchema({
						course,
						path,
						program: lessons,
						currency: config?.features.premium.currency
					}),
					breadcrumbSchema([
						{ name: 'Главная', path: ROUTES.HOME },
						{ name: 'Курсы', path: ROUTES.COURSES.ROOT },
						{ name: course.title, path }
					])
				]}
			/>

			<CourseDetails course={course} lessons={lessons} />
		</>
	)
}
