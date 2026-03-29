import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
	'inline-flex cursor-pointer items-center justify-center rounded-[10px] font-normal leading-relaxed transition-all duration-150 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				'primary-light': 'bg-primary/10 text-primary hover:bg-primary/15',
				outline:
					'border border-border bg-transparent text-muted-foreground hover:border-primary hover:text-primary',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				'destructive-light':
					'bg-destructive/5 text-destructive hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15',
				ghost: 'bg-transparent text-primary hover:bg-primary/5'
			},
			size: {
				sm: 'h-8 rounded-lg px-2 text-[13px]',
				md: 'h-10 px-4 text-sm',
				'md-plus': 'h-9 rounded-lg px-4 text-sm',
				lg: 'h-12 px-6 text-lg',
				icon: 'h-10 w-10 p-0'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
