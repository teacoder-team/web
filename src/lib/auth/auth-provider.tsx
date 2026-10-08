'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState
} from 'react'

import { getGetRootQueryQueryKey, useGetUsersMeQuery } from '@/generated/api'

import {
	getAccessToken,
	refreshAccessToken,
	subscribeToAccessToken
} from './token'

export type SessionStatus = 'loading' | 'authenticated' | 'guest'

const SessionContext = createContext<SessionStatus>('guest')

interface AuthProviderProps {
	/** The session marker was present on the request - try to restore the session. */
	hasSession: boolean
	children: ReactNode
}

export function AuthProvider({ hasSession, children }: AuthProviderProps) {
	const queryClient = useQueryClient()

	const [status, setStatus] = useState<SessionStatus>(() =>
		getAccessToken() ? 'authenticated' : hasSession ? 'loading' : 'guest'
	)

	useEffect(
		() =>
			subscribeToAccessToken(token => {
				setStatus(token ? 'authenticated' : 'guest')

				if (!token) {
					const configKey = getGetRootQueryQueryKey()[0]

					queryClient.removeQueries({
						predicate: query => query.queryKey[0] !== configKey
					})
				}
			}),
		[queryClient]
	)

	useEffect(() => {
		if (!hasSession || getAccessToken()) {
			return
		}

		refreshAccessToken(null).then(token => {
			if (!token) {
				setStatus('guest')
			}
		})
	}, [hasSession])

	return (
		<SessionContext.Provider value={status}>
			{children}
		</SessionContext.Provider>
	)
}

export function useSession() {
	const status = useContext(SessionContext)

	const { data: user, isLoading } = useGetUsersMeQuery({
		query: { enabled: status === 'authenticated', retry: false }
	})

	return {
		status,
		/** Optimistic: `true` while a remembered session is being restored. */
		isAuthorized: status !== 'guest',
		user,
		isLoading: status === 'loading' || isLoading
	}
}
