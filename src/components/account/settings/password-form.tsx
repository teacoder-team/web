'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	usePostUsersMePasswordChangeMutation,
	usePostUsersMePasswordConfirmMutation
} from '@/generated/api'
import type { ChangePasswordPayload, UserResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'
import { setAccessToken } from '@/lib/auth/token'

import { Button } from '../../ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../../ui/dialog'
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

const passwordSchema = z
	.object({
		currentPassword: z.string(),
		newPassword: z
			.string()
			.min(6, {
				message: 'Новый пароль должен содержать хотя бы 6 символов'
			})
			.max(128, {
				message: 'Новый пароль должен содержать не более 128 символов'
			}),
		confirmPassword: z.string()
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export type Password = z.infer<typeof passwordSchema>

interface PasswordFormProps {
	user: UserResponse | undefined
}

export function PasswordForm({ user }: PasswordFormProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isCodeSent, setIsCodeSent] = useState(false)

	const form = useForm<Password>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	})

	const { mutate, isPending } = usePostUsersMePasswordChangeMutation({
		mutation: {
			onSuccess() {
				form.reset()
				setIsCodeSent(true)
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при смене пароля'))
			}
		}
	})

	const { mutate: confirm, isPending: isConfirming } =
		usePostUsersMePasswordConfirmMutation({
			mutation: {
				onSuccess({ accessToken }) {
					// Every session, this one included, was ended - this token opens the new one.
					setAccessToken(accessToken)
					setIsCodeSent(false)
					setIsOpen(false)
					toast.success('Пароль изменён')
				},
				onError(error) {
					toast.error(
						getErrorMessage(error, 'Ошибка при смене пароля')
					)
				}
			}
		})

	function onSubmit({ currentPassword, newPassword }: Password) {
		// The spec drops the optional `currentPassword`, though the API reads it.
		const data: ChangePasswordPayload & { currentPassword?: string } = {
			newPassword,
			currentPassword: user?.hasPassword ? currentPassword : undefined
		}

		mutate({ data })
	}

	return (
		<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
			<div className='mr-5 flex w-full items-start gap-x-4 md:w-auto md:items-center'>
				<div className='hidden rounded-full bg-blue-600 p-2.5 md:flex'>
					<KeyRound className='size-5 stroke-[1.7px] text-white' />
				</div>
				<div className='flex w-full flex-col'>
					<h2 className='mb-1 font-semibold'>Пароль</h2>
					<p className='text-sm text-muted-foreground'>
						Пароль — ключ к вашей учетной записи. Никому его не
						сообщайте. При необходимости вы можете изменить его
						здесь для повышения безопасности.
					</p>
				</div>
			</div>
			<div>
				<Dialog
					open={isOpen}
					onOpenChange={state => {
						form.reset()
						setIsCodeSent(false)
						setIsOpen(state)
					}}
				>
					<DialogTrigger asChild>
						<Button variant='outline'>Изменить</Button>
					</DialogTrigger>
					<DialogContent>
						{isCodeSent ? (
							<ConfirmCodeStep
								title='Обновление пароля'
								description={`Мы отправили 6-значный код на ${user?.email ?? 'вашу почту'}.`}
								isLoading={isConfirming}
								onSubmit={code => confirm({ data: { code } })}
							/>
						) : (
							<>
								<DialogHeader>
									<DialogTitle>Обновление пароля</DialogTitle>
									<DialogDescription>
										{user?.hasPassword
											? 'Введите текущий и новый пароль для обновления.'
											: 'Введите новый пароль.'}
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='grid gap-4'
									>
										{user?.hasPassword && (
											<FormField
												control={form.control}
												name='currentPassword'
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Текущий пароль
														</FormLabel>
														<FormControl>
															<Input
																type='password'
																placeholder='******'
																disabled={
																	isPending
																}
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
										<FormField
											control={form.control}
											name='newPassword'
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Новый пароль
													</FormLabel>
													<FormControl>
														<Input
															type='password'
															placeholder='******'
															disabled={isPending}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='confirmPassword'
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Подтвердите новый пароль
													</FormLabel>
													<FormControl>
														<Input
															type='password'
															placeholder='******'
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
