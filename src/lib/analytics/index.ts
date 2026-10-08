import { authEvents } from './events'
import { consoleProvider, metrikaProvider } from './providers'

const providers = [
	metrikaProvider,
	...(process.env.NODE_ENV === 'development' ? [consoleProvider] : [])
]

export function initAnalytics() {
	if (typeof window === 'undefined') return
	providers.forEach(p => p.init?.())
}

export function track(event: string, data?: Record<string, unknown>) {
	providers.forEach(p => p.track(event, data))
}

export const analytics = {
	auth: authEvents
}
