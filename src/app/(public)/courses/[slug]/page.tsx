import type { Metadata } from 'next'

import { getCoursesBySlugLessonsQuery } from '@/generated/api'

import { CourseDetails } from '@/components/course/course-details'

import { getCourse } from '@/lib/courses/get-course'

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params

	const course = await getCourse(slug)
	const images = course.thumbnail
		? [{ url: course.thumbnail, alt: course.title }]
		: undefined

	return {
		title: course.title,
		description: course.shortDescription,
		openGraph: { images },
		twitter: {
			title: course.title,
			description: course.shortDescription ?? '',
			images
		}
	}
}

export default async function CoursePage({
	params
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params

	const [course, lessons] = await Promise.all([
		getCourse(slug),
		getCoursesBySlugLessonsQuery(slug)
	])

	return <CourseDetails course={course} lessons={lessons} />
}
