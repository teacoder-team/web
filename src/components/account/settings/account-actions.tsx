'use client'

import { LogOut } from 'lucide-react'
import { useState } from 'react'

import { useSignOut } from '@/lib/auth/use-sign-out'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'
import { SettingsRow } from '../account-ui'

export function AccountActions() {
	const [isOpen, setIsOpen] = useState(false)

	const { mutate } = useSignOut(() => setIsOpen(false))

	return (
		<SettingsRow
			icon={<LogOut />}
			title='Выход'
			description='Завершите сеанс, чтобы выйти из аккаунта на этом устройстве.'
		>
			<ConfirmDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				title='Выйти из аккаунта?'
				description='Вы уверены, что хотите завершить сеанс и выйти из аккаунта?'
				confirmText='Выйти'
				destructive
				handleConfirm={() => mutate()}
			>
				<Button variant='outline'>Выйти</Button>
			</ConfirmDialog>
		</SettingsRow>
	)
}
