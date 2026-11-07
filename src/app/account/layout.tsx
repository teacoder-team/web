import type { ReactNode } from 'react'

import { AccountGuard } from '@/components/account/account-guard'
import { Header } from '@/components/layout/header'
import { PromoBar } from '@/components/layout/promo-bar'
import { UserNavigation } from '@/components/layout/user-navigation'

import { getAppConfig } from '@/lib/config/app-config'
import { getFeaturedCourse } from '@/lib/courses/featured-course'

export default async function AccountLayout({
	children
}: {
	children: ReactNode
}) {
	const [featured, config] = await Promise.all([
		getFeaturedCourse(),
		getAppConfig()
	])

	return (
		<AccountGuard>
			<PromoBar
				course={featured}
				currency={config?.features.premium.currency}
			/>
			<Header />
			<div className='page-container grid gap-6 pt-4 pb-16 sm:pt-10 sm:pb-24 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12'>
				<UserNavigation />
				<main className='min-w-0'>{children}</main>
			</div>
		</AccountGuard>
	)
}
