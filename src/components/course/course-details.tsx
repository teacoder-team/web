'use client'

import type {
	CourseLessonListResponseItem,
	CourseResponse
} from '@/generated/model'

import { useCourseProgress } from '@/hooks/use-course-progress'

import { Skeleton } from '../ui/skeleton'

import { CourseContent } from './course-content'
import { CourseSidebar } from './course-sidebar'

interface CourseDetailsProps {
	course: CourseResponse
	lessons: CourseLessonListResponseItem[]
}

export function CourseDetails({ course, lessons }: CourseDetailsProps) {
	const { completedLessons, isLoading } = useCourseProgress(course.id)

	if (isLoading) {
		return (
			<div className='mx-auto mt-4 max-w-screen-xl animate-pulse px-5 pb-10 md:px-0'>
				<div className='grid grid-cols-1 gap-8 lg:grid-cols-6'>
					<div className='order-1 col-span-1 space-y-6 lg:col-span-4'>
						<Skeleton className='h-[450px] rounded-xl' />{' '}
						<Skeleton className='h-8 w-3/4 rounded' />{' '}
						<Skeleton className='h-4 w-full rounded' />
						<Skeleton className='h-4 w-5/6 rounded' />
						<Skeleton className='my-5 h-[0.5px] bg-border' />
						<Skeleton className='h-6 w-1/4 rounded' />{' '}
						<Skeleton className='h-4 w-full rounded' />
						<Skeleton className='h-4 w-5/6 rounded' />
					</div>

					<div className='order-2 space-y-4 lg:col-span-2'>
						<Skeleton className='h-40 rounded-xl' />
						<Skeleton className='h-32 rounded-xl' />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='mx-auto mt-4 max-w-screen-xl px-5 pb-10 md:px-0'>
			<div className='grid grid-cols-1 gap-8 lg:grid-cols-6'>
				<CourseContent
					course={course}
					lessons={lessons}
					completedLessons={completedLessons}
				/>
				<CourseSidebar
					course={course}
					lessons={lessons}
					completedLessons={completedLessons}
				/>
			</div>
		</div>
	)
}
