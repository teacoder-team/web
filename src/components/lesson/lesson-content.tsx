'use client'

import { ChevronRight, ListVideo } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useEffect, useState } from 'react'

import {
	useGetCoursesBySlugLessonsQuery,
	useGetLessonsByIdQuery
} from '@/generated/api'

import { EllipsisLoader } from '@/components/shared/ellipsis-loader'
import { Button } from '@/components/ui/button'

import { getApiError, getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'
import { flattenCourseProgram } from '@/lib/courses/program'
import { ROUTES } from '@/lib/routes'

import { Logo } from '../shared/logo'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '../ui/sheet'

import { LessonNavigation } from './lesson-navigation'
import { LessonPlayer } from './lesson-player'
import { LessonSidebar } from './lesson-sidebar'

export function LessonContent({ id }: { id: string }) {
	const { status } = useSession()
	const [isProgramOpen, setIsProgramOpen] = useState(false)

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
			<div className='flex min-h-svh items-center justify-center bg-background'>
				<EllipsisLoader />
			</div>
		)
	}

	if (status === 'guest') {
		return (
			<LessonMessage
				title='Войдите в аккаунт'
				description='Войдите, чтобы открыть урок с вашей подпиской или покупкой.'
			>
				<Button asChild size='lg'>
					<Link href={ROUTES.AUTH.LOGIN(ROUTES.COURSES.LESSON(id))}>
						Войти
					</Link>
				</Button>
			</LessonMessage>
		)
	}

	if (lessonQuery.isError || !lesson) {
		const statusCode = getApiError(lessonQuery.error)?.status

		return (
			<LessonMessage
				title={
					statusCode === 404
						? 'Урок не найден'
						: statusCode === 403
							? 'Урок пока недоступен'
							: 'Не удалось загрузить урок'
				}
				description={getErrorMessage(
					lessonQuery.error,
					'Попробуйте открыть урок ещё раз.'
				)}
			>
				<Button
					size='lg'
					isLoading={lessonQuery.isFetching}
					onClick={() => lessonQuery.refetch()}
				>
					Попробовать ещё раз
				</Button>
				<Button asChild size='lg' variant='outline'>
					<Link href={ROUTES.COURSES.ROOT}>К курсам</Link>
				</Button>
			</LessonMessage>
		)
	}

	const program = programQuery.data ?? []
	const lessons = flattenCourseProgram(program)
	const index = lessons.findIndex(item => item.id === lesson.id)
	const section = program.find(
		item =>
			'lessons' in item &&
			item.lessons.some(item => item.id === lesson.id)
	)

	const prevLessonId = index > 0 ? lessons[index - 1]!.id : null
	const nextLessonId =
		index >= 0 && index < lessons.length - 1 ? lessons[index + 1]!.id : null

	// The program is fetched with the user's token, so each lesson carries its own status
	const completedLessons = lessons
		.filter(item => item.isCompleted)
		.map(item => item.id)
	const completedCount = completedLessons.length
	const percentage = lessons.length
		? Math.round((completedCount / lessons.length) * 100)
		: 0

	const sidebarProps = {
		course: lesson.course,
		program,
		isProgramLoading: programQuery.isPending,
		activeLessonId: lesson.id,
		completedLessons
	}

	return (
		<div className='min-h-svh bg-background'>
			<header className='sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md'>
				<div className='flex h-14 items-center gap-3 px-3 sm:px-5'>
					<Sheet open={isProgramOpen} onOpenChange={setIsProgramOpen}>
						<SheetTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='lg:hidden'
								aria-label='Программа курса'
							>
								<ListVideo className='!size-5' />
							</Button>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='w-[88%] p-0 sm:max-w-sm'
						>
							<SheetTitle className='sr-only'>
								Программа курса
							</SheetTitle>
							<SheetDescription className='sr-only'>
								Уроки курса «{lesson.course.title}»
							</SheetDescription>
							<LessonSidebar
								{...sidebarProps}
								onNavigate={() => setIsProgramOpen(false)}
							/>
						</SheetContent>
					</Sheet>

					<Link
						href={ROUTES.HOME}
						aria-label='TeaCoder'
						className='flex shrink-0 items-center rounded-lg'
					>
						<Logo className='h-7 w-auto' />
					</Link>

					<nav
						aria-label='Навигация'
						className='hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground sm:flex'
					>
						<span className='mx-1 h-5 w-px bg-border' />
						<Link
							href={ROUTES.COURSES.SINGLE(lesson.course.slug)}
							className='truncate rounded-sm transition-colors hover:text-foreground'
						>
							{lesson.course.title}
						</Link>
						{section && (
							<>
								<ChevronRight className='size-3.5 shrink-0' />
								<span className='truncate'>
									{section.title}
								</span>
							</>
						)}
						<ChevronRight className='size-3.5 shrink-0' />
						<span className='truncate text-foreground'>
							{lesson.title}
						</span>
					</nav>

					{lessons.length > 0 && (
						<div className='ml-auto hidden shrink-0 items-center gap-3 text-sm md:flex'>
							<span className='text-muted-foreground'>
								Прогресс
							</span>
							<span className='h-1.5 w-28 overflow-hidden rounded-full bg-foreground/[0.08]'>
								<span
									className='block h-full rounded-full bg-primary transition-[width] duration-500'
									style={{ width: `${percentage}%` }}
								/>
							</span>
							<span className='w-9 font-mono tabular-nums'>
								{percentage}%
							</span>
						</div>
					)}
				</div>
			</header>

			<div className='lg:grid lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]'>
				<aside className='hidden border-r border-border bg-card lg:sticky lg:top-14 lg:block lg:h-[calc(100svh-3.5rem)]'>
					<LessonSidebar {...sidebarProps} />
				</aside>

				<main className='min-w-0 px-4 pb-16 pt-8 sm:px-8 lg:px-12 lg:pt-10'>
					<div className='mx-auto max-w-4xl'>
						<p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
							{index >= 0
								? `Урок ${index + 1} из ${lessons.length}`
								: 'Урок'}
							{section && ` · ${section.title}`}
						</p>
						<h1 className='mt-3 font-display text-display-md font-medium'>
							{lesson.title}
						</h1>

						<div className='mt-6'>
							<LessonPlayer
								key={lesson.id}
								videoId={lesson.kinescopeId}
							/>
						</div>

						{programQuery.isError && (
							<div
								role='alert'
								className='mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-destructive-soft px-4 py-3 text-sm text-destructive'
							>
								<span>
									Не удалось загрузить программу курса.
								</span>
								<Button
									variant='outline'
									size='sm'
									isLoading={programQuery.isFetching}
									onClick={() => programQuery.refetch()}
								>
									Повторить
								</Button>
							</div>
						)}

						{lesson.description && (
							<div className='mt-8 whitespace-pre-line text-[17px] leading-relaxed text-foreground/85'>
								{lesson.description}
							</div>
						)}

						<div className='mt-10'>
							<LessonNavigation
								lesson={lesson}
								isCompleted={completedLessons.includes(
									lesson.id
								)}
								isProgressLoading={programQuery.isPending}
								prevLessonId={prevLessonId}
								nextLessonId={nextLessonId}
							/>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}

function LessonMessage({
	title,
	description,
	children
}: {
	title: string
	description: string
	children: ReactNode
}) {
	return (
		<div className='flex min-h-svh flex-col bg-background'>
			<header className='flex h-14 items-center border-b border-border px-5'>
				<Link
					href={ROUTES.HOME}
					className='flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight'
				>
					<Logo className='h-7 w-auto' />
					TeaCoder
				</Link>
			</header>
			<main className='flex flex-1 items-center justify-center px-4 py-16'>
				<div className='w-full max-w-md rounded-3xl border border-border bg-card p-7 text-center sm:p-9'>
					<h1 className='font-display text-2xl font-medium tracking-tight'>
						{title}
					</h1>
					<p className='mt-3 text-muted-foreground'>{description}</p>
					<div className='mt-7 flex flex-col gap-2.5'>{children}</div>
				</div>
			</main>
		</div>
	)
}
