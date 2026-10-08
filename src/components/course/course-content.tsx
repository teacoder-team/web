'use client'

import Image from 'next/image'

import type {
	CourseLessonListResponseItem,
	CourseResponse
} from '@/generated/model'

import { useMediaSource } from '@/hooks/use-media-source'

import { CourseLessons } from './course-lessons'

interface CourseContentProps {
	course: CourseResponse
	lessons: CourseLessonListResponseItem[]
	completedLessons: string[]
}

export function CourseContent({
	course,
	lessons,
	completedLessons
}: CourseContentProps) {
	const getMediaSource = useMediaSource()

	return (
		<div className='order-1 col-span-1 flex flex-col space-y-6 lg:col-span-4'>
			<div className='relative aspect-video overflow-hidden rounded-xl border bg-white'>
				<Image
					src={getMediaSource(course.thumbnail, 'courses')}
					alt={course.title}
					fill
				/>
			</div>
			<div className='flex flex-col'>
				<h1 className='text-3xl font-semibold'>{course.title}</h1>
				<p className='mt-3 text-[17px] text-neutral-600 dark:text-neutral-300'>
					{course.shortDescription}
				</p>
			</div>
			<div className='my-5 h-[0.5px] bg-border' />
			<div className='flex flex-col'>
				<h1 className='text-3xl font-semibold'>О курсе</h1>
				<p className='mt-3 text-[17px] text-neutral-600 dark:text-neutral-300'>
					{course.fullDescription}
				</p>
			</div>
			{lessons.length > 0 && (
				<>
					<div className='my-5 h-[0.5px] bg-border' />
					<CourseLessons
						lessons={lessons}
						completedLessons={completedLessons}
					/>
				</>
			)}
		</div>
	)
}
