import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";

import "@/assets/styles/globals.css";
import { cn } from "@/lib/utils/cn";
import { websiteJsonLd } from "@/lib/seo/structured-data";
import { createMetadata } from "@/lib/seo/metadata";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Script from "next/script";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = createMetadata();

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
			<body className={cn("antialiased", geistSans.variable)}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
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
  })();`;
}
