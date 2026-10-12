import type { LessonResponse } from '@/generated/model'

export type ProgramLesson = Pick<LessonResponse, 'id' | 'title' | 'slug'>

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
