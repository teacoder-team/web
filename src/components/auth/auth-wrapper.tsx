import { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { AuthSocial } from './auth-social'

interface AuthWrapperProps {
	children: ReactNode
	heading: string
	description?: string
	bottomText?: string
	bottomLinkText?: string
	bottomLinkHref?: Route
	isShowSocial?: boolean
	isShowPasskey?: boolean
}

export function AuthWrapper({
	children,
	heading,
	description,
	bottomText,
	bottomLinkText,
	bottomLinkHref,
	isShowSocial,
	isShowPasskey
}: AuthWrapperProps) {
	return (
		<div className='container relative flex min-h-svh w-full flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
			<div className='w-full px-4 py-8 sm:px-6 md:py-12'>
				<div className='mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-5'>
					<div className='flex flex-col space-y-3'>
						<h1 className='text-3xl font-semibold'>{heading}</h1>
						{description && (
							<p className='text-sm text-muted-foreground'>
								{description}
							</p>
						)}
					</div>
					{isShowSocial && (
						<AuthSocial isShowPasskey={isShowPasskey} />
					)}
					<div className='p-0'>{children}</div>
					{/* <p className='text-xs text-muted-foreground'>
						Нажимая продолжить, вы соглашаетесь с нашим{' '}
						<Link
							href='/document/terms-of-use'
							className='text-primary hover:underline'
							target='_blank'
						>
							Пользовательским соглашением
						</Link>{' '}
						и{' '}
						<Link
							href='/document/privacy-policy'
							className='text-primary hover:underline'
							target='_blank'
						>
							Политикой Конфиденциальности
						</Link>
						.
					</p> */}
					{bottomText && bottomLinkText && bottomLinkHref && (
						<p className='text-center text-sm text-muted-foreground'>
							{bottomText}{' '}
							<Link
								href={bottomLinkHref}
								className='font-medium text-blue-500'
							>
								{bottomLinkText}
							</Link>
						</p>
					)}
				</div>
				<div className='absolute bottom-4 right-4 flex items-center justify-center gap-4 text-muted-foreground'></div>
			</div>

			<div className='relative hidden h-full flex-col p-10 text-primary lg:flex'>
				<div className='absolute inset-0'>
					<Image
						src='/images/bg-auth.png'
						alt='Background'
						className='h-full w-full object-cover'
						fill
					/>
				</div>

				{/* <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-800'>
					<div className='absolute inset-0 backdrop-blur-[100px]'>
						<div className='absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl'></div>
						<div className='absolute bottom-1/3 right-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl'></div>
						<div className='absolute left-1/3 top-2/3 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl'></div>
					</div>
				</div> */}

				{/* Блок с совой и сообщением */}
				{/* <div className='absolute bottom-0 right-0 flex flex-col items-end gap-2 p-4'>
					<p className='max-w-xs rounded-xl bg-white px-4 py-2 text-sm text-black shadow-lg'>
						Привет! Я твой мудрый гид по обучению. Давай начнём
						вместе!
					</p>
					<img
						src='/images/owl.png'
						alt='Сова'
						className='-mb-4 size-[800px] object-contain'
					/>
				</div> */}
			</div>
		</div>
	)
}
