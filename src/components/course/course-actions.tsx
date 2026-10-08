'use client'

import { DownloadCloud } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaYoutube } from 'react-icons/fa'
import { toast } from 'sonner'

import { usePostCoursesBySlugMaterialsLinkMutation } from '@/generated/api'
import type { CourseResponse } from '@/generated/model'

import { ROUTES } from '@/constants/routes'

import { getErrorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/auth-provider'

import { Button } from '../ui/button'

interface CourseActionsProps {
	course: CourseResponse
}

export function CourseActions({ course }: CourseActionsProps) {
	const router = useRouter()
	const { isAuthorized, isLoading } = useSession()
	const { mutate, isPending } = usePostCoursesBySlugMaterialsLinkMutation({
		mutation: {
			onSuccess: ({ url }) => {
				window.location.assign(url)
			},
			onError: error => {
				toast.error(
					getErrorMessage(error, 'Не удалось сгенерировать ссылку')
				)
			}
		}
	})

	const handleDownload = () => {
		if (isPending || isLoading || !course.hasMaterials) {
			return
		}

		if (!isAuthorized) {
			return router.push(
				ROUTES.AUTH.LOGIN(ROUTES.COURSES.SINGLE(course.slug))
			)
		}

		mutate({ slug: course.slug })
	}

	return (
		<div className='relative flex flex-col gap-3 rounded-xl border border-border bg-background p-5'>
			<h2 className='text-xl font-semibold text-foreground'>
				Дополнительно
			</h2>
			<p className='text-sm text-neutral-600 dark:text-neutral-300'>
				Скачайте готовый код или смотрите курс на YouTube
			</p>
			<div className='flex flex-col gap-4'>
				<Button
					variant='primary'
					className='w-full'
					onClick={handleDownload}
					disabled={!course.hasMaterials || isLoading || isPending}
				>
					<DownloadCloud />
					{!course.hasMaterials
						? 'Исходный код пока недоступен'
						: isPending
							? 'Готовим ссылку…'
							: 'Скачать код'}
				</Button>
				{course.youtubeUrl && (
					<Button variant='outline' className='w-full' asChild>
						<Link href={course.youtubeUrl} target='_blank'>
							<FaYoutube />
							Смотреть на YouTube
						</Link>
					</Button>
				)}
			</div>
		</div>
	)
}
