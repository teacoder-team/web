import { cache } from 'react'

import { getCoursesQuery } from '@/generated/api'
import type { CourseListResponseItem } from '@/generated/model'

/** One catalog request per render: the layout and the page share it. */
export const getCourses = cache(() => getCoursesQuery())

/** The early access course the promo blocks point at, while it is on sale. */
export const pickFeaturedCourse = (courses: CourseListResponseItem[]) =>
	courses.find(
		course =>
			course.status === 'EARLY_ACCESS' &&
			course.price !== null &&
			(course.accessMode === 'PURCHASE' ||
				course.accessMode === 'PREMIUM_OR_PURCHASE')
	) ?? null

/** A failing catalog must never take a layout down with it. */
export const getFeaturedCourse = async () =>
	pickFeaturedCourse(await getCourses().catch(() => []))
