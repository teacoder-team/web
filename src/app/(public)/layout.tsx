import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative mx-auto max-w-7xl border-x">
			<div className="border-border absolute top-0 left-6 z-10 block h-full w-px border-l" />
			<div className="border-border absolute top-0 right-6 z-10 block h-full w-px border-r" />

			<Header />
			<main className="divide-border flex min-h-screen w-full flex-col items-center justify-center divide-y">
				{children}
			</main>
			<Footer />
		</div>
	)
}
