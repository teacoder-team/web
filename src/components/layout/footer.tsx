'use client'

import { ExternalLink } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import type { JSX, ReactNode } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaTelegram, FaYoutube } from 'react-icons/fa6'

import { ROUTES } from '@/constants/routes'

import { env } from '@/lib/config/env'
import { useConsent } from '@/lib/consent/consent-provider'

import { Logo } from '../shared/logo'

interface NavLink {
	title: string
	href: Route
	isExternal?: boolean
}

interface SocialLink {
	href: string
	icon: JSX.Element
	label: string
}

const generalLinks: NavLink[] = [
	{ title: 'Курсы', href: ROUTES.COURSES.ROOT },
	{ title: 'Об основателе', href: ROUTES.ABOUT },
	// {
	// 	title: 'API документация',
	// 	href: 'https://api.teacoder.ru/docs',
	// 	isExternal: true
	// }
	{ title: 'Подписка', href: ROUTES.PREMIUM }
]

const documentsLinks: NavLink[] = [
	{ title: 'Пользовательское соглашение', href: ROUTES.DOCUMENTS.TERMS },
	{ title: 'Политика конфиденциальности', href: ROUTES.DOCUMENTS.PRIVACY },
	{ title: 'Политика использования cookie', href: ROUTES.DOCUMENTS.COOKIES }
]

const socialLinks: SocialLink[] = [
	{
		href: 'https://youtube.com/@TeaCoder52',
		icon: <FaYoutube className='size-[18px]' />,
		label: 'YouTube'
	},
	{
		href: 'https://t.me/TeaCoder_official',
		icon: <FaTelegram className='size-[18px]' />,
		label: 'Telegram'
	},
	{
		href: 'https://github.com/teacoder-team',
		icon: <FaGithub className='size-[18px]' />,
		label: 'GitHub'
	}
	// {
	// 	href: 'https://boosty.to/teacoder',
	// 	icon: <SiBoosty className='size-6' />,
	// 	label: 'Boosty'
	// }
]

export function Footer() {
	return (
		<footer className='relative overflow-hidden bg-inverse text-inverse-foreground'>
			<div className='page-container grid gap-12 pb-10 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-8'>
				<div className='lg:col-span-5'>
					<Link
						href={ROUTES.HOME}
						className='inline-flex items-center gap-2.5 rounded-lg font-display text-xl font-semibold tracking-tight'
					>
						<Logo className='h-8 w-auto' />
						TeaCoder
					</Link>
					<p className='mt-6 max-w-sm font-serif text-lg leading-snug text-inverse-foreground/70'>
						Образовательная платформа по веб-разработке. В случае
						возникновения вопросов, обращайтесь на почту{' '}
						<Link
							href={`mailto:${env.SUPPORT_EMAIL}`}
							className='text-inverse-foreground underline decoration-inverse-foreground/30 underline-offset-4 transition-colors hover:decoration-inverse-foreground'
						>
							{env.SUPPORT_EMAIL}
						</Link>
						.
					</p>
					<div className='mt-8 flex gap-2'>
						{socialLinks.map((link, index) => (
							<SocialLink key={index} {...link} />
						))}
					</div>
				</div>

				<div className='grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7'>
					<FooterColumn title='Общие ссылки'>
						{generalLinks.map((link, index) => (
							<FooterLink key={index} {...link} />
						))}
					</FooterColumn>
					<FooterColumn title='Документы'>
						{documentsLinks.map((link, index) => (
							<FooterLink key={index} {...link} />
						))}
					</FooterColumn>
				</div>
			</div>

			<div className='page-container flex flex-col gap-2 border-t border-inverse-foreground/10 py-6 text-sm text-inverse-foreground/50 sm:flex-row sm:justify-between'>
				<p>TeaCoder © {new Date().getFullYear()} Все права защищены.</p>
			</div>

			<p
				aria-hidden='true'
				className='pointer-events-none -mb-[0.22em] select-none text-center font-display text-[24vw] font-semibold leading-none tracking-[-0.06em] text-inverse-foreground/[0.05]'
			>
				TeaCoder
			</p>
		</footer>
	)
}

function FooterColumn({
	title,
	children
}: {
	title: string
	children: ReactNode
}) {
	return (
		<div>
			<h3 className='text-sm font-medium text-inverse-foreground'>
				{title}
			</h3>
			<ul className='mt-5 space-y-3'>{children}</ul>
		</div>
	)
}

function FooterLink({ title, href, isExternal }: NavLink) {
	return (
		<li>
			<Link
				href={href}
				className='inline-flex items-center gap-2 rounded-sm text-[15px] text-inverse-foreground/65 transition-colors hover:text-inverse-foreground'
				target={isExternal ? '_blank' : undefined}
				referrerPolicy={isExternal ? 'no-referrer' : undefined}
			>
				{isExternal && <ExternalLink className='size-4' />}
				{title}
			</Link>
		</li>
	)
}

function SocialLink({ href, icon, label }: SocialLink) {
	return (
		<Link
			href={href as Route}
			className='flex size-10 items-center justify-center rounded-full bg-inverse-foreground/[0.08] text-inverse-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground'
			target='_blank'
			referrerPolicy='no-referrer'
		>
			{icon}
			<span className='sr-only'>{label}</span>
		</Link>
	)
}
