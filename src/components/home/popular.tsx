import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { CourseListResponseItem } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { CourseCard } from '../course/course-card'
import { Reveal } from '../motion/reveal'
import { Button } from '../ui/button'

interface PopularProps {
	courses: CourseListResponseItem[]
}

export function Popular({ courses }: PopularProps) {
	return (
		<section className='page-container pb-24 sm:pb-32'>
			<Reveal className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
				<div>
					<h2 className='font-serif text-display-lg font-medium tracking-[-0.02em]'>
						Популярные курсы
					</h2>
					<p className='mt-3 text-lg text-muted-foreground'>
						Самые популярные курсы среди пользователей платформы
					</p>
				</div>
				<Button variant='outline' asChild>
					<Link href={ROUTES.COURSES.ROOT}>
						Все курсы
						<ArrowRight />
					</Link>
				</Button>
			</Reveal>

			<Reveal className='mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3'>
				{courses.slice(0, 3).map(course => (
					<CourseCard key={course.id} course={course} />
				))}
			</Reveal>
		</section>
	)
}
