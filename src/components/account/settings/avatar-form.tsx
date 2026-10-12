'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import {
	getGetUsersMeQueryQueryKey,
	usePostUsersMeAvatarMutation
} from '@/generated/api'
import type { UserResponse } from '@/generated/model'

import { useMediaSource } from '@/hooks/use-media-source'

import { getErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { buttonVariants } from '../../ui/button'
import { Input } from '../../ui/input'

interface AvatarFormProps {
	user: UserResponse | undefined
}

export function AvatarForm({ user }: AvatarFormProps) {
	const getMediaSource = useMediaSource()

	const [preview, setPreview] = useState<string | null>(
		user?.avatar ? getMediaSource(user.avatar, 'users') : null
	)

	const queryClient = useQueryClient()

	const { mutate, isPending } = usePostUsersMeAvatarMutation({
		mutation: {
			onSuccess(data) {
				setPreview(data.avatar)
				queryClient.invalidateQueries({
					queryKey: getGetUsersMeQueryQueryKey()
				})
				toast.success('Аватар успешно обновлён')
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при обновлении аватара')
				)
			}
		}
	})

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]

		if (file) {
			mutate({ data: { file } })
		} else {
			toast.error('Пожалуйста, выберите файл')
		}
	}

	return (
		<div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6'>
			<div className='flex items-center gap-4'>
				<Avatar className='size-16'>
					<AvatarImage src={preview ?? ''} alt='Аватар' />
					<AvatarFallback className='text-xl'>
						{user?.displayName.slice(0, 1)}
					</AvatarFallback>
				</Avatar>
				<div>
					<h3 className='font-medium'>Аватар</h3>
					<p className='mt-1 text-sm text-muted-foreground'>
						JPEG, PNG, WEBP или GIF до 10 МБ.
					</p>
				</div>
			</div>
			<label
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'cursor-pointer'
				)}
			>
				<Upload />
				{isPending ? 'Загружаем…' : 'Загрузить'}
				<Input
					type='file'
					accept='image/jpeg, image/png, image/webp, image/gif'
					className='sr-only'
					disabled={isPending}
					onChange={handleFileChange}
				/>
			</label>
		</div>
	)
}
