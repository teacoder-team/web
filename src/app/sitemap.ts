import type { MetadataRoute } from 'next'

import { getCoursesQuery } from '@/generated/api'

import { env } from '@/lib/config/env'
import { ROUTES } from '@/lib/routes'

// Built per request: the build must not depend on the API being reachable.
export const dynamic = 'force-dynamic'

const url = (path: string) => new URL(path, env.APP_URL).toString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const courses = await getCoursesQuery().catch(() => [])

	const pages: MetadataRoute.Sitemap = [
		{ url: url(ROUTES.HOME), changeFrequency: 'daily', priority: 1 },
		{
			url: url(ROUTES.COURSES.ROOT),
			changeFrequency: 'daily',
			priority: 0.9
		},
		{ url: url(ROUTES.PREMIUM), changeFrequency: 'monthly', priority: 0.8 },
		{ url: url(ROUTES.ABOUT), changeFrequency: 'yearly', priority: 0.5 },
		{
			url: url(ROUTES.DOCUMENTS.TERMS),
			changeFrequency: 'yearly',
			priority: 0.3
		},
		{
			url: url(ROUTES.DOCUMENTS.PRIVACY),
			changeFrequency: 'yearly',
			priority: 0.3
		},
		{
			url: url(ROUTES.DOCUMENTS.COOKIES),
			changeFrequency: 'yearly',
			priority: 0.3
		}
	]

	// `lastModified` is left out on purpose: the API exposes no update time,
	// and a made-up one teaches crawlers to ignore the field.
	const coursePages: MetadataRoute.Sitemap = courses.map(course => ({
		url: url(ROUTES.COURSES.SINGLE(course.slug)),
		changeFrequency: 'weekly',
		priority: 0.8,
		...(course.thumbnail && { images: [course.thumbnail] })
	}))

	return [...pages, ...coursePages]
}
