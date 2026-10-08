import { isAxiosError } from 'axios'

import { postAuthRefreshMutation } from '@/generated/api'

import { clearSessionMarker, setSessionMarker } from './marker'

type Listener = (token: string | null) => void

type AuthMessage = { type: 'token'; token: string } | { type: 'logout' }

let accessToken: string | null = null
let refreshing: Promise<string | null> | null = null

const listeners = new Set<Listener>()

const channel =
	typeof BroadcastChannel === 'undefined'
		? null
		: new BroadcastChannel('tc-auth')

channel?.addEventListener('message', (event: MessageEvent<AuthMessage>) => {
	apply(event.data.type === 'token' ? event.data.token : null)
})

function apply(token: string | null) {
	accessToken = token

	if (token) {
		setSessionMarker()
	} else {
		clearSessionMarker()
	}

	listeners.forEach(listener => listener(token))
}

export function getAccessToken() {
	return accessToken
}

/** Sets the token in this tab and hands it to the other open tabs. */
export function setAccessToken(token: string | null) {
	apply(token)
	channel?.postMessage(
		token ? { type: 'token', token } : ({ type: 'logout' } as AuthMessage)
	)
}

export function subscribeToAccessToken(listener: Listener) {
	listeners.add(listener)

	return () => {
		listeners.delete(listener)
	}
}

/** Resolves when the refresh in flight (if any) is done. */
export function waitForRefresh() {
	return refreshing ?? Promise.resolve(accessToken)
}

/**
 * Exchanges the refresh cookie for a new access token. `staleToken` is the token
 * the caller saw rejected (or `null` on startup): if another request or tab has
 * already replaced it, that token is returned without a new refresh.
 */
export function refreshAccessToken(staleToken: string | null) {
	const pending =
		refreshing ??
		runExclusive(() => refresh(staleToken)).finally(() => {
			refreshing = null
		})

	refreshing = pending

	return pending
}

async function refresh(staleToken: string | null) {
	if (accessToken && accessToken !== staleToken) {
		return accessToken
	}

	try {
		const { accessToken: token } = await postAuthRefreshMutation()

		setAccessToken(token)

		return token
	} catch (error) {
		// A network failure or a 5xx says nothing about the session - keep the marker.
		if (
			isAxiosError(error) &&
			error.response &&
			error.response.status < 500
		) {
			setAccessToken(null)
		}

		return null
	}
}

/**
 * The refresh cookie is single-use and reusing an old one ends the whole session,
 * so two tabs must never refresh at once: the Web Lock serialises them, and the
 * one that waited picks up the token broadcast by the first instead of refreshing.
 */
async function runExclusive<T>(task: () => Promise<T>): Promise<T> {
	if (typeof navigator === 'undefined' || !navigator.locks) {
		return task()
	}

	return await navigator.locks.request('tc-refresh', task)
}
