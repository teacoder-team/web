import type { MetadataRoute } from 'next'

import { APP } from '@/lib/constants/app'

export const revalidate = 3600

async function getCourses() {
	try {
		const res = await fetch('http://localhost:3000/api/courses', {
			next: { revalidate: 3600 }
		})

		if (!res.ok) {
			throw new Error(`Failed to fetch courses: ${res.status}`)
		}

		return res.json()
	} catch (error) {
		console.error('Sitemap courses fetch error:', error)
		return []
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const courses = await getCourses()

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${APP.url}/`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${APP.url}/premium`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9
		},
		{
			url: `${APP.url}/courses`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${APP.url}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5
		}
	]

	// @ts-ignore
	const coursesPages: MetadataRoute.Sitemap = courses.map(course => ({
		url: `${APP.url}/courses/${course.slug}`,
		lastModified: course.updatedAt
			? new Date(course.updatedAt)
			: course.createdAt
				? new Date(course.createdAt)
				: new Date(),
		changeFrequency: 'weekly',
		priority: 0.8
	}))

	return [...staticPages, ...coursesPages]
}
