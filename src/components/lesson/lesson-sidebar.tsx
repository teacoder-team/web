'use client'

import { ArrowLeft, Check, Play } from 'lucide-react'
import Link from 'next/link'

import type {
	CourseLessonListResponseItem,
	LessonResponseCourse
} from '@/generated/model'

import type { ProgramLesson } from '@/lib/courses/program'
import { ROUTES } from '@/lib/routes'
import { LESSON, cn, plural } from '@/lib/utils'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '../ui/accordion'
import { Progress } from '../ui/progress'
import { Skeleton } from '../ui/skeleton'

interface LessonSidebarProps {
	course: LessonResponseCourse
	program: CourseLessonListResponseItem[]
	isProgramLoading: boolean
	activeLessonId: string
	completedLessons: string[]
	onNavigate?: () => void
}

export function LessonSidebar({
	course,
	program,
	isProgramLoading,
	activeLessonId,
	completedLessons,
	onNavigate
}: LessonSidebarProps) {
	const lessons = program.flatMap(item =>
		'lessons' in item ? item.lessons : [item]
	)
	const completed = lessons.filter(lesson =>
		completedLessons.includes(lesson.id)
	).length
	const percentage = lessons.length
		? Math.round((completed / lessons.length) * 100)
		: 0

	const numbers = new Map(
		lessons.map((lesson, index) => [lesson.id, index + 1])
	)
	const activeSection = program.find(
		item =>
			'lessons' in item &&
			item.lessons.some(lesson => lesson.id === activeLessonId)
	)

	const rowProps = {
		activeLessonId,
		completedLessons,
		numbers,
		onNavigate
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='border-b border-border p-5'>
				<Link
					href={ROUTES.COURSES.SINGLE(course.slug)}
					onClick={onNavigate}
					className='inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground'
				>
					<ArrowLeft className='size-4' />К странице курса
				</Link>
				<p className='mt-5 font-serif text-xl font-medium leading-snug tracking-[-0.01em]'>
					{course.title}
				</p>
				<div className='mt-4'>
					<Progress value={percentage} />
					<div className='mt-2 flex items-center justify-between text-xs text-muted-foreground'>
						<span className='font-medium text-brand'>
							{percentage}% пройдено
						</span>
						<span className='tabular-nums'>
							{completed} / {lessons.length}{' '}
							{plural(lessons.length, LESSON)}
						</span>
					</div>
				</div>
			</div>

			<nav
				aria-label='Программа курса'
				className='flex-1 overflow-y-auto overscroll-contain p-3'
			>
				{isProgramLoading ? (
					<div className='space-y-2 p-2'>
						{Array.from({ length: 6 }).map((_, index) => (
							<Skeleton key={index} className='h-11 w-full' />
						))}
					</div>
				) : (
					<Accordion
						type='multiple'
						defaultValue={activeSection ? [activeSection.id] : []}
						className='space-y-1'
					>
						{program.map((item, index) =>
							'lessons' in item ? (
								<AccordionItem
									key={item.id}
									value={item.id}
									className='border-none'
								>
									<AccordionTrigger className='min-w-0 items-center rounded-xl px-3 py-3 text-left text-sm hover:bg-secondary/70 hover:no-underline'>
										<SectionHeader
											index={index}
											title={item.title}
											lessons={item.lessons}
											completedLessons={completedLessons}
										/>
									</AccordionTrigger>
									<AccordionContent className='pb-2 pt-1'>
										<ul className='space-y-0.5'>
											{item.lessons.map(lesson => (
												<LessonLink
													key={lesson.id}
													lesson={lesson}
													{...rowProps}
												/>
											))}
										</ul>
									</AccordionContent>
								</AccordionItem>
							) : (
								<ul key={item.id}>
									<LessonLink lesson={item} {...rowProps} />
								</ul>
							)
						)}
					</Accordion>
				)}
			</nav>
		</div>
	)
}

function SectionHeader({
	index,
	title,
	lessons,
	completedLessons
}: {
	index: number
	title: string
	lessons: ProgramLesson[]
	completedLessons: string[]
}) {
	const done = lessons.filter(lesson =>
		completedLessons.includes(lesson.id)
	).length
	const isDone = done > 0 && done === lessons.length

	return (
		<span className='flex min-w-0 flex-1 items-center gap-3'>
			<span
				className={cn(
					'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px]',
					isDone
						? 'bg-success-soft text-success'
						: 'bg-secondary text-muted-foreground'
				)}
			>
				{isDone ? (
					<Check className='size-3.5' strokeWidth={2.5} />
				) : (
					String(index + 1).padStart(2, '0')
				)}
			</span>
			<span className='min-w-0 flex-1'>
				<span className='line-clamp-2 font-medium leading-snug text-foreground'>
					{title}
				</span>
				<span className='mt-0.5 block text-xs font-normal text-muted-foreground'>
					{done} / {lessons.length} {plural(lessons.length, LESSON)}
				</span>
			</span>
		</span>
	)
}

interface LessonLinkProps {
	lesson: ProgramLesson
	activeLessonId: string
	completedLessons: string[]
	numbers: Map<string, number>
	onNavigate?: () => void
}

function LessonLink({
	lesson,
	activeLessonId,
	completedLessons,
	numbers,
	onNavigate
}: LessonLinkProps) {
	const isActive = lesson.id === activeLessonId
	const isCompleted = completedLessons.includes(lesson.id)

	return (
		<li>
			<Link
				href={ROUTES.COURSES.LESSON(lesson.id)}
				onClick={onNavigate}
				aria-current={isActive ? 'page' : undefined}
				className={cn(
					'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
					isActive
						? 'bg-brand-soft text-foreground'
						: 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
				)}
			>
				{isActive && (
					<span className='absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary' />
				)}
				<span
					className={cn(
						'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums',
						isActive
							? 'bg-primary text-primary-foreground'
							: isCompleted
								? 'bg-success-soft text-success'
								: 'border border-border'
					)}
				>
					{isActive ? (
						<Play className='size-2.5 translate-x-px fill-current' />
					) : isCompleted ? (
						<Check className='size-3' strokeWidth={3} />
					) : (
						numbers.get(lesson.id)
					)}
				</span>
				<span
					className={cn(
						'line-clamp-2 min-w-0 flex-1 leading-snug',
						isActive && 'font-medium'
					)}
				>
					{lesson.title}
				</span>
			</Link>
		</li>
	)
}
