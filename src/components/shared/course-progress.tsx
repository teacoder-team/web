import { cn } from '@/lib/utils'

import { Progress } from '../ui/progress'

interface CourseProgressProps {
	progress: number
	variant?: 'default' | 'success'
	size?: 'default' | 'sm'
	isShowPercentage?: boolean
	label?: string
	className?: string
}

export function CourseProgress({
	progress,
	variant,
	size,
	isShowPercentage,
	label,
	className
}: CourseProgressProps) {
	return (
		<div className={cn('space-y-2', className)}>
			<div className='flex items-center justify-between gap-2 text-sm'>
				{label && (
					<span className='text-muted-foreground'>{label}</span>
				)}
				{isShowPercentage && (
					<span className='font-medium text-muted-foreground'>
						{progress}%
					</span>
				)}
			</div>
			<Progress
				value={progress}
				className={cn(
					'h-2 transition-all',
					size === 'sm' && 'h-1',
					variant === 'success'
						? '[&>div]:bg-emerald-600'
						: '[&>div]:bg-blue-500'
				)}
			/>
		</div>
	)
}
