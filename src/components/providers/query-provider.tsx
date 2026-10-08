'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: Infinity,
						refetchInterval: false,
						refetchOnWindowFocus: false,
						refetchOnReconnect: false,
						refetchOnMount: false
					}
				}
			})
	)

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
