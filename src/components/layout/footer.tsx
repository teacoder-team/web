'use client'

import { ExternalLink } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { JSX } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FaTelegram, FaYoutube } from 'react-icons/fa6'

import { ROUTES } from '@/constants/routes'

import { env } from '@/lib/config/env'
import { useConsent } from '@/lib/consent/consent-provider'

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
	{ title: 'Политика конфиденциальности', href: ROUTES.DOCUMENTS.PRIVACY }
]

const socialLinks: SocialLink[] = [
	{
		href: 'https://youtube.com/@TeaCoder52',
		icon: <FaYoutube className='size-6' />,
		label: 'YouTube'
	},
	{
		href: 'https://t.me/TeaCoder_official',
		icon: <FaTelegram className='size-6' />,
		label: 'Telegram'
	},
	{
		href: 'https://github.com/teacoder-team',
		icon: <FaGithub className='size-6' />,
		label: 'GitHub'
	}
	// {
	// 	href: 'https://boosty.to/teacoder',
	// 	icon: <SiBoosty className='size-6' />,
	// 	label: 'Boosty'
	// }
]

export function Footer() {
	const { openSettings } = useConsent()

	return (
		<footer className='border-t'>
			<div className='relative mx-auto max-w-[1340px] px-4 py-8 lg:px-8'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
					<div className='space-y-4 sm:col-span-2 md:col-span-2'>
						<h2 className='text-2xl font-bold'>TeaCoder</h2>
						<p className='text-sm text-muted-foreground'>
							Образовательная платформа по веб-разработке.
							<br /> В случае возникновения вопросов, обращайтесь
							на почту{' '}
							<Link
								href={`mailto:${env.SUPPORT_EMAIL}`}
								className='text-blue-500 hover:underline'
							>
								{env.SUPPORT_EMAIL}
							</Link>
							.
						</p>
					</div>
					<div className='space-y-4'>
						<h3 className='text-sm font-medium'>Общие ссылки</h3>
						<ul className='space-y-3 text-sm'>
							{generalLinks.map((link, index) => (
								<FooterLink key={index} {...link} />
							))}
						</ul>
					</div>

					<div className='space-y-4'>
						<h3 className='text-sm font-medium'>Документы</h3>
						<ul className='space-y-3 text-sm'>
							{documentsLinks.map((link, index) => (
								<FooterLink key={index} {...link} />
							))}
							<li>
								<button
									type='button'
									onClick={openSettings}
									className='inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'
								>
									Настройки cookie
								</button>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h3 className='text-sm font-medium'>Соц. сети</h3>
						<div className='flex space-x-4'>
							{socialLinks.map((link, index) => (
								<SocialLink key={index} {...link} />
							))}
						</div>
					</div>
				</div>
			</div>
			<div className='mx-auto max-w-full border-t py-6'>
				<p className='text-center text-sm text-muted-foreground'>
					TeaCoder © {new Date().getFullYear()} Все права защищены.
				</p>
			</div>
		</footer>
	)
}

function FooterLink({ title, href, isExternal }: NavLink) {
	return (
		<li>
			<Link
				href={href}
				className='inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary'
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
			className='text-muted-foreground transition-colors hover:text-primary'
			target='_blank'
			referrerPolicy='no-referrer'
		>
			{icon}
			<span className='sr-only'>{label}</span>
		</Link>
	)
}
