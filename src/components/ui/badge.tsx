import { type VariantProps, cva } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/src/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center gap-x-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none [&_svg]:size-3.5 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-brand-soft text-brand',
				neutral: 'bg-secondary text-secondary-foreground',
				outline:
					'bg-transparent text-muted-foreground ring-1 ring-inset ring-border',
				success: 'bg-success-soft text-success',
				error: 'bg-destructive-soft text-destructive',
				warning: 'bg-warning-soft text-warning',
				solid: 'bg-primary text-primary-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

interface BadgeProps
	extends ComponentPropsWithoutRef<'span'>,
		VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant, ...props }: BadgeProps, forwardedRef) => {
		return (
			<span
				ref={forwardedRef}
				className={cn(badgeVariants({ variant }), className)}
				{...props}
			/>
		)
	}
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants, type BadgeProps }
