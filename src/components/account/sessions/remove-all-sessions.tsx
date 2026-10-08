'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetSessionsQueryQueryKey,
	useDeleteSessionsMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'

export function RemoveAllSessions() {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isPending } = useDeleteSessionsMutation({
		mutation: {
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: getGetSessionsQueryQueryKey()
				})
				setIsOpen(false)
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при отключении'))
			}
		}
	})

	return (
		<ConfirmDialog
			title='Выйти из всех устройств?'
			description='Вы будете разлогинены на всех устройствах, кроме текущего. Вы уверены, что хотите продолжить?'
			confirmText='Удалить все сессии'
			destructive
			handleConfirm={() => mutate()}
			isLoading={isPending}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Button variant='outline' size='sm'>
				Выйти на всех устройствах
			</Button>
		</ConfirmDialog>
	)
}
