export const consoleProvider = {
	init() {
		console.log('%c[Analytics] Dev mode enabled', 'color: #4ade80')
	},

	track(event: string, data?: Record<string, unknown>) {
		console.log('%c[Track]', 'color: #60a5fa', event, data)
	}
}
