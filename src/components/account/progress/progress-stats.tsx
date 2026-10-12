'use client'

import Image from 'next/image'

import { useGetUsersMeStatisticsQuery } from '@/generated/api'

import { Skeleton } from '../../ui/skeleton'

export function ProgressStats() {
	const { data, isLoading } = useGetUsersMeStatisticsQuery()

	const tiles = data
		? [
				{
					label: 'Очки',
					value: new Intl.NumberFormat('ru-RU').format(data.points)
				},
				{
					label: 'Место в рейтинге',
					value: data.rank > 0 ? `#${data.rank}` : '-'
				},
				{
					label: 'Пройдено уроков',
					value: data.completedLessons,
					suffix: `из ${data.totalLessons}`
				},
				{ label: 'Общий прогресс', value: `${data.progress}%` }
			]
		: []

	return (
		<section className='relative isolate overflow-hidden rounded-3xl bg-inverse p-6 text-inverse-foreground dark:ring-1 dark:ring-border sm:p-8'>
			<Image
				src='/images/art/panel-grain.webp'
				alt=''
				fill
				sizes='(min-width: 1024px) 900px, 100vw'
				className='-z-10 object-cover'
			/>

			<div className='grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4'>
				{isLoading || !data
					? Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className='space-y-3'>
								<Skeleton className='h-3 w-24 bg-inverse-foreground/10' />
								<Skeleton className='h-11 w-20 bg-inverse-foreground/10' />
							</div>
						))
					: tiles.map(tile => (
							<div key={tile.label}>
								<p className='text-sm text-inverse-foreground/60'>
									{tile.label}
								</p>
								<p className='mt-2 flex items-baseline gap-2'>
									<span className='font-display text-[clamp(2rem,1.6rem+1.6vw,3rem)] font-medium tabular-nums leading-none tracking-[-0.04em]'>
										{tile.value}
									</span>
									{tile.suffix && (
										<span className='text-sm text-inverse-foreground/50'>
											{tile.suffix}
										</span>
									)}
								</p>
							</div>
						))}
			</div>

			<div className='mt-8 border-t border-inverse-foreground/10 pt-5'>
				<div className='h-1.5 overflow-hidden rounded-full bg-inverse-foreground/10'>
					<div
						className='h-full rounded-full bg-highlight transition-[width] duration-700 ease-out'
						style={{ width: `${data?.progress ?? 0}%` }}
					/>
				</div>
				<p className='mt-3 text-sm text-inverse-foreground/60'>
					{data
						? `Завершено курсов: ${data.completedCourses} · В процессе: ${data.coursesInProgress}`
						: ' '}
				</p>
			</div>
		</section>
	)
}
