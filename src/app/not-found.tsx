import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = {
	title: 'Страница не найдена'
}

export default function NotFoundPage() {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='px-4 py-10 text-center sm:px-6 lg:px-8'>
				<h1 className='block text-8xl font-bold text-primary'>404</h1>
				<p className='mt-6 text-lg text-neutral-600 dark:text-neutral-300'>
					Кажется, мы потеряли эту страницу.
				</p>
				<div className='mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3'>
					<Button variant='primary' asChild>
						<Link href={ROUTES.HOME}>
							<ChevronLeft />
							На главную
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
