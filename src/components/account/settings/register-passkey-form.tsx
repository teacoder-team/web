'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	getGetAuthWebauthnCredentialsQueryQueryKey,
	getGetMfaQueryQueryKey,
	postAuthWebauthnRegisterOptionsMutation,
	postAuthWebauthnRegisterVerifyMutation
} from '@/generated/api'

import { getErrorMessage } from '@/lib/api/errors'
import { isWebAuthnCancelled, registerKey } from '@/lib/webauthn/webauthn'

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

import { RecoveryCodesModal } from './recovery-codes-modal'

const registerPasskeySchema = z.object({
	name: z
		.string()
		.min(1, {
			message: 'Название устройства обязательно'
		})
		.max(50, {
			message: 'Название устройства не должно превышать 50 символов'
		})
})

export type RegisterPasskey = z.infer<typeof registerPasskeySchema>

export function RegisterPasskeyForm() {
	const [isOpen, setIsOpen] = useState(false)
	/** The first second factor comes with recovery codes, shown once. */
	const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

	const queryClient = useQueryClient()

	const form = useForm<RegisterPasskey>({
		resolver: zodResolver(registerPasskeySchema),
		defaultValues: {
			name: ''
		}
	})

	const { mutate, isPending } = useMutation({
		mutationFn: async ({ name }: RegisterPasskey) => {
			const options = await postAuthWebauthnRegisterOptionsMutation()
			const response = await registerKey(options)

			return postAuthWebauthnRegisterVerifyMutation({ response, name })
		},
		onSuccess(data) {
			form.reset()
			queryClient.invalidateQueries({
				queryKey: getGetMfaQueryQueryKey()
			})
			queryClient.invalidateQueries({
				queryKey: getGetAuthWebauthnCredentialsQueryQueryKey()
			})
			setIsOpen(false)
			setRecoveryCodes(data.recoveryCodes)
		},
		onError(error) {
			if (!isWebAuthnCancelled(error)) {
				toast.error(
					getErrorMessage(error, 'Ошибка при создании ключа доступа')
				)
			}
		}
	})

	function onSubmit(data: RegisterPasskey) {
		mutate(data)
	}

	return (
		<>
			<Dialog
				open={isOpen}
				onOpenChange={state => {
					form.reset()
					setIsOpen(state)
				}}
			>
				<DialogTrigger asChild>
					<Button variant='primary'>Добавить</Button>
				</DialogTrigger>
				<DialogContent className='max-w-[550px] p-0'>
					<DialogHeader className='p-6 pb-0'>
						<DialogTitle>Регистрация ключа доступа</DialogTitle>
						<DialogDescription>
							Введите название устройства для регистрации ключа
							доступа.
						</DialogDescription>
					</DialogHeader>

					<div className='px-6'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Название устройства
											</FormLabel>
											<FormControl>
												<Input
													placeholder='MacBook Pro'
													disabled={isPending}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter className='mt-6 pb-6'>
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
										Добавить
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>
			<RecoveryCodesModal
				issuedCodes={recoveryCodes}
				onClose={() => setRecoveryCodes(null)}
			/>
		</>
	)
}
