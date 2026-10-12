'use client'

import { useGetCoursesLibraryQuery } from '@/generated/api'
import type { CourseResponse } from '@/generated/model'

import { useSession } from '@/lib/auth/auth-provider'

/**
 * Whether the signed-in user can open the course. The course itself is
 * fetched on the server without the user's token, so its `access` is the
 * guest's; the library endpoint answers for the current user without
 * re-fetching the course (that would count another view).
 */
export function useCourseAccess(course: CourseResponse) {
	const { status } = useSession()
	const isAuthenticated = status === 'authenticated'

	const { data: library, isLoading } = useGetCoursesLibraryQuery({
		query: { enabled: isAuthenticated && course.accessMode !== 'FREE' }
	})

	const hasAccess =
		course.accessMode === 'FREE' ||
		course.access.hasAccess ||
		!!library?.some(item => item.id === course.id)

	return {
		hasAccess,
		isLoading:
			status === 'loading' ||
			(isAuthenticated && course.accessMode !== 'FREE' && isLoading)
	}
}
