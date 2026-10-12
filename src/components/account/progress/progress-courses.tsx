'use client'

import { ArrowRight, BookOpen, Check } from 'lucide-react'
import Link from 'next/link'

import { useGetUsersMeProgressQuery } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { formatFullDate, getLessonLabel } from '@/lib/utils'

import { Button } from '../../ui/button'
import { Progress } from '../../ui/progress'
import { Skeleton } from '../../ui/skeleton'
import { SettingsSection } from '../account-ui'

export function ProgressCourses() {
	const { data, isLoading } = useGetUsersMeProgressQuery()

	if (isLoading) {
		return (
			<SettingsSection title='Мои курсы'>
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className='flex items-center gap-6 p-5 sm:p-6'
					>
						<div className='flex-1 space-y-3'>
							<Skeleton className='h-4 w-2/3' />
							<Skeleton className='h-1.5 w-full' />
							<Skeleton className='h-3 w-1/3' />
						</div>
					</div>
				))}
			</SettingsSection>
		)
	}

	if (!data?.length) {
		return (
			<SettingsSection title='Мои курсы'>
				<div className='flex flex-col items-center px-6 py-14 text-center'>
					<span className='flex size-12 items-center justify-center rounded-2xl bg-secondary'>
						<BookOpen className='size-5' />
					</span>
					<p className='mt-4 font-medium'>
						Вы ещё не начали ни одного курса
					</p>
					<p className='mt-1 max-w-xs text-sm text-muted-foreground'>
						Выберите курс в каталоге - прогресс появится здесь после
						первого урока.
					</p>
					<Button className='mt-6' asChild>
						<Link href={ROUTES.COURSES.ROOT}>Перейти к курсам</Link>
					</Button>
				</div>
			</SettingsSection>
		)
	}

	return (
		<SettingsSection title='Мои курсы'>
			{data.map(course => {
				const isDone = course.progress >= 100

				return (
					<article
						key={course.id}
						className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6'
					>
						<div className='min-w-0 flex-1'>
							<Link
								href={ROUTES.COURSES.SINGLE(course.slug)}
								className='line-clamp-2 font-medium leading-snug transition-colors hover:text-brand'
							>
								{course.title}
							</Link>
							<div className='mt-3 flex items-center gap-3'>
								<Progress
									value={course.progress}
									className='flex-1'
								/>
								<span className='shrink-0 font-mono text-xs tabular-nums text-muted-foreground'>
									{course.progress}%
								</span>
							</div>
							<p className='mt-2 text-sm text-muted-foreground'>
								{course.completedLessons} из{' '}
								{course.totalLessons}{' '}
								{getLessonLabel(course.totalLessons)}
								{course.lastActivityAt &&
									` · ${formatFullDate(course.lastActivityAt)}`}
							</p>
						</div>

						<div className='shrink-0'>
							{isDone ? (
								<span className='inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-sm font-medium text-success'>
									<Check className='size-4' />
									Пройден
								</span>
							) : (
								course.nextLesson && (
									<Button
										variant='outline'
										className='w-full sm:w-auto'
										asChild
									>
										<Link
											href={ROUTES.COURSES.LESSON(
												course.nextLesson.id
											)}
										>
											Продолжить
											<ArrowRight />
										</Link>
									</Button>
								)
							)}
						</div>
					</article>
				)
			})}
		</SettingsSection>
	)
}
