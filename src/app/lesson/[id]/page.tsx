import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import {
	getCoursesBySlugLessonsQuery,
	getLessonsByIdQuery
} from '@/generated/api'

import { LessonCompleteButton } from '@/components/lesson/lesson-complete-button'
import { LessonContainer } from '@/components/lesson/lesson-container'
import { LessonPlayer } from '@/components/lesson/lesson-player'
import { LessonSidebar } from '@/components/lesson/lesson-sidebar'

// Rendered without the user's token: progress loads on the client.
const getLesson = cache((id: string) =>
	getLessonsByIdQuery(id).catch(error => {
		console.error('[LessonPage] getLesson failed', { id, error })

		return null
	})
)

export async function generateMetadata({
	params
}: {
	params: Promise<{ id: string }>
}): Promise<Metadata> {
	const { id } = await params

	const lesson = await getLesson(id)

	if (!lesson) {
		return {
			title: 'Урок не найден'
		}
	}

	return {
		title: lesson.title,
		description: lesson.description ?? '',
		referrer: 'no-referrer',
		robots: {
			index: false,
			follow: false
		}
	}
}

export default async function LessonPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	const lesson = await getLesson(id)

	if (!lesson) notFound()

	const lessons = await getCoursesBySlugLessonsQuery(lesson.course.slug)

	return (
		<div className='h-full'>
			<LessonSidebar course={lesson.course} lessons={lessons} />
			<LessonContainer>
				<h1 className='mb-4 text-3xl font-bold'>{lesson.title}</h1>

				{lesson.description && (
					<p className='mb-8 text-neutral-600 dark:text-neutral-300'>
						{lesson.description}
					</p>
				)}

				<div className='space-y-8'>
					<LessonPlayer videoId={lesson.kinescopeId ?? ''} />

					<div className='flex justify-end'>
						<LessonCompleteButton lesson={lesson} />
					</div>
				</div>
			</LessonContainer>
		</div>
	)
}
