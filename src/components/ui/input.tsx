import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, forwardRef, useState } from 'react'

import { cn } from '@/src/lib/utils'

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		const [typeState, setTypeState] = useState(type)

		const isPassword = type === 'password'

		return (
			<div className='relative w-full'>
				<input
					type={isPassword ? typeState : type}
					className={cn(
						'flex h-11 w-full rounded-xl border border-input bg-card px-3.5 py-2 text-base transition-[border-color,box-shadow] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/80 hover:border-foreground/25 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15 sm:text-sm',
						isPassword && 'pr-11',
						className
					)}
					ref={ref}
					{...props}
				/>
				{isPassword && (
					<div
						className={cn(
							'absolute bottom-0 right-0 flex h-full items-center justify-center px-1.5'
						)}
					>
						<button
							className={cn(
								'flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors',
								'hover:text-foreground'
							)}
							type='button'
							onClick={() => {
								setTypeState(
									typeState === 'password'
										? 'text'
										: 'password'
								)
							}}
						>
							<span className='sr-only'>
								{typeState === 'password'
									? 'Показать пароль'
									: 'Скрыть пароль'}
							</span>
							{typeState === 'password' ? (
								<Eye
									aria-hidden='true'
									className='size-5 shrink-0'
								/>
							) : (
								<EyeOff
									aria-hidden='true'
									className='size-5 shrink-0'
								/>
							)}
						</button>
					</div>
				)}
			</div>
		)
	}
)
Input.displayName = 'Input'

export { Input }
