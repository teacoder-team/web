import { type ReactNode } from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className='relative min-h-screen'>
			<Header />
			{children}
			<Footer />
		</div>
	)
}
