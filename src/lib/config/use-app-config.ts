'use client'

import { useGetRootQuery } from '@/generated/api'

/**
 * `GET /` - captcha keys, sign-in providers, payment methods, storage address.
 * Always revalidated: the server may change any of it without a redeploy. Cached
 * data keeps rendering while the refetch runs, so nothing flashes back to skeletons.
 */
export function useAppConfig() {
	return useGetRootQuery({
		query: {
			staleTime: 0,
			refetchOnMount: 'always',
			refetchOnReconnect: true
		}
	})
}
