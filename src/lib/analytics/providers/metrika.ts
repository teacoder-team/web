import { env } from '@/lib/config/env'

declare global {
	interface Window {
		ym?: (...args: unknown[]) => void
	}
}

export const metrikaProvider = {
	init() {},

	track(event: string, data?: Record<string, unknown>) {
		if (typeof window !== 'undefined' && typeof window.ym === 'function') {
			window.ym(Number(env.YANDEX_METRIKA_ID), 'reachGoal', event, data)
		}
	}
}
