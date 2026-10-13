'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

import { useGetMfaQuery } from '@/generated/api'

import { useSession } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/lib/routes'

import { EllipsisLoader } from '../shared/ellipsis-loader'

/** `proxy.ts` only sees a session hint, so the real check happens here. */
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
