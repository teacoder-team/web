'use client'

import { useState } from 'react'

import { OtpInput } from '../../shared/otp-input'
import { Button } from '../../ui/button'
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../../ui/dialog'
import { Label } from '../../ui/label'

interface ConfirmCodeStepProps {
	title: string
	description: string
	isLoading: boolean
	onSubmit: (code: string) => void
}

/** Second step of a settings dialog: the 6-digit code sent by email. */
export function ConfirmCodeStep({
	title,
	description,
	isLoading,
	onSubmit
}: ConfirmCodeStepProps) {
	const [code, setCode] = useState('')

	return (
		<>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<div className='grid gap-4'>
				<div className='space-y-2'>
					<Label>Код подтверждения</Label>
					<OtpInput
						value={code}
						onChange={setCode}
						disabled={isLoading}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Отмена</Button>
					</DialogClose>
					<Button
						variant='primary'
						onClick={() => onSubmit(code)}
						disabled={code.length !== 6}
						isLoading={isLoading}
					>
						Подтвердить
					</Button>
				</DialogFooter>
			</div>
		</>
	)
}
