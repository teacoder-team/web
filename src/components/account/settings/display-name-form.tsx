'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
	getGetUsersMeQueryQueryKey,
	usePatchUsersMeMutation
} from '@/generated/api'
import type { UserResponse } from '@/generated/model'

import { getErrorMessage } from '@/lib/api/errors'

import { Button } from '../../ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../../ui/form'
import { Input } from '../../ui/input'

const displayNameSchema = z.object({
	displayName: z.string({ message: 'Имя обязательно' })
})

export type DisplayName = z.infer<typeof displayNameSchema>

interface DisplayNameFormProps {
	user: UserResponse | undefined
}

export function DisplayNameForm({ user }: DisplayNameFormProps) {
	const queryClient = useQueryClient()

	const { mutate, isPending } = usePatchUsersMeMutation({
		mutation: {
			onSuccess(data) {
				queryClient.setQueryData(getGetUsersMeQueryQueryKey(), data)
				toast.success('Профиль обновлён')
			},
			onError(error) {
				toast.error(
					getErrorMessage(error, 'Ошибка при обновлении профиля')
				)
			}
		}
	})

	const form = useForm<DisplayName>({
		resolver: zodResolver(displayNameSchema),
		values: {
			displayName: user?.displayName ?? ''
		}
	})

	const { isDirty } = form.formState

	function onSubmit(data: DisplayName) {
		mutate({ data })
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid gap-4'
				>
					<FormField
						control={form.control}
						name='displayName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ваше имя</FormLabel>
								<FormControl>
									<div className='relative'>
										<Input
											placeholder='Tony Stark'
											disabled={isPending}
											{...field}
										/>
										{isDirty && (
											<div className='absolute bottom-0 right-0 flex h-full items-center justify-center px-2'>
												<Button
													variant='primary'
													className='h-6 rounded-lg px-3 text-xs'
													isLoading={isPending}
												>
													Сохранить
												</Button>
											</div>
										)}
									</div>
								</FormControl>
								<FormDescription>
									Измените ваше имя на любое, какое захотите.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	)
}
