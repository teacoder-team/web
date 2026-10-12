import * as SelectPrimitives from '@radix-ui/react-select'
import { cva } from 'class-variance-authority'
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef
} from 'react'
import {
	RiArrowDownSLine,
	RiArrowUpSLine,
	RiCheckLine,
	RiExpandUpDownLine
} from 'react-icons/ri'

import { cn } from '@/src/lib/utils'

const Select = SelectPrimitives.Root
Select.displayName = 'Select'

const SelectGroup = SelectPrimitives.Group
SelectGroup.displayName = 'SelectGroup'

const SelectValue = SelectPrimitives.Value
SelectValue.displayName = 'SelectValue'

const selectTriggerStyles = cva(
	'group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-xl border border-input bg-card px-3.5 py-2 outline-none transition text-sm hover:border-foreground/25',
	{
		variants: {
			disabled: {
				true: 'bg-popover text-popover-foreground',
				false: 'bg-popover text-popover-foreground border'
			},
			placeholder: {
				true: 'text-muted-foreground',
				false: ''
			},
			hover: {
				true: 'hover:bg-accent',
				false: ''
			}
		},
		defaultVariants: {
			disabled: false,
			placeholder: false,
			hover: true
		}
	}
)

const SelectTrigger = forwardRef<
	ComponentRef<typeof SelectPrimitives.Trigger>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger> & {
		hasError?: boolean
	}
>(({ className, hasError, children, ...props }, forwardedRef) => {
	return (
		<SelectPrimitives.Trigger
			ref={forwardedRef}
			className={cn(
				selectTriggerStyles(),
				hasError ? 'border-destructive' : '',
				className
			)}
			{...props}
		>
			<span className='truncate'>{children}</span>
			<SelectPrimitives.Icon asChild>
				<RiExpandUpDownLine className='size-4 shrink-0 text-popover-foreground group-data-[disabled]/trigger:text-popover-foreground' />
			</SelectPrimitives.Icon>
		</SelectPrimitives.Trigger>
	)
})

SelectTrigger.displayName = 'SelectTrigger'

const SelectScrollUpButton = forwardRef<
	ComponentRef<typeof SelectPrimitives.ScrollUpButton>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.ScrollUpButton>
>(({ className, ...props }, forwardedRef) => (
	<SelectPrimitives.ScrollUpButton
		ref={forwardedRef}
		className={`flex cursor-default items-center justify-center py-1 ${className}`}
		{...props}
	>
		<RiArrowUpSLine className='size-3 shrink-0' aria-hidden='true' />
	</SelectPrimitives.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitives.ScrollUpButton.displayName

const SelectScrollDownButton = forwardRef<
	ComponentRef<typeof SelectPrimitives.ScrollDownButton>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.ScrollDownButton>
>(({ className, ...props }, forwardedRef) => (
	<SelectPrimitives.ScrollDownButton
		ref={forwardedRef}
		className={`flex cursor-default items-center justify-center py-1 ${className}`}
		{...props}
	>
		<RiArrowDownSLine className='size-3 shrink-0' aria-hidden='true' />
	</SelectPrimitives.ScrollDownButton>
))
SelectScrollDownButton.displayName =
	SelectPrimitives.ScrollDownButton.displayName

const SelectContent = forwardRef<
	ComponentRef<typeof SelectPrimitives.Content>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(
	(
		{
			className,
			position = 'popper',
			children,
			sideOffset = 8,
			collisionPadding = 10,
			...props
		},
		forwardedRef
	) => (
		<SelectPrimitives.Portal>
			<SelectPrimitives.Content
				ref={forwardedRef}
				className={cn(
					'relative z-50 max-h-[--radix-select-content-available-height] min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw] overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-popover will-change-[transform,opacity]',
					className
				)}
				sideOffset={sideOffset}
				position={position}
				collisionPadding={collisionPadding}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitives.Viewport
					className={`p-1 ${position === 'popper' ? 'h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-select-trigger-width))]' : ''}`}
				>
					{children}
				</SelectPrimitives.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitives.Content>
		</SelectPrimitives.Portal>
	)
)

SelectContent.displayName = 'SelectContent'

const SelectGroupLabel = forwardRef<
	ComponentRef<typeof SelectPrimitives.Label>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
	<SelectPrimitives.Label
		ref={forwardedRef}
		className={cn(
			'px-3 py-2 text-xs font-medium tracking-wide text-popover-foreground',
			className
		)}
		{...props}
	/>
))

SelectGroupLabel.displayName = 'SelectGroupLabel'

const SelectItem = forwardRef<
	ComponentRef<typeof SelectPrimitives.Item>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, forwardedRef) => {
	return (
		<SelectPrimitives.Item
			ref={forwardedRef}
			className={cn(
				'grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded-lg px-3 py-2 text-sm text-accent-foreground outline-none transition-colors hover:bg-accent focus-visible:bg-accent data-[disabled]:pointer-events-none data-[state=checked]:font-semibold data-[disabled]:text-muted-foreground data-[disabled]:hover:bg-none',
				className
			)}
			{...props}
		>
			<SelectPrimitives.ItemText className='flex-1 truncate'>
				{children}
			</SelectPrimitives.ItemText>
			<SelectPrimitives.ItemIndicator>
				<RiCheckLine
					className='size-5 shrink-0 text-foreground'
					aria-hidden='true'
				/>
			</SelectPrimitives.ItemIndicator>
		</SelectPrimitives.Item>
	)
})

SelectItem.displayName = 'SelectItem'

const SelectSeparator = forwardRef<
	ComponentRef<typeof SelectPrimitives.Separator>,
	ComponentPropsWithoutRef<typeof SelectPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
	<SelectPrimitives.Separator
		ref={forwardedRef}
		className={`-mx-1 my-1 h-px bg-border ${className}`}
		{...props}
	/>
))

SelectSeparator.displayName = 'SelectSeparator'

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectGroupLabel,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue
}
