import type { Metadata } from 'next'

import { LessonContent } from '@/components/lesson/lesson-content'

export const metadata: Metadata = {
	title: 'Урок',
	referrer: 'no-referrer',
	robots: { index: false, follow: false }
}

export default async function LessonPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <LessonContent key={id} id={id} />
}
