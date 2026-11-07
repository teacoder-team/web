import type { Metadata } from 'next'
import { Fragment } from 'react'

import { Bento } from '@/components/home/bento'
import { FeaturedCourse } from '@/components/home/featured-course'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Popular } from '@/components/home/popular'
import { TelegramCTA } from '@/components/home/telegram-cta'
import { JsonLd } from '@/components/shared/json-ld'

import { getAppConfig } from '@/lib/config/app-config'
import { getCourses, pickFeaturedCourse } from '@/lib/courses/featured-course'
import { pickPopularCourses } from '@/lib/courses/popular-courses'
import { ROUTES } from '@/lib/routes'
import { SEO, pageMetadata } from '@/lib/seo'
import { itemListSchema } from '@/lib/seo/schema'

export const metadata: Metadata = {
	...pageMetadata({
		title: SEO.name,
		description: SEO.description,
		path: ROUTES.HOME
	}),
	title: {
		absolute: 'TeaCoder - курсы по веб-разработке с практикой'
	}
}

export default async function HomePage() {
	const [allCourses, config] = await Promise.all([
		getCourses(),
		getAppConfig()
	])

	const courses = pickPopularCourses(allCourses)
	const featured = pickFeaturedCourse(allCourses)

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
			<JsonLd
				schema={itemListSchema(
					courses.map(course => ({
						path: ROUTES.COURSES.SINGLE(course.slug)
					})),
					'Популярные курсы TeaCoder'
				)}
			/>

			{featured && (
				<FeaturedCourse
					course={featured}
					currency={config?.features.premium.currency}
				/>
			)}
			<Hero />
			<Manifesto />
			<Popular courses={courses} />
			<Bento covers={covers} />
			<TelegramCTA />
		</Fragment>
	)
}
