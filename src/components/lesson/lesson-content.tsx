'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import {
	useGetCoursesBySlugLessonsQuery,
	useGetLessonsByIdQuery
} from '@/generated/api'

import { EllipsisLoader } from '@/components/shared/ellipsis-loader'
import { Button } from '@/components/ui/button'

import { ROUTES } from '@/constants/routes'

import { getApiError, getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { flattenCourseProgram } from '@/lib/course-program'

import { LessonCompleteButton } from './lesson-complete-button'
import { LessonContainer } from './lesson-container'
import { LessonPlayer } from './lesson-player'
import { LessonSidebar } from './lesson-sidebar'

export function LessonContent({ id }: { id: string }) {
	const { status } = useSession()
	const lessonQuery = useGetLessonsByIdQuery(id, {
		query: { enabled: status === 'authenticated', retry: false }
	})
	const lesson = lessonQuery.data
	const programQuery = useGetCoursesBySlugLessonsQuery(
		lesson?.course.slug ?? '',
		{
			query: {
				enabled:
					status === 'authenticated' && Boolean(lesson?.course.slug),
				retry: false
			}
		}
	)

	useEffect(() => {
		if (lesson) {
			document.title = lesson.title + ' | TeaCoder'
		}
	}, [lesson])

	if (
		status === 'loading' ||
		(status === 'authenticated' && lessonQuery.isPending)
	) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<EllipsisLoader />
			</div>
		)
	}

	if (status === 'guest') {
		return (
			<div className='mx-auto grid max-w-lg gap-4 p-8 text-center'>
				<h1 className='text-2xl font-semibold'>Войдите в аккаунт</h1>
				<p className='text-muted-foreground'>
					Войдите, чтобы открыть урок с вашей подпиской или покупкой.
				</p>
				<Button asChild variant='primary'>
					<Link href={ROUTES.AUTH.LOGIN(ROUTES.COURSES.LESSON(id))}>
						Войти
					</Link>
				</Button>
			</div>
		)
	}

	if (lessonQuery.isError || !lesson) {
		const statusCode = getApiError(lessonQuery.error)?.status

		return (
			<div className='mx-auto grid max-w-lg gap-4 p-8 text-center'>
				<h1 className='text-2xl font-semibold'>
					{statusCode === 404
						? 'Урок не найден'
						: statusCode === 403
							? 'Урок пока недоступен'
							: 'Не удалось загрузить урок'}
				</h1>
				<p className='text-muted-foreground'>
					{getErrorMessage(
						lessonQuery.error,
						'Попробуйте открыть урок ещё раз.'
					)}
				</p>
				<Button
					variant='primary'
					isLoading={lessonQuery.isFetching}
					onClick={() => lessonQuery.refetch()}
				>
					Попробовать ещё раз
				</Button>
				<Button asChild variant='outline'>
					<Link href={ROUTES.COURSES.ROOT}>К курсам</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className='h-full'>
			<LessonSidebar
				course={lesson.course}
				lessons={flattenCourseProgram(programQuery.data ?? [])}
			/>
			<LessonContainer>
				<h1 className='mb-4 text-3xl font-bold'>{lesson.title}</h1>
				{lesson.description && (
					<p className='mb-8 text-neutral-600 dark:text-neutral-300'>
						{lesson.description}
					</p>
				)}
				{programQuery.isError && (
					<div
						role='alert'
						className='mb-4 flex items-center gap-3 text-sm'
					>
						<span>Не удалось загрузить программу курса.</span>
						<Button
							variant='outline'
							isLoading={programQuery.isFetching}
							onClick={() => programQuery.refetch()}
						>
							Повторить
						</Button>
					</div>
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
