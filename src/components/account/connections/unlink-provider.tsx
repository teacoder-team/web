'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetAuthSsoAccountsQueryQueryKey,
	useDeleteAuthSsoAccountsByProviderMutation
} from '@/generated/api'

import type { SsoProvider } from '@/constants/sso-providers'

import { getErrorMessage } from '@/lib/api/errors'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'

interface UnlinkProviderProps {
	provider: SsoProvider
}

export function UnlinkProvider({ provider }: UnlinkProviderProps) {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient()

	const { mutate, isPending } = useDeleteAuthSsoAccountsByProviderMutation({
		mutation: {
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: getGetAuthSsoAccountsQueryQueryKey()
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
			title={`Отключить ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
			description={`Вы уверены, что хотите отключить аккаунт ${provider.charAt(0).toUpperCase() + provider.slice(1)}? После этого вы не сможете входить с его помощью.`}
			confirmText='Отключить'
			destructive
			handleConfirm={() => mutate({ provider })}
			isLoading={isPending}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Button variant='outline'>Отвязать</Button>
		</ConfirmDialog>
	)
}
