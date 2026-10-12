'use client'

import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
import { type ComponentProps, useContext } from 'react'

import { cn } from '@/src/lib/utils'

function InputOTP({
	className,
	containerClassName,
	...props
}: ComponentProps<typeof OTPInput> & {
	containerClassName?: string
}) {
	return (
		<OTPInput
			data-slot='input-otp'
			containerClassName={cn(
				'flex w-full items-center gap-2 has-disabled:opacity-50',
				containerClassName
			)}
			className={cn('disabled:cursor-not-allowed', className)}
			{...props}
		/>
	)
}

function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot='input-otp-group'
			className={cn('flex w-full items-center gap-2 sm:gap-3', className)}
			{...props}
		/>
	)
}

function InputOTPSlot({
	index,
	className,
	...props
}: ComponentProps<'div'> & {
	index: number
}) {
	const inputOTPContext = useContext(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

	return (
		<div
			data-slot='input-otp-slot'
			data-active={isActive}
			className={cn(
				'data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive shadow-xs relative flex h-14 min-w-0 flex-1 items-center justify-center rounded-xl border border-border bg-input font-mono text-lg outline-none transition-all data-[active=true]:z-10 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/15',
				className
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div className='animate-caret-blink h-4 w-px bg-foreground duration-1000' />
				</div>
			)}
		</div>
	)
}

function InputOTPSeparator({ ...props }: ComponentProps<'div'>) {
	return (
		<div data-slot='input-otp-separator' role='separator' {...props}>
			<MinusIcon />
		</div>
	)
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
