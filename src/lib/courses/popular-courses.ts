import type { CourseListResponseItem } from '@/generated/model'

const POPULAR_COUNT = 4

export function pickPopularCourses(courses: CourseListResponseItem[]) {
	const paid = courses.filter(course => course.price !== null)
	const free = courses.filter(course => course.price === null)

	return [...paid, ...free].slice(0, POPULAR_COUNT)
}
