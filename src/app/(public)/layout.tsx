import { type ReactNode } from 'react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PromoBar } from '@/components/layout/promo-bar'

import { getAppConfig } from '@/lib/config/app-config'
import { getFeaturedCourse } from '@/lib/courses/featured-course'

export default async function PublicLayout({
	children
}: {
	children: ReactNode
}) {
	const [featured, config] = await Promise.all([
		getFeaturedCourse(),
		getAppConfig()
	])

	return (
		<div className='relative min-h-screen'>
			<PromoBar
				course={featured}
				currency={config?.features.premium.currency}
			/>
			<Header />
			{children}
			<Footer />
		</div>
	)
}
