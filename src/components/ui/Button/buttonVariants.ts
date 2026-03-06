import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
	"inline-flex items-center justify-center font-normal leading-relaxed rounded-[10px] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				"primary-light": "bg-primary/10 text-primary hover:bg-primary/15",
				outline:
					"border border-border text-muted-foreground bg-transparent hover:text-primary hover:border-primary",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				"destructive-light":
					"bg-destructive/5 text-destructive hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/15",
				ghost: "text-primary bg-transparent hover:bg-primary/5",
			},
			size: {
				sm: "h-8 px-2 text-[13px] rounded-lg",
				md: "h-10 px-4 text-sm",
				"md-plus": "h-9 px-4 text-sm rounded-lg",
				lg: "h-12 px-6 text-lg",
				icon: "w-10 h-10 p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
