'use client'

import { type ReactNode, useEffect } from 'react'

import { initAnalytics } from '@/lib/analytics'
import { attachAnalyticsTriggers } from '@/lib/analytics/trigger'
import { useConsent } from '@/lib/consent/consent-provider'

export function AnalyticsProvider({ children }: { children: ReactNode }) {
	const { consent } = useConsent()

	useEffect(() => {
		attachAnalyticsTriggers()
	}, [])

	// Analytics starts only after the visitor allows it in the cookie dialog.
	useEffect(() => {
		if (consent?.analytics) {
			initAnalytics()
		}
	}, [consent?.analytics])

	return <>{children}</>
}
