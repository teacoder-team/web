import type { ReactNode } from 'react'

import { AccountGuard } from '@/components/account/account-guard'
import { Header } from '@/components/layout/header'
import { UserNavigation } from '@/components/layout/user-navigation'

export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<AccountGuard>
			<Header />
			<main className='flex w-full flex-col items-center'>
				<div className='mx-auto w-full max-w-7xl'>
					<div className='my-2 flex w-full flex-row flex-wrap gap-12 px-10 lg:flex-nowrap lg:px-0'>
						<div className='w-full lg:max-w-[19rem]'>
							<UserNavigation />
						</div>
						{children}
					</div>
				</div>
			</main>
		</AccountGuard>
	)
}
