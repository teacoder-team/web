import type { Metadata } from 'next'
import { Geist, Golos_Text } from 'next/font/google'
import Script from 'next/script'
import type { ReactNode } from 'react'

import '@/assets/styles/globals.css'
import { createMetadata } from '@/lib/seo/metadata'
import { websiteJsonLd } from '@/lib/seo/structured-data'
import { cn } from '@/lib/utils/cn'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

const geistSans = Golos_Text({
	variable: '--font-geist-sans',
	subsets: ['latin', 'cyrillic']
})

export const metadata: Metadata = createMetadata()

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<head>
				<Script id="theme" strategy="beforeInteractive">
					{getInlineThemeScript()}
				</Script>

				<Script
					id="jsonld"
					type="application/ld+json"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
				/>
			</head>
			<body className={cn('antialiased', geistSans.variable)}>
				<ThemeProvider>
					<ReactQueryProvider>{children}</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export function getInlineThemeScript(): string {
	return `(function(){
     try {
       var theme = localStorage.getItem('app_theme');
       var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
       var resolved = (theme==='dark'||theme==='light')?theme:(prefersDark?'dark':'light');
       if(resolved==='dark') document.documentElement.classList.add('dark');
       else document.documentElement.classList.remove('dark');
     } catch(e){}
  })();`
}
