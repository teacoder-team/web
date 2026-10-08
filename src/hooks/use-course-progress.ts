'use client'

import { useGetProgressByCourseIdQuery } from '@/generated/api'

import { useSession } from '@/lib/auth/auth-provider'

/** The signed-in user's progress in a course; empty for guests. */
export function useCourseProgress(courseId: string) {
	const { status } = useSession()

	const { data, isLoading } = useGetProgressByCourseIdQuery(courseId, {
		query: { enabled: status === 'authenticated' }
	})

	return {
		completedLessons: data?.completedLessonIds ?? [],
		percentage: data?.percentage ?? 0,
		isLoading: status === 'loading' || isLoading
	}
}
