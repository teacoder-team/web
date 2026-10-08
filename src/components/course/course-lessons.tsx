'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

import type { CourseLessonListResponseItem } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { useSession } from '@/lib/auth/auth-provider'
import { lessonsTranslator } from '@/lib/utils'

interface CourseLessonsProps {
	lessons: CourseLessonListResponseItem[]
	completedLessons: string[]
}

export function CourseLessons({
	lessons = [],
	completedLessons = []
}: CourseLessonsProps) {
	const { isAuthorized } = useSession()

	const totalLessons = lessons?.length ?? 0
	const completedCount = completedLessons?.length ?? 0

	return (
		<div className='flex flex-col'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-semibold'>Уроки</h1>
				{isAuthorized && (
					<p className='text-sm text-neutral-600 dark:text-neutral-300'>
						{totalLessons} {lessonsTranslator(totalLessons)} •{' '}
						{completedCount} выполнено
					</p>
				)}
			</div>
			<ul className='mt-5 divide-y rounded-xl border'>
				{lessons.map(lesson => {
					const isCompleted = completedLessons.includes(lesson.id)

					return (
						<li key={lesson.id} className='group'>
							<Link
								href={
									isAuthorized
										? ROUTES.COURSES.LESSON(lesson.id)
										: ROUTES.AUTH.LOGIN(
												ROUTES.COURSES.LESSON(lesson.id)
											)
								}
								className='flex items-center justify-between p-4 transition-colors hover:bg-muted/50'
							>
								<div className='flex items-start gap-3'>
									<div className='mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border'>
										{isCompleted ? (
											<CheckCircle className='size-5 text-emerald-500' />
										) : (
											<span className='text-xs'>
												{lesson.position}
											</span>
										)}
									</div>

									<div>
										<h3 className='font-medium'>
											{lesson.title}
										</h3>
										{lesson.description && (
											<p
												className='mt-1 overflow-hidden text-sm text-neutral-600 dark:text-neutral-300'
												style={{
													display: '-webkit-box',
													WebkitBoxOrient: 'vertical',
													WebkitLineClamp: 2
												}}
											>
												{lesson.description}
											</p>
										)}
									</div>
								</div>
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
