'use client'

import { useGetRootQuery } from '@/generated/api'

/** Always revalidated: the server may change any of it without a redeploy. */
export function useAppConfig() {
	return useGetRootQuery({
		query: {
			staleTime: 0,
			refetchOnMount: 'always',
			refetchOnReconnect: true
		}
	})
}
