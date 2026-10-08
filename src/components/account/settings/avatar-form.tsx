'use client'

import { useQueryClient } from '@tanstack/react-query'
import { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import {
	getGetUsersMeQueryQueryKey,
	usePostUsersMeAvatarMutation
} from '@/generated/api'
import type { UserResponse } from '@/generated/model'

import { useMediaSource } from '@/hooks/use-media-source'

import { getErrorMessage } from '@/lib/api/errors'

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
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

	const { mutate } = usePostUsersMeAvatarMutation({
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
		<div className='flex items-center gap-x-3'>
			<label className='cursor-pointer'>
				<Avatar className='size-14'>
					<AvatarImage src={preview ?? ''} alt='Аватарка' />
					<AvatarFallback className='text-xl'>
						{user?.displayName.slice(0, 1)}
					</AvatarFallback>
				</Avatar>
				<Input
					type='file'
					accept='image/jpeg, image/png, image/webp, image/gif'
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>
			<div className='flex flex-col'>
				<h2 className='font-semibold'>Аватарка</h2>
				<p className='text-sm text-muted-foreground'>
					Форматы: JPEG, PNG, WEBP, GIF. Макс. размер: 10 МБ.
				</p>
			</div>
		</div>
	)
}
