import { notFound } from 'next/navigation'
import { cache } from 'react'

import { getCoursesBySlugQuery } from '@/generated/api'

/**
 * One request per render: metadata and the page share it, and the API counts
 * a view on every `GET /courses/:slug`.
 */
export const getCourse = cache((slug: string) =>
	getCoursesBySlugQuery(slug).catch(() => notFound())
)
