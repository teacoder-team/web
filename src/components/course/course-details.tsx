'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FaYoutube } from 'react-icons/fa6'

import type {
	CourseLessonListResponseItem,
	CourseResponse
} from '@/generated/model'

import { useCourseAccess } from '@/hooks/useCourseAccess'
import { useCourseProgress } from '@/hooks/useCourseProgress'

import { flattenCourseProgram } from '@/lib/courses/program'
import { ROUTES } from '@/lib/routes'
import { LESSON, SECTION, cn, pluralize } from '@/lib/utils'

import { Button } from '../ui/button'

import { CourseAside } from './course-aside'
import { CourseProgram } from './course-program'

const DESCRIPTION_PREVIEW_LENGTH = 520

interface CourseDetailsProps {
	course: CourseResponse
	lessons: CourseLessonListResponseItem[]
}

export function CourseDetails({ course, lessons }: CourseDetailsProps) {
	const progress = useCourseProgress(course.id)
	const access = useCourseAccess(course)

	const flatLessons = flattenCourseProgram(lessons)
	const sectionCount = lessons.filter(item => 'lessons' in item).length
	const lessonIds = new Set(flatLessons.map(lesson => lesson.id))
	const completed = progress.completedLessons.filter(id => lessonIds.has(id))

	const nextLesson =
		flatLessons.find(lesson => !completed.includes(lesson.id)) ??
		flatLessons[0] ??
		null

	return (
		<main className='page-container pt-6 pb-24 sm:pt-10 sm:pb-32'>
			<nav
				aria-label='Навигация'
				className='flex items-center gap-1.5 text-sm text-muted-foreground'
			>
				<Link
					href={ROUTES.COURSES.ROOT}
					className='rounded-sm transition-colors hover:text-foreground'
				>
					Курсы
				</Link>
				<ChevronRight className='size-3.5 shrink-0' />
				<span className='truncate text-foreground'>{course.title}</span>
			</nav>

			<div className='mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-12'>
				<aside className='lg:sticky lg:top-24 lg:self-start'>
					<CourseAside
						course={course}
						lessonCount={flatLessons.length}
						sectionCount={sectionCount}
						completedCount={completed.length}
						percentage={
							flatLessons.length > 0
								? (completed.length / flatLessons.length) * 100
								: 0
						}
						nextLesson={nextLesson}
						hasAccess={access.hasAccess}
						isLoading={access.isLoading || progress.isLoading}
					/>
				</aside>

				<div className='min-w-0'>
					<h1 className='font-serif text-display-xl font-medium tracking-[-0.02em]'>
						{course.title}
					</h1>
					{course.shortDescription && (
						<p className='mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
							{course.shortDescription}
						</p>
					)}

					{course.fullDescription && (
						<section className='mt-12'>
							<h2 className='font-display text-display-md font-medium'>
								О курсе
							</h2>
							<Description text={course.fullDescription} />
						</section>
					)}

					<section className='mt-12'>
						<div className='flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
							<h2 className='font-display text-display-md font-medium'>
								Программа курса
							</h2>
							{flatLessons.length > 0 && (
								<p className='text-sm text-muted-foreground'>
									{pluralize(flatLessons.length, LESSON)}
									{sectionCount > 0 &&
										` · ${pluralize(sectionCount, SECTION)}`}
								</p>
							)}
						</div>

						<div className='mt-6'>
							{lessons.length > 0 ? (
								<CourseProgram
									program={lessons}
									completedLessons={completed}
									nextLessonId={nextLesson?.id ?? null}
									isLocked={
										!access.isLoading && !access.hasAccess
									}
								/>
							) : (
								<div className='flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between'>
									<div>
										<p className='font-medium'>
											Курс доступен на YouTube
										</p>
										<p className='mt-1 text-sm text-muted-foreground'>
											Уроков на платформе пока нет -
											полная версия опубликована на
											канале.
										</p>
									</div>
									{course.youtubeUrl && (
										<Button variant='outline' asChild>
											<Link
												href={course.youtubeUrl}
												target='_blank'
											>
												<FaYoutube />
												Открыть
											</Link>
										</Button>
									)}
								</div>
							)}
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}

function Description({ text }: { text: string }) {
	const [isExpanded, setIsExpanded] = useState(false)
	const isLong = text.length > DESCRIPTION_PREVIEW_LENGTH

	return (
		<div className='mt-5'>
			<div
				className={cn(
					'relative text-[17px] leading-relaxed whitespace-pre-line text-foreground/85',
					isLong &&
						!isExpanded &&
						'max-h-56 overflow-hidden mask-[linear-gradient(to_bottom,black_55%,transparent)]'
				)}
			>
				{text}
			</div>
			{isLong && (
				<button
					type='button'
					onClick={() => setIsExpanded(value => !value)}
					aria-expanded={isExpanded}
					className='mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand underline-offset-4 hover:underline'
				>
					{isExpanded ? 'Свернуть' : 'Показать полностью'}
					<ChevronDown
						className={cn(
							'size-4 transition-transform',
							isExpanded && 'rotate-180'
						)}
					/>
				</button>
			)}
		</div>
	)
}
