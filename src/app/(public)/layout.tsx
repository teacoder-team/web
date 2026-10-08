import { type ReactNode } from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className='relative min-h-screen'>
			{/* <div className='pointer-events-none fixed inset-0'>
				<div className='absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background' />
				<div className='absolute right-0 top-0 h-[500px] w-[500px] bg-blue-600/10 blur-[100px]' />
				<div className='absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]' />
			</div> */}

			<div className='relative z-10'>
				<Header />
				{children}
				<Footer />
			</div>
		</div>
	)
}
