'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef
} from 'react'

import { cn } from '@/src/lib/utils'

const Progress = forwardRef<
	ComponentRef<typeof ProgressPrimitive.Root>,
	ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			'relative h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]',
			className
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className='h-full w-full flex-1 rounded-full bg-primary transition-transform duration-500 ease-out'
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
