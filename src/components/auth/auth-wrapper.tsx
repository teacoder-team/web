'use client'

import { ArrowLeft, Mail } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { isSsoProvider } from '@/lib/auth/sso-providers'
import { useAppConfig } from '@/lib/config/useAppConfig'
import { ROUTES } from '@/lib/routes'

import { Logo } from '../shared/logo'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

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
	const { data: config, isLoading } = useAppConfig()
	const [isEmailStep, setIsEmailStep] = useState(false)

	const hasProviders =
		(config?.features.auth.providers.filter(isSsoProvider).length ?? 0) > 0
	// Sign-in methods come first; the email form opens on demand
	const hasChoice =
		!!isShowSocial && (isLoading || hasProviders || !!isShowPasskey)
	const showChoice = hasChoice && !isEmailStep

	return (
		<div className='relative isolate flex min-h-svh flex-col overflow-hidden bg-background'>
			<AuthBackdrop />

			<header className='page-container flex h-16 items-center justify-between'>
				<Link
					href={ROUTES.HOME}
					className='flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight'
				>
					<Logo className='h-7 w-auto' />
					TeaCoder
				</Link>
				<Link
					href={ROUTES.HOME}
					className='inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
				>
					<ArrowLeft className='size-4' />
					На главную
				</Link>
			</header>

			<main className='flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16'>
				<div className='w-full max-w-[440px] duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none'>
					<div className='text-center'>
						<h1 className='font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.035em]'>
							{heading}
						</h1>
						{description && (
							<p className='mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground'>
								{description}
							</p>
						)}
					</div>

					<div className='mt-8 rounded-3xl border border-border bg-popover p-5 shadow-[0_24px_64px_-32px_hsl(var(--foreground)/0.25)] sm:p-7 [&_button[type=submit]]:mt-2 [&_button[type=submit]]:h-12'>
						{isShowSocial && isLoading ? (
							<div
								className='flex flex-col gap-3'
								aria-busy='true'
								aria-label='Загрузка способов входа'
							>
								{Array.from({ length: 3 }).map((_, index) => (
									<Skeleton
										key={index}
										className='h-[42px] w-full rounded-full'
									/>
								))}
							</div>
						) : showChoice ? (
							<div className='duration-300 animate-in fade-in-0'>
								<AuthSocial isShowPasskey={isShowPasskey} />
								<Button
									variant='outline'
									onClick={() => setIsEmailStep(true)}
									className='mt-3 h-[42px] w-full'
								>
									<Mail />
									Продолжить с почтой
								</Button>
							</div>
						) : (
							<div className='duration-300 animate-in fade-in-0 slide-in-from-bottom-1'>
								{hasChoice && (
									<button
										type='button'
										onClick={() => setIsEmailStep(false)}
										className='-ml-1 mb-5 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
									>
										<ArrowLeft className='size-4' />
										Другие способы входа
									</button>
								)}
								{children}
							</div>
						)}

						{(isShowSocial ||
							(bottomText &&
								bottomLinkText &&
								bottomLinkHref)) && (
							<div className='mt-6 space-y-3 border-t border-border pt-5 text-center'>
								{bottomText &&
									bottomLinkText &&
									bottomLinkHref && (
										<p className='text-sm text-foreground'>
											{bottomText}{' '}
											<Link
												href={bottomLinkHref}
												className='font-medium text-brand underline-offset-4 hover:underline'
											>
												{bottomLinkText}
											</Link>
										</p>
									)}
								{isShowSocial && (
									<p className='text-xs leading-relaxed text-muted-foreground'>
										Продолжая, вы соглашаетесь с{' '}
										<Link
											href={ROUTES.DOCUMENTS.TERMS}
											target='_blank'
											className='text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
										>
											Пользовательским соглашением
										</Link>{' '}
										и{' '}
										<Link
											href={ROUTES.DOCUMENTS.PRIVACY}
											target='_blank'
											className='text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
										>
											Политикой конфиденциальности
										</Link>
										.
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</main>

			<footer className='pb-6 text-center text-xs text-muted-foreground'>
				TeaCoder © {new Date().getFullYear()}
			</footer>
		</div>
	)
}

/** Static on purpose: animated or blurred layers here made the page janky. */
function AuthBackdrop() {
	return (
		<div
			aria-hidden='true'
			className='pointer-events-none absolute inset-0 -z-10'
		>
			<div className='absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_0%,hsl(var(--primary)/0.14),transparent_70%)]' />
			<Image
				src='/images/art/sphere-halftone.png'
				unoptimized
				alt=''
				width={960}
				height={960}
				priority
				className='absolute -right-24 -top-40 hidden w-[560px] max-w-none opacity-25 dark:opacity-40 sm:block'
			/>
			<Image
				src='/images/art/planet-wide.png'
				unoptimized
				alt=''
				width={2400}
				height={560}
				className='absolute bottom-0 left-1/2 w-[1600px] max-w-none -translate-x-1/2 opacity-30 dark:opacity-45'
			/>
		</div>
	)
}
