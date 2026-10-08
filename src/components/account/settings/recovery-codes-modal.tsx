'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Download, RotateCcw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetMfaQueryQueryKey,
	useGetMfaRecoveryCodesQuery,
	usePostMfaRecoveryCodesMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { downloadRecoveryCodes } from '@/lib/utils'

import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Button } from '../../ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Separator } from '../../ui/separator'

import { RecoveryCodesList } from './recovery-codes-list'

interface RecoveryCodesModalProps {
	/** Codes that were just issued (first security key) - opens the dialog with them. */
	issuedCodes?: string[] | null
	onClose?: () => void
}

export function RecoveryCodesModal({
	issuedCodes,
	onClose
}: RecoveryCodesModalProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [regeneratedCodes, setRegeneratedCodes] = useState<string[] | null>(
		null
	)
	const [code, setCode] = useState('')

	const queryClient = useQueryClient()

	const codes = issuedCodes ?? regeneratedCodes

	const { data: status } = useGetMfaRecoveryCodesQuery({
		query: { enabled: isOpen && !codes }
	})

	const { mutate: regenerate, isPending } = usePostMfaRecoveryCodesMutation({
		mutation: {
			onSuccess(data) {
				setCode('')
				setRegeneratedCodes(data.codes)
				queryClient.invalidateQueries({
					queryKey: getGetMfaQueryQueryKey()
				})
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при генерации новых кодов')
				)
			}
		}
	})

	function handleOpenChange(open: boolean) {
		setIsOpen(open)

		if (!open) {
			setCode('')
			setRegeneratedCodes(null)
			onClose?.()
		}
	}

	return (
		<Dialog open={isOpen || !!issuedCodes} onOpenChange={handleOpenChange}>
			{issuedCodes === undefined && (
				<DialogTrigger asChild>
					<Button variant='outline'>Просмотреть</Button>
				</DialogTrigger>
			)}
			<DialogContent className='w-[500px]'>
				<DialogTitle>Коды восстановления</DialogTitle>
				<DialogDescription>
					Эти коды помогут вам получить доступ к учетной записи, если
					вы потеряете доступ к устройству и не сможете получать коды
					двухфакторной аутентификации.
				</DialogDescription>
				<Alert variant='warning'>
					<TriangleAlert className='size-5 dark:text-yellow-500' />
					<AlertTitle className='ml-1.5'>
						Пожалуйста, храните их в безопасном месте.
					</AlertTitle>
					<AlertDescription className='ml-1.5'>
						Они — последний способ восстановления доступа к учетной
						записи.
					</AlertDescription>
				</Alert>
				{codes ? (
					<RecoveryCodesList
						codes={codes}
						className='flex justify-center gap-10'
					/>
				) : (
					<div className='space-y-3'>
						<p className='text-sm text-muted-foreground'>
							{status
								? `Осталось ${status.remaining} из ${status.total} кодов. `
								: ''}
							Коды показываются только один раз. Чтобы получить
							новые, введите код из приложения или резервный код и
							нажмите «Сбросить».
						</p>
						<Input
							placeholder='Код из приложения или резервный код'
							value={code}
							onChange={e => setCode(e.target.value)}
							className='font-mono'
							autoComplete='one-time-code'
							disabled={isPending}
						/>
					</div>
				)}
				<Separator />
				<DialogFooter>
					{!issuedCodes && (
						<Button
							variant='outline'
							className='h-9'
							onClick={() =>
								regenerate({ data: { code: code.trim() } })
							}
							disabled={!!codes || code.trim().length < 6}
							isLoading={isPending}
						>
							<RotateCcw className='size-3' />
							Сбросить
						</Button>
					)}
					<Button
						variant='primary'
						className='h-9'
						onClick={() => codes && downloadRecoveryCodes(codes)}
						disabled={!codes}
					>
						<Download className='size-3' />
						Скачать
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
