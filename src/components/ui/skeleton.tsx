import type { HTMLAttributes } from 'react'

import { cn } from '@/src/lib/utils'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-lg bg-foreground/6', className)}
			{...props}
		/>
	)
}

export { Skeleton }
