import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'

import { CookieDialog } from '@/components/consent/cookie-dialog'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/shared/sonner'

import { YandexMetrikaScript } from '@/lib/analytics/script-providers'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { SESSION_MARKER } from '@/lib/auth/marker'
import { env } from '@/lib/config/env'
import { CONSENT_COOKIE, parseConsent } from '@/lib/consent/consent'
import { ConsentProvider } from '@/lib/consent/consent-provider'
import { FingerprintProvider } from '@/lib/fingerprint/fingerprint-provider'
import { garamond, geist, onest } from '@/lib/fonts'
import { OG_IMAGE, SEO } from '@/lib/seo'
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
		type: 'website',
		url: SEO.url,
		siteName: SEO.name,
		title: SEO.name,
		description: SEO.description,
		locale: 'ru_RU',
		emails: [env.SUPPORT_EMAIL],
		images: [OG_IMAGE]
	},
	twitter: {
		card: 'summary_large_image',
		title: SEO.name,
		description: SEO.description,
		images: [OG_IMAGE]
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false
	}
}

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const cookieStore = await cookies()

	return (
		<html lang='ru' suppressHydrationWarning>
			<body
				className={cn(
					'flex h-full w-full flex-col',
					geist.variable,
					onest.variable,
					garamond.variable
				)}
			>
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
													error: 'bg-destructive-soft text-destructive border-0',
													success:
														'bg-success-soft text-success border-0',
													warning:
														'bg-warning-soft text-warning border-0',
													info: 'bg-brand-soft text-foreground border-0'
												}
											}}
										/>

										<CookieDialog />

										{process.env['NODE_ENV'] ===
											'production' && (
											<YandexMetrikaScript />
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
