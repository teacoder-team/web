import type { LessonResponse } from '@/generated/model'

export type ProgramLesson = Pick<LessonResponse, 'id' | 'title' | 'slug'> & {
	isCompleted?: boolean
	/** `false` - announced but not released yet. */
	isAvailable?: boolean
	plannedReleaseAt?: string | null
}

export type CourseProgramItem =
	| ProgramLesson
	| {
			id: string
			title: string
			lessons: ProgramLesson[]
	  }

export const flattenCourseProgram = (
	program: readonly CourseProgramItem[]
): ProgramLesson[] =>
	program.flatMap(item => ('lessons' in item ? item.lessons : [item]))

export const isLessonAvailable = (lesson: ProgramLesson) =>
	lesson.isAvailable !== false

/** A module with no lessons at all is hidden; announced lessons keep it visible. */
export const withoutEmptySections = <T extends CourseProgramItem>(
	program: readonly T[]
): T[] =>
	program.filter(item => !('lessons' in item) || item.lessons.length > 0)

/** Released lessons only: progress and navigation never count announcements. */
export const getAvailableLessons = (program: readonly CourseProgramItem[]) =>
	flattenCourseProgram(program).filter(isLessonAvailable)
