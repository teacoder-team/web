'use client'

import { BookOpen, ChevronRight } from 'lucide-react'

import { useGetUsersMeProgressQuery } from '@/generated/api'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { CourseProgress } from '../../shared/course-progress'

interface CoursesListProps {
	onViewAll: () => void
}

export function CoursesList({ onViewAll }: CoursesListProps) {
	const { data } = useGetUsersMeProgressQuery()

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center text-lg font-medium'>
					<BookOpen className='mr-2 size-5' /> Все курсы
				</CardTitle>
				<CardDescription>Ваш прогресс по курсам</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{data?.map(course => (
						<div key={course.id} className='space-y-2'>
							<div className='flex items-center justify-between'>
								<div className='font-medium'>
									{course.title}
								</div>
								<div className='text-sm text-muted-foreground'>
									{course.completedLessons}/
									{course.totalLessons} уроков
								</div>
							</div>
							<CourseProgress
								progress={course.progress}
								variant='success'
								className='h-2'
							/>
						</div>
					))}
				</div>
			</CardContent>

			<CardFooter>
				<Button
					variant='outline'
					className='w-full'
					onClick={onViewAll}
				>
					Подробнее
					<ChevronRight className='ml-2 size-4' />
				</Button>
			</CardFooter>
		</Card>
	)
}
