'use client'

import { Check, Lock, Play } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'

import type { CourseLessonListResponseItem } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { useSession } from '@/lib/auth/auth-provider'
import type { ProgramLesson } from '@/lib/course-program'
import { cn, getLessonLabel } from '@/lib/utils'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '../ui/accordion'

interface CourseProgramProps {
	program: CourseLessonListResponseItem[]
	completedLessons: string[]
	nextLessonId: string | null
	isLocked: boolean
}

export function CourseProgram({
	program,
	completedLessons,
	nextLessonId,
	isLocked
}: CourseProgramProps) {
	const sections = program.filter(item => 'lessons' in item)
	const hasSections = sections.length > 0

	// Global lesson numbers across sections
	const numbers = new Map<string, number>()
	program
		.flatMap(item => ('lessons' in item ? item.lessons : [item]))
		.forEach((lesson, index) => numbers.set(lesson.id, index + 1))

	const rowProps = { completedLessons, nextLessonId, isLocked, numbers }

	if (!hasSections) {
		return (
			<ul className='overflow-hidden rounded-2xl border border-border bg-card'>
				{program.map(
					item =>
						!('lessons' in item) && (
							<LessonRow
								key={item.id}
								lesson={item}
								{...rowProps}
							/>
						)
				)}
			</ul>
		)
	}

	const openSection =
		sections.find(
			section =>
				'lessons' in section &&
				section.lessons.some(lesson => lesson.id === nextLessonId)
		) ?? sections[0]

	return (
		<Accordion
			type='multiple'
			defaultValue={openSection ? [openSection.id] : []}
			className='space-y-3'
		>
			{program.map((item, index) => {
				if (!('lessons' in item)) {
					return (
						<ul
							key={item.id}
							className='overflow-hidden rounded-2xl border border-border bg-card'
						>
							<LessonRow lesson={item} {...rowProps} />
						</ul>
					)
				}

				const done = item.lessons.filter(lesson =>
					completedLessons.includes(lesson.id)
				).length
				const isDone = done === item.lessons.length && done > 0

				return (
					<AccordionItem
						key={item.id}
						value={item.id}
						className='overflow-hidden rounded-2xl border border-border bg-card'
					>
						<AccordionTrigger className='min-w-0 items-center px-5 py-4 hover:no-underline [&>svg]:shrink-0'>
							<span className='flex min-w-0 flex-1 items-center gap-4'>
								<span
									className={cn(
										'flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs',
										isDone
											? 'bg-success-soft text-success'
											: 'bg-secondary text-muted-foreground'
									)}
								>
									{isDone ? (
										<Check
											className='size-4'
											strokeWidth={2.5}
										/>
									) : (
										String(index + 1).padStart(2, '0')
									)}
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block truncate font-medium text-foreground'>
										{item.title}
									</span>
									<span className='mt-0.5 block text-sm font-normal text-muted-foreground'>
										{item.lessons.length}{' '}
										{getLessonLabel(item.lessons.length)}
										{done > 0 &&
											!isDone &&
											` · пройдено ${done}`}
									</span>
								</span>
							</span>
						</AccordionTrigger>
						<AccordionContent className='pb-0'>
							<ul className='border-t border-border'>
								{item.lessons.map(lesson => (
									<LessonRow
										key={lesson.id}
										lesson={lesson}
										{...rowProps}
									/>
								))}
							</ul>
						</AccordionContent>
					</AccordionItem>
				)
			})}
		</Accordion>
	)
}

interface LessonRowProps {
	lesson: ProgramLesson
	completedLessons: string[]
	nextLessonId: string | null
	isLocked: boolean
	numbers: Map<string, number>
}

function LessonRow({
	lesson,
	completedLessons,
	nextLessonId,
	isLocked,
	numbers
}: LessonRowProps) {
	const { isAuthorized } = useSession()

	const isCompleted = completedLessons.includes(lesson.id)
	const isNext = lesson.id === nextLessonId && completedLessons.length > 0

	const href: Route = isAuthorized
		? ROUTES.COURSES.LESSON(lesson.id)
		: (ROUTES.AUTH.LOGIN(ROUTES.COURSES.LESSON(lesson.id)) as Route)

	const content = (
		<>
			{isNext && (
				<span className='absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary' />
			)}
			<span
				className={cn(
					'flex size-7 shrink-0 items-center justify-center rounded-full text-xs tabular-nums',
					isCompleted
						? 'bg-success-soft text-success'
						: isNext
							? 'bg-primary text-primary-foreground'
							: 'border border-border text-muted-foreground'
				)}
			>
				{isCompleted ? (
					<Check className='size-3.5' strokeWidth={3} />
				) : isNext ? (
					<Play className='size-3 translate-x-px fill-current' />
				) : (
					numbers.get(lesson.id)
				)}
			</span>
			<span
				className={cn(
					'min-w-0 flex-1 truncate text-[15px] transition-colors',
					isCompleted || isLocked
						? 'text-muted-foreground'
						: 'text-foreground'
				)}
			>
				{lesson.title}
			</span>
			{isNext && (
				<span className='shrink-0 text-xs font-medium text-brand'>
					Следующий
				</span>
			)}
			{isLocked && !isCompleted && (
				<Lock
					aria-label='Недоступно'
					className='size-4 shrink-0 text-muted-foreground'
				/>
			)}
		</>
	)

	const rowClassName = cn(
		'relative flex items-center gap-4 px-5 py-3.5',
		isNext && 'bg-brand-soft/50'
	)

	return (
		<li className='border-b border-border last:border-b-0'>
			{isLocked ? (
				// Without access the lesson page can't be opened, so no link
				<div className={rowClassName}>{content}</div>
			) : (
				<Link
					href={href}
					className={cn(
						rowClassName,
						'transition-colors hover:bg-secondary/60'
					)}
				>
					{content}
				</Link>
			)}
		</li>
	)
}
