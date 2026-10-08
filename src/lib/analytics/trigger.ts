import { track } from './index'

export function attachAnalyticsTriggers() {
	document.addEventListener('click', e => {
		const target = e.target as HTMLElement

		const eventName = target.getAttribute('data-analytics-event')

		if (eventName) {
			const dataAttr = target.getAttribute('data-analytics-data')
			const data: Record<string, unknown> | undefined = dataAttr
				? JSON.parse(dataAttr)
				: undefined

			track(eventName, data)
		}
	})
}
