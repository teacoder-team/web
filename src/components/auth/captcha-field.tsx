'use client'

import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import { Captcha, useCaptchaRequired } from '@/lib/captcha/captcha'

import { FormControl, FormField, FormItem } from '../ui/form'

interface CaptchaFieldProps<T extends FieldValues> {
	control: Control<T>
	name: FieldPath<T>
	/** Changing it remounts the widget - a token is single-use. */
	resetKey: number
	className?: string
}

export function CaptchaField<T extends FieldValues>({
	control,
	name,
	resetKey,
	className
}: CaptchaFieldProps<T>) {
	const isRequired = useCaptchaRequired()

	if (!isRequired) {
		return null
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormControl>
						<Captcha
							key={resetKey}
							onVerify={field.onChange}
							onExpire={() => field.onChange('')}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}
