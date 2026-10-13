import { Slot, Slottable } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'

import { cn } from '@/src/lib/utils'

const buttonVariants = cva(
	'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,color,border-color,transform] duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg:last-child:not(:first-child)]:transition-transform [&>svg:last-child:not(:first-child)]:duration-200 [&>svg:last-child:not(:first-child)]:hover:translate-x-0.5',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				// Kept as an alias of `default` for existing call sites
				primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
				ink: 'bg-foreground text-background hover:bg-foreground/85',
				// Ice-blue pill for dark grainy panels
				highlight:
					'bg-highlight text-inverse hover:bg-highlight/85',
				// Translucent pill for dark panels
				glass: 'border border-inverse-foreground/15 bg-inverse-foreground/6 text-inverse-foreground backdrop-blur-md hover:bg-inverse-foreground/12',
				// Light button for use on top of primary-filled blocks
				contrast:
					'bg-primary-foreground text-primary hover:bg-primary-foreground/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-border bg-transparent text-foreground hover:bg-secondary/80',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-accent',
				ghost: 'text-foreground hover:bg-secondary',
				link: 'h-auto rounded-sm px-0 text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand active:scale-100'
			},
			size: {
				default: 'h-10 px-5',
				sm: 'h-9 px-4',
				xs: 'h-8 px-3 text-xs',
				lg: 'h-12 px-6 text-[15px]',
				xl: 'h-14 px-7 text-base',
				icon: 'size-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	isLoading?: boolean
	children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			children,
			isLoading = false,
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading ?? props.disabled}
				{...props}
			>
				{isLoading && <Loader2 className='animate-spin' />}
				<Slottable>{children}</Slottable>
			</Comp>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
