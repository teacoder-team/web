'use client'

import { useQueryClient } from '@tanstack/react-query'
import { CircleCheckBig, CircleX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
	getGetProgressByCourseIdQueryQueryKey,
	usePutProgressMutation
} from '@/generated/api'
import type { LessonResponse } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { useCourseProgress } from '@/hooks/use-course-progress'

import { getErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

interface LessonCompleteButtonProps {
	lesson: LessonResponse
}

export function LessonCompleteButton({ lesson }: LessonCompleteButtonProps) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { completedLessons, isLoading: isProgressLoading } =
		useCourseProgress(lesson.courseId)

	const isCompleted = completedLessons.includes(lesson.id)

	const { mutate: update, isPending } = usePutProgressMutation({
		mutation: {
			onSuccess(data) {
				queryClient.invalidateQueries({
					queryKey: getGetProgressByCourseIdQueryQueryKey(
						lesson.courseId
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

	const mutate = () =>
		update({ data: { lessonId: lesson.id, isCompleted: !isCompleted } })

	const Icon = isCompleted ? CircleX : CircleCheckBig

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 p-4 backdrop-blur-sm'>
			<div className='mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
				<div className='flex-1'>
					<p className='text-sm font-medium'>
						{isCompleted
							? 'Вы завершили этот урок!'
							: 'Вы готовы завершить этот урок?'}
					</p>
					<p className='text-sm text-neutral-600 dark:text-neutral-300'>
						{isCompleted
							? 'Отличная работа! Вы можете посмотреть свою статистику в личном кабинете.'
							: 'Не забудьте завершить урок, когда будете готовы.'}
					</p>
				</div>
				<Button
					onClick={() => mutate()}
					variant='outline'
					size='lg'
					className={cn(
						'min-w-52 transition-all duration-200 ease-in-out',
						!isCompleted &&
							'bg-emerald-600 !text-white hover:bg-emerald-600/90'
					)}
					isLoading={isPending || isProgressLoading}
				>
					{isPending ? (
						'Загрузка...'
					) : (
						<>
							<Icon />
							{isCompleted ? 'Отменить' : 'Продолжить'}
						</>
					)}
				</Button>
			</div>
		</div>
	)
}
