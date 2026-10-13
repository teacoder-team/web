import type { Metadata } from 'next'
import { Fragment } from 'react'

import { getCoursesQuery } from '@/generated/api'

import { Bento } from '@/components/home/bento'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Popular } from '@/components/home/popular'
import { TelegramCTA } from '@/components/home/telegram-cta'

import { pickPopularCourses } from '@/lib/courses/popular-courses'

export const metadata: Metadata = {
	title: 'Образовательная платформа по веб разработке'
}

export default async function HomePage() {
	const allCourses = await getCoursesQuery()
	const courses = pickPopularCourses(allCourses)

	const covers = [
		...courses,
		...allCourses.filter(course => !courses.includes(course))
	]
		.filter(course => course.thumbnail)
		.map(course => ({
			slug: course.slug,
			title: course.title,
			lessons: course.lessons,
			src: course.thumbnail!
		}))

	return (
		<Fragment>
			<Hero />
			<Manifesto />
			<Popular courses={courses} />
			<Bento covers={covers} />
			<TelegramCTA />
		</Fragment>
	)
}
