'use client'

import {
	FpjsProvider,
	useVisitorData
} from '@fingerprintjs/fingerprintjs-pro-react'
import { type ReactNode, useEffect } from 'react'

import { env } from '@/lib/config/env'

import { setFingerprintSource } from './fingerprint'

function FingerprintBridge() {
	const { getData } = useVisitorData({}, { immediate: false })

	useEffect(() => {
		setFingerprintSource(async () => {
			const data = await getData({ ignoreCache: true })

			return data.requestId
		})

		return () => setFingerprintSource(null)
	}, [getData])

	return null
}

export function FingerprintProvider({ children }: { children: ReactNode }) {
	const { FPJS_API_KEY: apiKey, FPJS_ENDPOINT: endpoint } = env

	// Without a key requests simply go without `X-Fingerprint-Event`.
	if (!apiKey || !endpoint) {
		return children
	}

	return (
		<FpjsProvider
			loadOptions={{
				apiKey,
				endpoint,
				scriptUrlPattern: `${endpoint}/web/v<version>/<apiKey>/loader_v<loaderVersion>.js`
			}}
		>
			<FingerprintBridge />
			{children}
		</FpjsProvider>
	)
}
