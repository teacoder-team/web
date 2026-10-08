import type { Metadata } from 'next'
import { Fragment } from 'react'

import { getCoursesQuery } from '@/generated/api'

import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { Popular } from '@/components/home/popular'
import { TelegramCTA } from '@/components/home/telegram-cta'

import { pickPopularCourses } from '@/lib/courses/popular-courses'

export const metadata: Metadata = {
	title: 'Образовательная платформа по веб разработке'
}

export default async function HomePage() {
	const courses = pickPopularCourses(await getCoursesQuery())

	return (
		<Fragment>
			<Hero />
			<Features />
			<Popular courses={courses} />
			<TelegramCTA />
		</Fragment>
	)
}
