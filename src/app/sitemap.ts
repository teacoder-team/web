import type { MetadataRoute } from 'next'

import { getCoursesQuery } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { env } from '@/lib/config/env'

// Built per request: the build must not depend on the API being reachable.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const courses: MetadataRoute.Sitemap = (await getCoursesQuery()).map(
		course => ({
			url: `${env.APP_URL}${ROUTES.COURSES.SINGLE(course.slug)}`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.9
		})
	)

	return [
		{
			url: env.APP_URL,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1
		},
		...courses
	]
}
