'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetSessionsQueryQueryKey,
	useDeleteSessionsByIdMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'

interface RevokeSessionProps {
	id: string
}

export function RevokeSession({ id }: RevokeSessionProps) {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isPending } = useDeleteSessionsByIdMutation({
		mutation: {
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: getGetSessionsQueryQueryKey()
				})
				setIsOpen(false)
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при удалении сессии')
				)
			}
		}
	})

	return (
		<ConfirmDialog
			title='Завершить сеанс на другом устройстве?'
			description='Вы собираетесь выйти с одного из ваших устройств. Вы уверены, что хотите продолжить?'
			confirmText='Выйти с устройства'
			destructive
			handleConfirm={() => mutate({ id })}
			isLoading={isPending}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Button variant='outline' size='sm'>
				Выйти
			</Button>
		</ConfirmDialog>
	)
}
