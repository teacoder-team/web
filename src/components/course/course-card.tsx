import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaYoutube } from 'react-icons/fa'

import type { CourseListResponseItem } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { getAppConfig } from '@/lib/config/app-config'
import { getLessonLabel, getMediaSource } from '@/lib/utils'

import { Badge } from '../ui/badge'

interface CourseCardProps {
	course: CourseListResponseItem
}

export async function CourseCard({ course }: CourseCardProps) {
	const config = await getAppConfig()

	return (
		<Link
			href={ROUTES.COURSES.SINGLE(course.slug)}
			className='group relative rounded-lg'
		>
			<div className='relative aspect-video overflow-hidden rounded-md transition-all'>
				<Image
					src={getMediaSource(
						course.thumbnail,
						'courses',
						config?.features.orion.url
					)}
					alt={course.title}
					fill
				/>
			</div>
			<div className='px-0 py-3'>
				<h3 className='text-base font-medium text-foreground transition group-hover:text-blue-500'>
					{course.title}
				</h3>
				<p
					className='mt-1 overflow-hidden text-sm text-neutral-600 dark:text-neutral-300'
					style={{
						display: '-webkit-box',

						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: 2
					}}
				>
					{course.shortDescription}
				</p>
				<Badge
					variant={course.lessons > 0 ? 'default' : 'error'}
					className='mt-3'
				>
					{course.lessons > 0 ? (
						<>
							<BookOpen className='mr-0.5 size-3.5' />
							{course.lessons} {getLessonLabel(course.lessons)}
						</>
					) : (
						<>
							<FaYoutube className='mr-0.5 size-3.5' />
							Youtube
						</>
					)}
				</Badge>
			</div>
		</Link>
	)
}
