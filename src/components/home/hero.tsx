import {
	BookOpenIcon,
	CodeIcon,
	LightbulbIcon,
	TerminalIcon
} from 'lucide-react'
import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

import { Button } from '../ui/button'

export function Hero() {
	return (
		<section className='relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-16 text-center sm:space-y-10 sm:py-20 md:py-28'>
			<div className='absolute inset-0 mx-4 rounded-3xl' />

			<div className='pointer-events-none absolute inset-0 overflow-hidden'>
				<div className='animate-float absolute left-10 top-20 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/5'>
					<BookOpenIcon className='h-6 w-6 animate-pulse text-blue-500/20' />
				</div>
				<div
					className='animate-float absolute right-20 top-40 flex h-12 w-12 rotate-45 items-center justify-center rounded-lg bg-blue-600/5'
					style={{ animationDelay: '2s' }}
				>
					<CodeIcon className='h-5 w-5 -rotate-45 text-blue-600/20' />
				</div>
				<div
					className='animate-float absolute bottom-40 left-20 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/5'
					style={{ animationDelay: '4s' }}
				>
					<LightbulbIcon className='h-4 w-4 animate-pulse text-blue-500/20' />
				</div>
				<div
					className='animate-float absolute bottom-20 right-10 flex h-20 w-20 rotate-12 items-center justify-center rounded-lg bg-blue-600/5'
					style={{ animationDelay: '1s' }}
				>
					<TerminalIcon className='h-8 w-8 -rotate-12 text-blue-600/20' />
				</div>
				<div
					className='animate-float absolute left-1/4 top-1/3 h-8 w-8 rounded-full bg-blue-400/5'
					style={{ animationDelay: '3s' }}
				/>
				<div
					className='animate-float absolute right-1/3 top-2/3 h-6 w-6 rotate-45 rounded-lg bg-blue-700/5'
					style={{ animationDelay: '5s' }}
				/>
			</div>

			<div className='relative space-y-6'>
				<h1 className='bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl xl:text-7xl'>
					Изучай веб-разработку
					<br className='sm:hidden' /> с{' '}
					<br className='hidden sm:block' />
					<span className='bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent'>
						TeaCoder
					</span>
				</h1>
				<p className='mx-auto max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:max-w-sm md:max-w-lg md:text-base lg:max-w-2xl lg:text-xl'>
					Платформа для изучения веб-разработки с гибким подходом.
					Получи доступ к курсам, которые помогут развить навыки и
					разобраться в реальных примерах
				</p>
			</div>
			<div className='flex gap-4'>
				<Button
					variant='primary'
					size='lg'
					className='rounded-full'
					asChild
				>
					<Link href={ROUTES.COURSES.ROOT}>
						<TerminalIcon />
						Начать обучение
					</Link>
				</Button>
			</div>
		</section>
	)
}
