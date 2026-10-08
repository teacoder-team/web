'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

import { useGetMfaQuery } from '@/generated/api'

import { ROUTES } from '@/constants/routes'

import { useSession } from '@/lib/auth/auth-provider'

import { EllipsisLoader } from '../shared/ellipsis-loader'

/** Loader until the session is restored; back to sign-in if it is gone (`proxy.ts` only sees a hint). */
export function AccountGuard({ children }: { children: ReactNode }) {
	const router = useRouter()
	const pathname = usePathname()

	const { status, isLoading } = useSession()

	const { isLoading: isLoadingStatus } = useGetMfaQuery({
		query: { enabled: status === 'authenticated' }
	})

	useEffect(() => {
		if (status === 'guest') {
			router.replace(ROUTES.AUTH.LOGIN(pathname))
		}
	}, [pathname, router, status])

	if (status !== 'authenticated' || isLoading || isLoadingStatus) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<EllipsisLoader />
			</div>
		)
	}

	return <>{children}</>
}
