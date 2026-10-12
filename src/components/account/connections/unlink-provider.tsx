'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetAuthSsoAccountsQueryQueryKey,
	useDeleteAuthSsoAccountsByProviderMutation
} from '@/generated/api'

import { SSO_PROVIDERS, type SsoProvider } from '@/constants/sso-providers'

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

	const name = SSO_PROVIDERS[provider].name

	return (
		<ConfirmDialog
			title={`Отвязать ${name}?`}
			description={`После этого вы не сможете входить в TeaCoder через ${name}. Привязать аккаунт снова можно в любой момент.`}
			confirmText='Отключить'
			destructive
			handleConfirm={() => mutate({ provider })}
			isLoading={isPending}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Button variant='ghost'>Отвязать</Button>
		</ConfirmDialog>
	)
}
