'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Loader2, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	getGetMfaQueryQueryKey,
	usePostMfaTotpSetupMutation,
	usePostMfaTotpVerifyMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { downloadRecoveryCodes } from '@/lib/utils'

import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Badge } from '../../ui/badge'
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

import { RecoveryCodesList } from './recovery-codes-list'

const enableTotpSchema = z.object({
	pin: z
		.string()
		.min(6, {
			message: 'PIN-код должен содержать минимум 6 символов'
		})
		.max(6, { message: 'PIN-код должен содержать не более 6 символов' })
})

export type EnableTotp = z.infer<typeof enableTotpSchema>

export function EnableTotpForm() {
	const [isOpen, setIsOpen] = useState(false)
	const [step, setStep] = useState(1)
	const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

	const [isCopied, setIsCopied] = useState(false)

	const queryClient = useQueryClient()

	const {
		mutate: setup,
		data: totp,
		isPending: isLoadingGenerate
	} = usePostMfaTotpSetupMutation({
		mutation: {
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при подключении приложения')
				)
			}
		}
	})

	const { mutate, isPending } = usePostMfaTotpVerifyMutation({
		mutation: {
			onSuccess(data) {
				setRecoveryCodes(data.codes)
				queryClient.invalidateQueries({
					queryKey: getGetMfaQueryQueryKey()
				})
				setStep(2)
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при верификации кода')
				)
			}
		}
	})

	const form = useForm<EnableTotp>({
		resolver: zodResolver(enableTotpSchema),
		defaultValues: {
			pin: ''
		}
	})

	function onCopy() {
		if (!totp?.secret) return

		setIsCopied(true)
		navigator.clipboard.writeText(totp?.secret)
		setTimeout(() => {
			setIsCopied(false)
		}, 2000)
	}

	function onCopyCodes() {
		if (!recoveryCodes) return

		navigator.clipboard.writeText(recoveryCodes.join('\n'))
		toast.success('Коды скопированы')
	}

	const Icon = isCopied ? Check : Copy

	useEffect(() => {
		if (isOpen) {
			setup()
		}
	}, [setup, isOpen])

	function onSubmit(data: EnableTotp) {
		mutate({ data: { code: data.pin } })
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={state => {
				form.reset()
				setStep(1)
				setRecoveryCodes(null)
				setIsOpen(state)
			}}
		>
			<DialogTrigger asChild>
				<Button variant='primary'>Включить</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[550px] p-0'>
				<DialogHeader className='p-7 pb-0'>
					<DialogTitle>
						{step === 1
							? 'Приложения для аутентификации'
							: 'Коды восстановления'}
					</DialogTitle>
					<DialogDescription>
						{step === 1
							? 'При каждом входе в аккаунт, кроме пароля, потребуется одноразовый код из приложения-аутентификатора.'
							: 'Эти коды помогут вам получить доступ к учетной записи, если вы потеряете доступ к устройству и не сможете получать коды двухфакторной аутентификации.'}
					</DialogDescription>
				</DialogHeader>

				{isLoadingGenerate ? (
					<div className='flex items-center justify-center py-6'>
						<Loader2 className='size-10 animate-spin text-muted-foreground' />
					</div>
				) : (
					step === 1 && (
						<div className='flex flex-col space-y-5'>
							<div>
								<div className='flex items-center gap-2 px-7 font-medium'>
									<Badge>Шаг 1</Badge>
									Отсканируйте QR-код
								</div>
								<p className='mt-2 px-7 text-sm text-muted-foreground'>
									Отсканируйте QR-код ниже или введите
									секретный ключ вручную в
									приложение-аутентификатор.
								</p>
								<div className='mt-4 grid grid-cols-2 items-center border bg-stone-200 px-7 py-4 dark:bg-accent'>
									<img
										src={totp?.qrCodeUrl}
										alt='QR-код'
										className='w-fit rounded-lg'
									/>
									<div>
										<h3 className='font-medium'>
											Проблемы с QR-кодом?
										</h3>
										<p className='mt-1 text-sm text-muted-foreground'>
											Введите секретный ключ вручную:
										</p>
										<div className='mt-2 h-8 w-full rounded-lg border border-input bg-background px-3 py-1.5 text-[13px]'>
											{totp?.secret}
										</div>
										<Button
											onClick={onCopy}
											variant='outline'
											size='xs'
											className='mt-2 hover:bg-popover'
											disabled={
												!totp?.secret ||
												isCopied ||
												isPending
											}
										>
											<Icon />
											Копировать
										</Button>
									</div>
								</div>
							</div>
							<div className='px-7'>
								<div className='flex items-center gap-2 font-medium'>
									<Badge>Шаг 2</Badge>
									Верификация кода
								</div>
								<p className='mt-2 text-sm text-muted-foreground'>
									Введите шестизначный код из приложения.
								</p>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='mt-4'
									>
										<FormField
											control={form.control}
											name='pin'
											render={({ field }) => (
												<FormItem className='flex flex-col justify-center max-sm:items-center'>
													<FormLabel>
														Введите код
													</FormLabel>
													<FormControl>
														<Input
															placeholder='XXXXXX'
															disabled={isPending}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<DialogFooter className='mt-5 pb-7'>
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
												Продолжить
											</Button>
										</DialogFooter>
									</form>
								</Form>
							</div>
						</div>
					)
				)}

				{step === 2 && recoveryCodes && (
					<div className='flex flex-col space-y-5 px-7'>
						<Alert variant='warning'>
							<TriangleAlert className='size-5 dark:text-yellow-500' />
							<AlertTitle className='ml-1.5'>
								Пожалуйста, храните их в безопасном месте.
							</AlertTitle>
							<AlertDescription className='ml-1.5'>
								Они — последний способ восстановления доступа к
								учетной записи.
							</AlertDescription>
						</Alert>
						<RecoveryCodesList
							codes={recoveryCodes}
							className='mt-4 flex justify-center gap-16 rounded-lg bg-accent p-3'
						/>
						<DialogFooter className='flex gap-x-2 pb-7 sm:justify-between'>
							<DialogClose asChild>
								<Button variant='outline' className='h-9'>
									Закрыть
								</Button>
							</DialogClose>
							<div className='flex items-center gap-2'>
								<Button
									variant='outline'
									className='h-9'
									onClick={onCopyCodes}
								>
									Копировать
								</Button>
								<Button
									variant='primary'
									className='h-9'
									onClick={() =>
										downloadRecoveryCodes(recoveryCodes)
									}
								>
									Скачать
								</Button>
							</div>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
