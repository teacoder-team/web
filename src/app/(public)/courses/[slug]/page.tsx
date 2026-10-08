import type { Metadata } from 'next'

import { getCoursesBySlugLessonsQuery } from '@/generated/api'

import { CourseDetails } from '@/components/course/course-details'

import { getAppConfig } from '@/lib/config/app-config'
import { getCourse } from '@/lib/courses/get-course'
import { getMediaSource } from '@/lib/utils'

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params

	const [course, config] = await Promise.all([
		getCourse(slug),
		getAppConfig()
	])

	const thumbnail = getMediaSource(
		course.thumbnail,
		'courses',
		config?.features.orion.url
	)

	return {
		title: course.title,
		description: course.shortDescription,
		openGraph: {
			images: [
				{
					url: thumbnail,
					alt: course.title
				}
			]
		},
		twitter: {
			title: course.title,
			description: course.shortDescription ?? '',
			images: [
				{
					url: thumbnail,
					alt: course.title
				}
			]
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
