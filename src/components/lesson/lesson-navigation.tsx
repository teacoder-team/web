'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
	getGetCoursesBySlugLessonsQueryQueryKey,
	getGetProgressByCourseIdQueryQueryKey,
	usePutProgressMutation
} from '@/generated/api'
import type { LessonResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { ROUTES } from '@/lib/routes'

import { Button } from '../ui/button'

interface LessonNavigationProps {
	lesson: LessonResponse
	isCompleted: boolean
	isProgressLoading: boolean
	prevLessonId: string | null
	nextLessonId: string | null
}

export function LessonNavigation({
	lesson,
	isCompleted,
	isProgressLoading,
	prevLessonId,
	nextLessonId
}: LessonNavigationProps) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: update, isPending } = usePutProgressMutation({
		mutation: {
			onSuccess(data) {
				queryClient.invalidateQueries({
					queryKey: getGetCoursesBySlugLessonsQueryQueryKey(
						lesson.course.slug
					)
				})
				queryClient.invalidateQueries({
					queryKey: getGetProgressByCourseIdQueryQueryKey(
						lesson.course.id
					)
				})

				if (data.nextLessonId && data.isCompleted) {
					router.push(ROUTES.COURSES.LESSON(data.nextLessonId))
				}
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при обновлении прогресса')
				)
			}
		}
	})

	const toggle = (value: boolean) =>
		update({ data: { lessonId: lesson.id, isCompleted: value } })

	return (
		<div className='flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between'>
			{prevLessonId ? (
				<Button variant='outline' size='lg' asChild>
					<Link href={ROUTES.COURSES.LESSON(prevLessonId)}>
						<ArrowLeft />
						Предыдущий урок
					</Link>
				</Button>
			) : (
				<span className='hidden sm:block' />
			)}

			<div className='flex flex-col-reverse gap-3 sm:flex-row'>
				{isCompleted ? (
					<>
						<Button
							variant='ghost'
							size='lg'
							onClick={() => toggle(false)}
							isLoading={isPending}
							disabled={isPending || isProgressLoading}
						>
							{!isPending && <RotateCcw />}
							Снять отметку
						</Button>
						{nextLessonId && (
							<Button size='lg' asChild>
								<Link
									href={ROUTES.COURSES.LESSON(nextLessonId)}
								>
									Следующий урок
									<ArrowRight />
								</Link>
							</Button>
						)}
					</>
				) : (
					<Button
						size='lg'
						onClick={() => toggle(true)}
						isLoading={isPending || isProgressLoading}
						disabled={isPending || isProgressLoading}
					>
						{!isPending && !isProgressLoading && <Check />}
						{nextLessonId
							? 'Отметить пройденным и продолжить'
							: 'Отметить пройденным'}
					</Button>
				)}
			</div>
		</div>
	)
}
