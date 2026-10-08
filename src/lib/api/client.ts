import Axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig
} from 'axios'

import {
	getAccessToken,
	refreshAccessToken,
	waitForRefresh
} from '@/lib/auth/token'
import { env } from '@/lib/config/env'
import { getFingerprintEvent } from '@/lib/fingerprint/fingerprint'

import { isAccessTokenError } from './errors'

const REFRESH_URL = '/auth/refresh'

/** Sign-in steps the API ties to a device via `X-Fingerprint-Event`. */
const FINGERPRINTED_URLS = [
	/^\/auth\/login$/,
	/^\/auth\/verify$/,
	/^\/auth\/mfa\/confirm$/,
	/^\/auth\/reset-password$/,
	/^\/auth\/sso\/[^/]+\/start$/,
	/^\/auth\/webauthn\/login\/verify$/
]

const BEARER = 'Bearer '

type RetriableConfig = InternalAxiosRequestConfig & { retried?: boolean }

// Cookies (the refresh token, the OAuth binding) live on the API's domain.
export const axiosInstance = Axios.create({
	baseURL: env.API_URL,
	withCredentials: true
})

axiosInstance.interceptors.request.use(async config => {
	if (typeof window === 'undefined') {
		return config
	}

	const url = config.url ?? ''

	// A request fired while the session is being restored waits for the new token.
	const token =
		url === REFRESH_URL
			? null
			: (getAccessToken() ?? (await waitForRefresh()))

	if (token) {
		config.headers.Authorization = `${BEARER}${token}`
	}

	if (FINGERPRINTED_URLS.some(pattern => pattern.test(url))) {
		const eventId = await getFingerprintEvent()

		if (eventId) {
			config.headers['X-Fingerprint-Event'] = eventId
		}
	}

	return config
})

axiosInstance.interceptors.response.use(
	undefined,
	async (error: AxiosError) => {
		const config = error.config as RetriableConfig | undefined
		const authorization = config?.headers.Authorization

		if (
			!config ||
			config.retried ||
			typeof authorization !== 'string' ||
			!isAccessTokenError(error)
		) {
			throw error
		}

		const token = await refreshAccessToken(
			authorization.slice(BEARER.length)
		)

		if (!token) {
			throw error
		}

		config.retried = true
		config.headers.Authorization = `${BEARER}${token}`

		return axiosInstance(config)
	}
)

/** orval mutator: every generated request goes through here. */
export function apiClient<T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> {
	return axiosInstance<T>({ ...config, ...options }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<Body> = Body
