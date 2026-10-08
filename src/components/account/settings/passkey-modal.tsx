'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
	Calendar,
	KeyRound,
	Loader2,
	MoreHorizontal,
	Trash
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	getGetAuthWebauthnCredentialsQueryQueryKey,
	getGetMfaQueryQueryKey,
	useDeleteAuthWebauthnCredentialsByIdMutation,
	useGetAuthWebauthnCredentialsQuery
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { formatDate } from '@/lib/utils'

import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../../ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../../ui/dropdown-menu'

export function PasskeyModal() {
	const [isOpen, setIsOpen] = useState(false)

	const [deletePasskeyId, setDeletePasskeyId] = useState<string | null>(null)

	const queryClient = useQueryClient()

	const { data, isLoading } = useGetAuthWebauthnCredentialsQuery({
		query: { enabled: isOpen }
	})

	const { mutate, isPending } = useDeleteAuthWebauthnCredentialsByIdMutation({
		mutation: {
			onSuccess() {
				setIsOpen(false)
				queryClient.invalidateQueries({
					queryKey: getGetMfaQueryQueryKey()
				})
				queryClient.invalidateQueries({
					queryKey: getGetAuthWebauthnCredentialsQueryQueryKey()
				})
				setDeletePasskeyId(null)
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при удалении ключа'))
			}
		}
	})

	return (
		<>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button variant='outline'>Просмотреть ключи</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Ваши ключи доступа</DialogTitle>
						<DialogDescription>
							Список всех добавленных ключей доступа для вашего
							аккаунта.
						</DialogDescription>
					</DialogHeader>

					{isLoading ? (
						<div className='flex items-center justify-center py-6'>
							<Loader2 className='size-10 animate-spin text-muted-foreground' />
						</div>
					) : (
						<div className='my-2'>
							{!!data?.length && (
								<div className='grid max-h-[300px] gap-3 overflow-y-auto pr-1'>
									{data?.map((passkey, index) => (
										<Card
											key={index}
											className='p-4 transition-colors hover:bg-muted/20'
										>
											<div className='flex items-start justify-between'>
												<div className='flex items-start gap-3'>
													<div className='flex items-center justify-center rounded-full bg-blue-600 p-2'>
														<KeyRound className='h-4 w-4 text-white' />
													</div>
													<div>
														<h4 className='text-sm font-medium'>
															{passkey.name}
														</h4>
														<div className='mt-2 space-y-1'>
															<div className='flex items-center text-xs text-muted-foreground'>
																<Calendar className='mr-1.5 h-3.5 w-3.5' />
																<span>
																	Добавлен:{' '}
																	{formatDate(
																		passkey.createdAt
																	)}
																</span>
															</div>
															<div className='flex items-center text-xs text-muted-foreground'>
																<Calendar className='mr-1.5 h-3.5 w-3.5' />
																<span>
																	Последнее
																	использование:{' '}
																	{passkey.lastUsedAt
																		? formatDate(
																				passkey.lastUsedAt
																			)
																		: 'ещё не использовался'}
																</span>
															</div>
														</div>
													</div>
												</div>
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>
																Действия
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															className='text-destructive focus:text-destructive'
															onClick={() =>
																setDeletePasskeyId(
																	passkey.id
																)
															}
														>
															<Trash className='mr-2 h-4 w-4' />
															Удалить
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</Card>
									))}
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!deletePasskeyId}
				onOpenChange={() => setDeletePasskeyId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Удалить ключ доступа</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите удалить этот ключ доступа?
							Это действие нельзя отменить.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDeletePasskeyId(null)}
						>
							Отмена
						</Button>
						<Button
							variant='destructive'
							onClick={() =>
								deletePasskeyId &&
								mutate({ id: deletePasskeyId })
							}
							isLoading={isPending}
						>
							Удалить
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
