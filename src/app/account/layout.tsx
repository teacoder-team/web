import type { ReactNode } from 'react'

import { AccountGuard } from '@/components/account/account-guard'
import { Header } from '@/components/layout/header'
import { UserNavigation } from '@/components/layout/user-navigation'

export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<AccountGuard>
			<Header />
			<div className='page-container grid gap-8 pb-24 pt-6 sm:pt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12'>
				<UserNavigation />
				<main className='min-w-0'>{children}</main>
			</div>
		</AccountGuard>
	)
}
