'use client'

import { BookOpen, Crown, Medal, Trophy } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { useGetUsersMeStatisticsQuery } from '@/generated/api'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function UserStats() {
	const { data, isLoading } = useGetUsersMeStatisticsQuery()

	return isLoading ? (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
			{/* <Skeleton className='h-4 w-[100px]' /> */}
			{/* <Skeleton className='h-4 w-[160px]' /> */}
		</div>
	) : (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='flex items-center text-lg font-medium'>
						<Trophy className='mr-2 size-5 text-yellow-500' />
						Очки и рейтинг
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-between'>
						<div>
							<div className='text-3xl font-bold'>
								{data?.points}
							</div>
							<div className='text-sm text-muted-foreground'>
								Всего очков
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='flex items-center text-lg font-medium'>
						<BookOpen className='mr-2 size-5 text-blue-600' />
						Прогресс обучения
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex items-center justify-between'>
						<div>
							<div className='text-3xl font-bold'>
								{data?.completedLessons}
							</div>
							<div className='text-sm text-muted-foreground'>
								Пройдено уроков
							</div>
						</div>
						<div className='size-20'>
							<CircularProgressbar
								value={data?.progress ?? 0}
								text={`${data?.progress ?? 0}%`}
								styles={{
									trail: {
										color: '#E2E8F0'
									},
									path: {
										color: '#3B82F6'
									},
									text: {
										fontSize: '1.5rem',
										color: '#3B82F6',
										fontWeight: 600
									}
								}}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
