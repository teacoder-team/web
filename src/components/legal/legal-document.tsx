import { ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/lib/routes'
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schema'
import { cn } from '@/lib/utils'

import { JsonLd } from '../shared/json-ld'

const DOCUMENTS = [
	{
		key: 'terms',
		title: 'Пользовательское соглашение',
		description: 'Условия использования платформы, оплаты и возвратов.',
		href: ROUTES.DOCUMENTS.TERMS
	},
	{
		key: 'privacy',
		title: 'Политика конфиденциальности',
		description: 'Какие данные мы обрабатываем и как их защищаем.',
		href: ROUTES.DOCUMENTS.PRIVACY
	},
	{
		key: 'cookies',
		title: 'Политика cookie',
		description: 'Порядок применения файлов cookie и управление ими.',
		href: ROUTES.DOCUMENTS.COOKIES
	}
] as const

type DocumentKey = (typeof DOCUMENTS)[number]['key']

const BANNER_POSITION: Record<DocumentKey, string> = {
	terms: 'object-[70%_50%]',
	privacy: 'object-[30%_40%]',
	cookies: 'object-[50%_70%]'
}

interface LegalDocumentProps {
	current: DocumentKey
	title: string
	edition: string
	children: ReactNode
}

export function LegalDocument({
	current,
	title,
	edition,
	children
}: LegalDocumentProps) {
	const active = DOCUMENTS.find(item => item.key === current)!
	const others = DOCUMENTS.filter(item => item.key !== current)

	return (
		<main className='pb-24 sm:pb-32'>
			<JsonLd
				schema={[
					webPageSchema(title, active.description, active.href),
					breadcrumbSchema([
						{ name: 'Главная', path: ROUTES.HOME },
						{ name: active.title, path: active.href }
					])
				]}
			/>

			<section className='frame-container pt-2'>
				<div className='relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-inverse px-6 py-10 text-inverse-foreground sm:min-h-[320px] sm:px-12 sm:py-14 lg:px-16'>
					<Image
						src='/images/art/courses-banner.webp'
						alt=''
						fill
						priority
						sizes='100vw'
						className={cn(
							'-z-10 object-cover',
							BANNER_POSITION[current]
						)}
					/>
					<p className='font-mono text-xs tracking-[0.18em] text-highlight uppercase'>
						Документы · {edition}
					</p>
					<h1 className='mt-4 max-w-3xl font-display text-display-lg font-medium text-balance'>
						{title}
					</h1>
				</div>
			</section>

			<div
				className={cn(
					'page-container mt-12 max-w-3xl space-y-4 text-[15px] leading-7 text-foreground sm:mt-16 sm:text-base sm:leading-8',
					'[&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight',
					'[&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:marker:text-brand',
					'[&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-4 [&_a]:hover:decoration-brand'
				)}
			>
				{children}
			</div>

			<section className='page-container mt-16 sm:mt-24'>
				<p className='eyebrow'>Другие документы</p>
				<div className='mt-5 grid gap-4 sm:grid-cols-2'>
					{others.map(document => (
						<Link
							key={document.key}
							href={document.href}
							className='group relative flex flex-col gap-2 rounded-2xl bg-secondary p-6 transition-colors hover:bg-accent'
						>
							<ArrowUpRightIcon className='absolute top-5 right-5 size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground' />
							<span className='pr-8 font-display text-lg font-medium'>
								{document.title}
							</span>
							<span className='text-sm leading-relaxed text-muted-foreground'>
								{document.description}
							</span>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}
