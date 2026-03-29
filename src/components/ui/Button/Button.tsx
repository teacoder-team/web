import { Slot, Slottable } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'

import { type ButtonVariants, buttonVariants } from './buttonVariants'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
	asChild?: boolean
	isLoading?: boolean
}

export const Button = ({
	variant,
	size,
	children,
	className,
	asChild,
	isLoading,
	disabled,
	...props
}: ButtonProps) => {
	const classes = cn(buttonVariants({ variant, size }), className)

	const Comp = asChild ? Slot : 'button'

	return (
		<Comp className={classes} disabled={isLoading ?? disabled} {...props}>
			<Slottable>{children}</Slottable>
		</Comp>
	)
}
