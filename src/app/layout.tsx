import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'

import { CookieDialog } from '@/components/consent/cookie-dialog'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/shared/sonner'

import { geist } from '@/constants/fonts'
import { SEO } from '@/constants/seo'

import { YandexMetrikaScript } from '@/lib/analytics/script-providers'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { SESSION_MARKER } from '@/lib/auth/marker'
import { env } from '@/lib/config/env'
import { CONSENT_COOKIE, parseConsent } from '@/lib/consent/consent'
import { ConsentProvider } from '@/lib/consent/consent-provider'
import { FingerprintProvider } from '@/lib/fingerprint/fingerprint-provider'
import { cn } from '@/lib/utils'

import '@/assets/styles/globals.css'

export const metadata: Metadata = {
	title: {
		absolute: SEO.name,
		template: `%s - ${SEO.name}`
	},
	description: SEO.description,
	metadataBase: new URL(env.APP_URL),
	applicationName: SEO.name,
	keywords: SEO.keywords,
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/touch-icons/192x192.png',
		other: {
			rel: 'touch-icons',
			url: '/touch-icons/192x192.png',
			sizes: '192x192',
			type: 'image/png'
		}
	},
	manifest: '/manifest.webmanifest',
	openGraph: {
		title: SEO.name,
		description: SEO.description,
		type: 'website',
		emails: [env.SUPPORT_EMAIL],
		siteName: SEO.name,
		locale: 'ru_RU',
		images: [
			{
				url: new URL(env.APP_URL + '/opengraph.png'),
				width: 512,
				height: 512,
				alt: SEO.name
			}
		],
		url: env.APP_URL
	},
	twitter: {
		card: 'summary_large_image',
		title: SEO.name,
		description: SEO.description,
		images: [
			{
				url: new URL(env.APP_URL + '/opengraph.png'),
				width: 512,
				height: 512,
				alt: SEO.name
			}
		]
	},
	formatDetection: SEO.formatDetection
}

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const cookieStore = await cookies()

	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={cn('flex h-full w-full flex-col', geist.variable)}>
				<QueryProvider>
					<ConsentProvider
						initialConsent={parseConsent(
							cookieStore.get(CONSENT_COOKIE)?.value
						)}
					>
						<AnalyticsProvider>
							<FingerprintProvider>
								<AuthProvider
									hasSession={cookieStore.has(SESSION_MARKER)}
								>
									<ThemeProvider
										attribute='class'
										defaultTheme='light'
										enableSystem
										disableTransitionOnChange
									>
										{children}
										<Toaster
											toastOptions={{
												classNames: {
													error: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-0',
													success:
														'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-0',
													warning:
														'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-0',
													info: 'bg-sky-100 text-sky-800 dark:bg-gray-800 dark:text-gray-200 border-0'
												}
											}}
										/>

										<CookieDialog />

										{process.env['NODE_ENV'] ===
											'production' && (
											<>
												<YandexMetrikaScript />
											</>
										)}
									</ThemeProvider>
								</AuthProvider>
							</FingerprintProvider>
						</AnalyticsProvider>
					</ConsentProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
