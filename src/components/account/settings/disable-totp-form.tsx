'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	getGetMfaQueryQueryKey,
	usePostMfaTotpDisableMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'

import { ConfirmDialog } from '../../shared/confirm-dialog'
import { Button } from '../../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../../ui/form'
import { Input } from '../../ui/input'

const disableTotpSchema = z.object({
	code: z
		.string()
		.trim()
		.min(6, { message: 'Введите код из приложения или резервный код' })
})

export type DisableTotp = z.infer<typeof disableTotpSchema>

export function DisableTotpForm() {
	const [isOpen, setIsOpen] = useState(false)

	const queryClient = useQueryClient()

	const form = useForm<DisableTotp>({
		resolver: zodResolver(disableTotpSchema),
		defaultValues: {
			code: ''
		}
	})

	const { mutate, isPending } = usePostMfaTotpDisableMutation({
		mutation: {
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: getGetMfaQueryQueryKey()
				})
				form.reset()
				setIsOpen(false)
			},
			onError(error) {
				toast.error(getErrorMessage(error, 'Ошибка при отключении'))
			}
		}
	})

	function onSubmit(data: DisableTotp) {
		mutate({ data })
	}

	return (
		<ConfirmDialog
			title='Отключение двухфакторной аутентификации'
			description={
				<div className='space-y-4'>
					<p className='mb-2'>
						Вы уверены, что хотите отключить этот метод
						двухфакторной аутентификации?{' '}
					</p>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='mt-2'
						>
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem className='text-foreground'>
										<FormLabel>
											Код из приложения или резервный код
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
						</form>
					</Form>
				</div>
			}
			confirmText='Отключить'
			destructive
			handleConfirm={form.handleSubmit(onSubmit)}
			isLoading={isPending}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Button variant='destructive'>Отключить</Button>
		</ConfirmDialog>
	)
}
