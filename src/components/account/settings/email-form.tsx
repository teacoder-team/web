'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Mail, MoreHorizontal, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	getGetUsersMeQueryQueryKey,
	usePostUsersMeEmailChangeMutation,
	usePostUsersMeEmailConfirmMutation
} from '@/generated/api'
import type { UserResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../../ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../../ui/form'
import { Input } from '../../ui/input'

import { ConfirmCodeStep } from './confirm-code-step'

const emailSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email обязателен' })
		.email({ message: 'Введите корректный адрес электронной почты' })
})

export type Email = z.infer<typeof emailSchema>

interface EmailFormProps {
	user: UserResponse | undefined
}

export function EmailForm({ user }: EmailFormProps) {
	const [isOpen, setIsOpen] = useState(false)
	/** Where the confirmation code went - the dialog shows the code step. */
	const [pendingEmail, setPendingEmail] = useState<string | null>(null)

	const queryClient = useQueryClient()

	const form = useForm<Email>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: ''
		}
	})

	const { mutate: change, isPending } = usePostUsersMeEmailChangeMutation({
		mutation: {
			onSuccess(_, { data }) {
				form.reset()
				setPendingEmail(data.newEmail)
				setIsOpen(true)
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при смене почты'))
			}
		}
	})

	const { mutate: confirm, isPending: isConfirming } =
		usePostUsersMeEmailConfirmMutation({
			mutation: {
				onSuccess() {
					setPendingEmail(null)
					setIsOpen(false)
					queryClient.invalidateQueries({
						queryKey: getGetUsersMeQueryQueryKey()
					})
				},
				onError(error) {
					toast.error(
						getErrorMessage(error, 'Ошибка при смене почты')
					)
				}
			}
		})

	/** Confirming the current address is a "change" to the same one. */
	function requestChange(newEmail: string) {
		change({ data: { newEmail } })
	}

	function onSubmit(data: Email) {
		requestChange(data.email)
	}

	return (
		<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
			<div className='mr-5 flex w-full items-start gap-x-4 md:w-auto md:items-center'>
				<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
					<Mail className='size-5 stroke-[1.7px] text-white' />
				</div>
				<div className='flex w-full flex-col'>
					<div className='mb-1 flex items-center gap-2'>
						<h2 className='font-semibold'>Почта</h2>
						{user?.email ? (
							user.emailVerifiedAt ? (
								<Badge variant='success'>Подтверждена</Badge>
							) : (
								<Badge variant='error'>Не подтверждена</Badge>
							)
						) : (
							<Badge variant='warning'>Не указана</Badge>
						)}
					</div>
					{user?.email ? (
						<p className='text-sm text-muted-foreground'>
							Ваша учетная запись привязана к адресу{' '}
							<span className='font-medium text-primary'>
								{user.email}
							</span>
							. На него мы отправляем уведомления и важную
							информацию.
						</p>
					) : (
						<p className='text-sm text-muted-foreground'>
							У вашей учетной записи пока нет почты. Добавьте её,
							чтобы получать уведомления и иметь возможность
							восстановить доступ.
						</p>
					)}
				</div>
			</div>
			<div>
				{user?.email ? (
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							className='border-none ring-0'
						>
							<Button variant='ghost' size='icon'>
								<MoreHorizontal className='size-5' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' side='top'>
							<DropdownMenuGroup>
								{!user.emailVerifiedAt && (
									<DropdownMenuItem
										onClick={() =>
											user.email &&
											requestChange(user.email)
										}
									>
										<CheckCircle />
										Подтвердить
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									onClick={() => setIsOpen(true)}
								>
									<Pencil />
									Изменить
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Button variant='outline' onClick={() => setIsOpen(true)}>
						Привязать
					</Button>
				)}

				<Dialog
					open={isOpen}
					onOpenChange={state => {
						form.reset()
						setPendingEmail(null)
						setIsOpen(state)
					}}
				>
					<DialogContent>
						{pendingEmail ? (
							<ConfirmCodeStep
								title='Обновление почты'
								description={`Мы отправили 6-значный код на ${pendingEmail}.`}
								isLoading={isConfirming}
								onSubmit={code => confirm({ data: { code } })}
							/>
						) : (
							<>
								<DialogHeader>
									<DialogTitle>Обновление почты</DialogTitle>
									<DialogDescription>
										Введите новый почтовый адрес.
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='grid gap-4'
									>
										<FormField
											control={form.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Почта</FormLabel>
													<FormControl>
														<Input
															placeholder={
																user?.email ??
																undefined
															}
															disabled={isPending}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant='outline'>
													Отмена
												</Button>
											</DialogClose>
											<Button
												type='submit'
												variant='primary'
												isLoading={isPending}
											>
												Обновить
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
