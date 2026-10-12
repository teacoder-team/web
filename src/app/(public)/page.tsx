import type { Metadata } from 'next'
import { Fragment } from 'react'

import { getCoursesQuery } from '@/generated/api'

import { Bento } from '@/components/home/bento'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Popular } from '@/components/home/popular'
import { TelegramCTA } from '@/components/home/telegram-cta'

import { getAppConfig } from '@/lib/config/app-config'
import { pickPopularCourses } from '@/lib/courses/popular-courses'
import { getMediaSource } from '@/lib/utils'

export const metadata: Metadata = {
	title: 'Образовательная платформа по веб разработке'
}

export default async function HomePage() {
	const [allCourses, config] = await Promise.all([
		getCoursesQuery(),
		getAppConfig()
	])

	const courses = pickPopularCourses(allCourses)
	// Popular courses lead the showcase, the rest follow
	const ordered = [
		...courses,
		...allCourses.filter(course => !courses.includes(course))
	]
	const covers = ordered
		.map(course => ({
			slug: course.slug,
			title: course.title,
			lessons: course.lessons,
			src: getMediaSource(
				course.thumbnail,
				'courses',
				config?.features.orion.url
			)
		}))
		.filter(cover => cover.src !== '')

	return (
		<Fragment>
			<Hero covers={covers} />
			<Manifesto />
			<Popular courses={courses} />
			<Bento covers={covers} />
			<TelegramCTA />
		</Fragment>
	)
}
