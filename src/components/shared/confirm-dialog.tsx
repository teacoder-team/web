import { JSX, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: ReactNode
	description: JSX.Element | string
	cancelBtnText?: string
	confirmText?: ReactNode
	destructive?: boolean
	handleConfirm: () => void
	isLoading?: boolean
	isDisabled?: boolean
	className?: string
	children?: ReactNode
}

export function ConfirmDialog({
	title,
	description,
	children,
	className,
	confirmText,
	cancelBtnText,
	destructive,
	isLoading,
	isDisabled = false,
	handleConfirm,
	...actions
}: ConfirmDialogProps) {
	return (
		<AlertDialog {...actions}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className={cn(className && className)}>
				<AlertDialogHeader className='text-left'>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div>{description}</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{cancelBtnText ?? 'Отмена'}
					</AlertDialogCancel>
					<Button
						variant={destructive ? 'destructive' : 'primary'}
						onClick={handleConfirm}
						isLoading={isLoading}
						disabled={isDisabled}
					>
						{confirmText ?? 'Продолжить'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
